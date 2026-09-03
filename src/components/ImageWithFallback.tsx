import React, { useState } from 'react';
import { MapPin, ImageOff, Compass, Hotel, Utensils, Landmark, Sun } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackCategory?: string;
  onClick?: () => void;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackCategory,
  onClick
}) => {
  const [hasError, setHasError] = useState<boolean>(!src);

  const getFallbackIcon = () => {
    const cat = (fallbackCategory || '').toLowerCase();
    if (cat.includes('hotel') || cat.includes('stay')) return <Hotel className="w-8 h-8 text-sky-400" />;
    if (cat.includes('food') || cat.includes('restaurant') || cat.includes('cafe')) return <Utensils className="w-8 h-8 text-amber-400" />;
    if (cat.includes('heritage') || cat.includes('fort') || cat.includes('temple')) return <Landmark className="w-8 h-8 text-amber-500" />;
    if (cat.includes('beach') || cat.includes('nature')) return <Sun className="w-8 h-8 text-emerald-400" />;
    return <Compass className="w-8 h-8 text-sky-400" />;
  };

  if (hasError || !src) {
    return (
      <div
        onClick={onClick}
        className={`bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 text-center select-none ${className}`}
      >
        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md mb-1 border border-white/10">
          {getFallbackIcon()}
        </div>
        <span className="text-[11px] font-bold text-slate-200 line-clamp-1">{alt}</span>
        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">ExploreX Verified Place</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      onClick={onClick}
      className={className}
    />
  );
};
