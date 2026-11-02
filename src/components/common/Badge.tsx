import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'copper' | 'champagne' | 'espresso' | 'outline' | 'success' | 'subtle';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  withDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'copper',
  size = 'sm',
  className = '',
  withDot = false
}) => {
  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5'
  }[size];

  const variantStyles = {
    copper: 'bg-copper-500/15 text-copper-700 border border-copper-500/30',
    champagne: 'bg-champagne-500/20 text-espresso-800 border border-champagne-500/40',
    espresso: 'bg-espresso-700/10 text-espresso-900 border border-espresso-700/20',
    outline: 'border border-espresso-300/40 text-espresso-700',
    success: 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30',
    subtle: 'bg-sand-200/80 text-espresso-700 border border-sand-300'
  }[variant];

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeStyles} ${variantStyles} ${className}`}>
      {withDot && (
        <span className="w-1.5 h-1.5 rounded-full bg-copper-500 animate-pulse" />
      )}
      {children}
    </span>
  );
};
