import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle' | 'interactive';
  glowEffect?: 'copper' | 'champagne' | 'none';
  as?: React.ElementType;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  glowEffect = 'none',
  as: Component = 'div',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white/65 backdrop-blur-md border border-champagne-500/40 shadow-glass-sm',
    elevated: 'bg-white/80 backdrop-blur-lg border border-champagne-500/50 shadow-glass-md',
    subtle: 'bg-white/45 backdrop-blur-sm border border-champagne-500/30',
    interactive: 'bg-white/65 backdrop-blur-md border border-champagne-500/40 hover:border-copper-500/60 hover:shadow-glass-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer'
  }[variant];

  const glowStyles = {
    none: '',
    copper: 'hover:shadow-copper-glow',
    champagne: 'hover:shadow-champagne-glow'
  }[glowEffect];

  return (
    <Component
      className={`rounded-2xl transition-all ${variantStyles} ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
