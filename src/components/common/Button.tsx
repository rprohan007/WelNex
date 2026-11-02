import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-xl gap-2 font-medium',
    lg: 'text-base px-7 py-3.5 rounded-2xl gap-2.5 font-semibold'
  }[size];

  const variantStyles = {
    primary: 'bg-gradient-to-r from-copper-500 to-copper-600 text-sand-50 hover:from-copper-600 hover:to-copper-700 shadow-md shadow-copper-500/25 hover:shadow-copper-glow active:scale-[0.98]',
    secondary: 'bg-white/80 text-espresso-900 border border-champagne-500/50 hover:border-copper-500/80 hover:bg-white shadow-sm',
    outline: 'border border-copper-500/40 text-copper-700 hover:bg-copper-500/10 active:scale-[0.98]',
    ghost: 'text-espresso-700 hover:bg-copper-500/10'
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  );
};
