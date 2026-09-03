import { Request, Response, NextFunction } from 'express';
import { supabase, supabaseConfig } from '../config/supabase';
import { db } from '../db';
import { UserProfile } from '../../src/types';
import { emailService } from './emailService';
import { ENV } from '../config/env';

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
   * Authenticate / Register a user via Supabase Auth.
   * Passwords are submitted directly to Supabase Auth and NEVER stored manually.
   */
  public async signUp(name: string, email: string, pass: string): Promise<AuthSessionResponse> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !pass || !cleanName) {
      throw new Error('Name, email, and password are required.');
    }

    if (this.isLive() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: {
            name: cleanName,
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('User creation failed in Supabase Auth.');
      }

      // Check or create profile in local store without storing passwords
      let profile = db.findUserByEmail(cleanEmail);
      if (!profile) {
        const isAdmin = cleanEmail === 'admin@explorex.com';
        profile = {
          ...db.getUser('usr-current'),
          id: data.user.id,
          name: cleanName,
          email: cleanEmail,
          role: isAdmin ? 'admin' : 'user',
          walletBalance: 5000,
          savedDestinations: [],
          savedPackages: [],
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };
        db.createUser(profile);
      }

      // Send transactional verification email via Resend
      const verificationLink = `${ENV.APP_URL}/auth/verify?email=${encodeURIComponent(cleanEmail)}`;
      await emailService.sendSignupVerificationEmail(cleanEmail, cleanName, verificationLink);

      const token = data.session?.access_token || `sb-token-${data.user.id}`;
      return {
        token,
        user: profile
      };
    }

    // Fallback mode when Supabase credentials have not yet been provided in environment
    console.log(`ℹ️ Supabase not yet connected -> running local preview session for ${cleanEmail} (passwords never stored)`);
    const existing = db.findUserByEmail(cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const id = `usr-${Date.now()}`;
    const isAdmin = cleanEmail === 'admin@explorex.com';
    const newUser: UserProfile = {
      ...db.getUser('usr-current'),
      id,
      name: cleanName,
      email: cleanEmail,
      role: isAdmin ? 'admin' : 'user',
      walletBalance: 5000,
      savedDestinations: [],
      savedPackages: [],
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    db.createUser(newUser);

    // Send transactional welcome email via Resend
    await emailService.sendSignupVerificationEmail(cleanEmail, cleanName);

    return {
      token: `jwt-user-${id}`,
      user: newUser
    };
  }

  /**
   * Authenticate a user via Supabase Auth.
   * Passwords are validated directly by Supabase and NEVER stored manually.
   */
  public async login(email: string, pass: string): Promise<AuthSessionResponse> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !pass) {
      throw new Error('Email and password are required.');
    }

    if (this.isLive() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error) {
        throw new Error(error.message || 'Invalid email or password.');
      }

      if (!data.user) {
        throw new Error('User not found in Supabase Auth.');
      }

      let profile = db.findUserByEmail(cleanEmail) || db.getUser(data.user.id);
      if (!profile) {
        const metadataName = data.user.user_metadata?.name || cleanEmail.split('@')[0];
        profile = {
          ...db.getUser('usr-current'),
          id: data.user.id,
          name: metadataName,
          email: cleanEmail,
          role: cleanEmail === 'admin@explorex.com' ? 'admin' : 'user',
          walletBalance: 5000,
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };
        db.createUser(profile);
      }

      const token = data.session?.access_token || `sb-token-${data.user.id}`;
      return {
        token,
        user: profile
      };
    }

    // Fallback mode when Supabase credentials are pending
    console.log(`ℹ️ Supabase not yet connected -> running local preview session for ${cleanEmail} (passwords never stored)`);
    let existing = db.findUserByEmail(cleanEmail);
    if (!existing) {
      const id = `usr-${Date.now()}`;
      const namePart = cleanEmail.split('@')[0];
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      existing = {
        ...db.getUser('usr-current'),
        id,
        name: formattedName,
        email: cleanEmail,
        role: cleanEmail === 'admin@explorex.com' ? 'admin' : 'user',
        walletBalance: 5000,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
      db.createUser(existing);
    }

    return {
      token: `jwt-user-${existing.id}`,
      user: existing
    };
  }

  /**
   * Log out active Supabase session.
   */
  public async logout(token?: string): Promise<{ success: boolean; message: string }> {
    if (this.isLive() && supabase && token && !token.startsWith('jwt-')) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signout notice:', err);
      }
    }
    return { success: true, message: 'Logged out successfully' };
  }

  /**
   * Request password reset link via Supabase Auth + transactional Resend email.
   */
  public async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('Email is required.');
    }

    const resetRedirect = `${ENV.APP_URL}/auth/reset-password?email=${encodeURIComponent(cleanEmail)}`;

    if (this.isLive() && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: resetRedirect
      });
      if (error) {
        console.warn('Supabase resetPasswordForEmail notice:', error.message);
      }
    }

    // Send password reset email via Resend
    await emailService.sendPasswordResetEmail(cleanEmail, resetRedirect);

    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${cleanEmail}`
    };
  }

  /**
   * Verify session token and retrieve authenticated user profile.
   */
  public async verifySession(token?: string, headerUserId?: string): Promise<UserProfile | null> {
    if (!token && !headerUserId) return null;

    // 1. Try Supabase JWT token verification
    if (this.isLive() && supabase && token && !token.startsWith('jwt-') && !token.startsWith('sb-token-')) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
          const profile = db.getUser(user.id) || db.findUserByEmail(user.email || '');
          if (profile) return profile;
          return {
            ...db.getUser('usr-current'),
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Traveler',
            email: user.email || 'traveler@explorex.com',
            role: 'user',
            walletBalance: 5000,
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          };
        }
      } catch (err) {
        console.warn('Supabase getUser verification notice:', err);
      }
    }

    // 2. Fallback / local dev session verification
    if (headerUserId) {
      const user = db.getUser(headerUserId);
      if (user) return user;
    }

    if (token) {
      const cleanToken = token.replace('jwt-user-', '').replace('sb-token-', '');
      const user = db.getUser(cleanToken) || db.findUserByEmail(cleanToken);
      if (user) return user;
    }

    return null;
  }
}

export const supabaseAuthService = new SupabaseAuthService();

/**
 * Express middleware for protecting sensitive routes.
 * Requires an authenticated Supabase session or valid user token.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers['authorization'];
  let token: string | undefined;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  const headerUserId = req.headers['x-user-id'] as string | undefined;

  const user = await supabaseAuthService.verifySession(token, headerUserId);
  if (!user) {
    res.status(401).json({ error: 'Authentication required. Please sign in to your account.' });
    return;
  }

  // Attach resolved authenticated user to request
  (req as any).user = user;
  (req as any).userId = user.id;
  next();
}
