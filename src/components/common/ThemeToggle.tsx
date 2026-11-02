import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative p-2 rounded-xl transition-all duration-300 border border-champagne-500/40 hover:border-copper-500/70 bg-white/80 text-espresso-800 shadow-sm hover:shadow-champagne-glow cursor-pointer ${className}`}
      aria-label="Light mode"
      title="Light mode"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun className="w-4 h-4 text-copper-600 transition-transform duration-300 hover:rotate-45" />
      </div>
    </button>
  );
};
