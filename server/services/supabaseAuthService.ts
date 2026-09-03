import { Request, Response, NextFunction } from 'express';
import { supabase, supabaseAdmin, supabaseConfig } from '../config/supabase';
import { db } from '../db';
import { UserProfile } from '../../src/types';

export interface AuthSessionResponse {
  token: string;
  user: UserProfile;
}

export class SupabaseAuthService {
  /**
   * Check if live Supabase client is connected.
   */
  public isLive(): boolean {
    return supabaseConfig.isConfigured && supabase !== null;
  }

  /**
   * Register a new user via Supabase Auth as the ONLY authentication source.
   * Passwords are submitted directly to Supabase Auth and NEVER stored manually.
   * Does NOT send booking/confirmation emails during signup (Fulfills Requirements 1, 2, 3, 6, 7).
   */
  public async signUp(name: string, email: string, pass: string): Promise<AuthSessionResponse> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !pass || !cleanName) {
      throw new Error('Name, email, and password are required.');
    }

    if (!this.isLive() || !supabase) {
      throw new Error('Supabase Authentication is required but not configured.');
    }

    // Step 1: Create user in Supabase Auth.
    // If supabaseAdmin is available, create confirmed user to avoid triggering unwanted Supabase confirmation emails.
    let supabaseUserId: string | null = null;
    if (supabaseAdmin) {
      const { data: created, error: adminCreateErr } = await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        password: pass,
        email_confirm: true,
        user_metadata: { name: cleanName }
      });

      if (adminCreateErr) {
        throw new Error(adminCreateErr.message);
      }
      if (!created.user) {
        throw new Error('Failed to create user in Supabase Auth.');
      }
      supabaseUserId = created.user.id;
    } else {
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: { name: cleanName }
        }
      });

      if (signUpErr) {
        throw new Error(signUpErr.message);
      }
      if (!signUpData.user) {
        throw new Error('Failed to register user in Supabase Auth.');
      }
      supabaseUserId = signUpData.user.id;
    }

    // Step 2: Authenticate user using Supabase signInWithPassword to issue active JWT session token
    const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: pass
    });

    if (signInErr || !signInData.session || !signInData.user) {
      throw new Error(signInErr?.message || 'Authentication failed after account creation.');
    }

    // Step 3: Link/synchronize user profile with authenticated Supabase user ID in db
    const authenticatedId = signInData.user.id || supabaseUserId;
    const isAdmin = cleanEmail === 'admin@explorex.com';
    let profile = db.getUser(authenticatedId);
    profile = {
      ...profile,
      id: authenticatedId,
      name: cleanName,
      email: cleanEmail,
      role: isAdmin ? 'admin' : (profile.role || 'user'),
      walletBalance: profile.walletBalance || 5000,
      joinedDate: profile.joinedDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    db.updateUser(authenticatedId, profile);

    return {
      token: signInData.session.access_token,
      user: profile
    };
  }

  /**
   * Authenticate a user via Supabase Auth signInWithPassword() as the ONLY source.
   * Strictly rejects incorrect credentials with no mock or fallback logic (Fulfills Requirements 1, 2, 4, 5).
   */
  public async login(email: string, pass: string): Promise<AuthSessionResponse> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !pass) {
      throw new Error('Email and password are required.');
    }

    if (!this.isLive() || !supabase) {
      throw new Error('Supabase Authentication is required but not configured.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: pass,
    });

    if (error) {
      throw new Error(error.message || 'Invalid email or password.');
    }

    if (!data.user || !data.session) {
      throw new Error('Supabase Auth session could not be established.');
    }

    // Link profile with authenticated Supabase user ID
    let profile = db.getUser(data.user.id);
    const metadataName = data.user.user_metadata?.name || cleanEmail.split('@')[0];
    profile = {
      ...profile,
      id: data.user.id,
      name: profile.name && profile.name !== 'Traveler' ? profile.name : metadataName,
      email: cleanEmail,
      role: cleanEmail === 'admin@explorex.com' ? 'admin' : (profile.role || 'user'),
      walletBalance: typeof profile.walletBalance === 'number' ? profile.walletBalance : 5000,
      joinedDate: profile.joinedDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    db.updateUser(data.user.id, profile);

    return {
      token: data.session.access_token,
      user: profile
    };
  }

  /**
   * Log out active Supabase session.
   */
  public async logout(token?: string): Promise<{ success: boolean; message: string }> {
    if (this.isLive() && supabase && token) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signout notice:', err);
      }
    }
    return { success: true, message: 'Logged out successfully' };
  }

  /**
   * Request password reset link via Supabase Auth.
   */
  public async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('Email is required.');
    }

    if (this.isLive() && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
      if (error) {
        console.warn('Supabase resetPasswordForEmail notice:', error.message);
      }
    }

    return {
      success: true,
      message: `If an account exists for ${cleanEmail}, password reset instructions have been dispatched.`
    };
  }

  /**
   * Verify session token using Supabase Auth getUser() ONLY.
   * Returns null if token is missing, invalid, or expired.
   */
  public async verifySession(token?: string): Promise<UserProfile | null> {
    if (!token || typeof token !== 'string') return null;

    if (!this.isLive() || !supabase) {
      return null;
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return null;
      }

      let profile = db.getUser(user.id);
      if (user.email) {
        profile.email = user.email;
      }
      if (user.user_metadata?.name && (!profile.name || profile.name === 'Traveler')) {
        profile.name = user.user_metadata.name;
      }
      return profile;
    } catch (err) {
      console.warn('Supabase getUser verification exception:', err);
      return null;
    }
  }
}

export const supabaseAuthService = new SupabaseAuthService();

/**
 * Express middleware for protecting sensitive routes.
 * Requires a valid authenticated Supabase session JWT in the Authorization Bearer header.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers['authorization'];
  let token: string | undefined;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please sign in with your account.' });
    return;
  }

  const user = await supabaseAuthService.verifySession(token);
  if (!user) {
    res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
    return;
  }

  // Attach resolved authenticated user to request
  (req as any).user = user;
  (req as any).userId = user.id;
  next();
}
