import React from 'react';
import welnexLogoImg from '../../assets/welnex-logo.jpg';

interface WelNexLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const WelNexLogo: React.FC<WelNexLogoProps> = ({
  className = '',
  size = 'md'
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  }[size];

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon Image: Interlocking bars and dynamic arc in warm bronze */}
      <div className={`relative ${iconDimensions} rounded-xl overflow-hidden border border-champagne-500/50 shadow-sm shadow-copper-500/15 flex-shrink-0 bg-[#FAF5EE]`}>
        <img
          src={welnexLogoImg}
          alt="WelNex"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Typography: WelNex ONLY */}
      <div className="flex flex-col text-left justify-center">
        <div className={`font-display font-extrabold tracking-tight leading-none text-espresso-950 ${titleSizes}`}>
          Wel<span className="text-copper-600">Nex</span>
        </div>
      </div>
    </div>
  );
};

