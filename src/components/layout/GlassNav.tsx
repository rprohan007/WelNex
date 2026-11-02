import React, { useState, useEffect, useRef } from 'react';
import { WelNexLogo } from '../common/WelNexLogo';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  Shield,
  Sparkles,
  Compass,
  GraduationCap,
  Radio,
  LogOut,
  ChevronDown,
  Sliders,
  Mail
} from 'lucide-react';

interface GlassNavProps {
  onOpenAdminLogin: () => void;
  onOpenExplore: () => void;
  onOpenCompare?: () => void;
  onOpenCalculators?: () => void;
  onOpenAcademy?: () => void;
  onOpenRadar?: () => void;
  onOpenContact?: () => void;
  onOpenSimulator?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  currentView?: 'home' | 'catalogue' | 'detail' | 'compare' | 'calculators' | 'academy' | 'radar' | 'simulator' | 'contact' | 'admin';
  onNavigateHome?: () => void;
}

export const GlassNav: React.FC<GlassNavProps> = ({
  onOpenAdminLogin,
  onOpenExplore,
  onOpenAcademy,
  onOpenRadar,
  onOpenContact,
  onOpenSimulator,
  currentView = 'home',
  onNavigateHome
}) => {
  const { user, isSignedIn, signOut, openAuthModal } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeNav = 
    currentView === 'catalogue' || currentView === 'detail' ? 'Explore Assets' :
    currentView === 'academy' ? 'Academy' :
    currentView === 'radar' ? 'Radar' :
    currentView === 'contact' ? 'Contact Us' :
    currentView === 'admin' ? 'Admin' : 'Home';

  // Core 5 Navigation Links strictly per Phase 7 requirements:
  // 1. Home, 2. Explore Assets, 3. Academy, 4. Radar, 5. Contact Us
  const navLinks = [
    { 
      name: 'Home', 
      onClick: () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (onNavigateHome) onNavigateHome();
      }, 
      icon: Sparkles 
    },
    { 
      name: 'Explore Assets', 
      onClick: () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        onOpenExplore();
      }, 
      icon: Compass 
    },
    { 
      name: 'Academy', 
      onClick: () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (onOpenAcademy) onOpenAcademy();
      }, 
      icon: GraduationCap 
    },
    { 
      name: 'Radar', 
      onClick: () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (onOpenRadar) onOpenRadar();
      }, 
      icon: Radio 
    },
    { 
      name: 'Contact Us', 
      onClick: () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (onOpenContact) onOpenContact();
      }, 
      icon: Mail 
    },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (link.onClick) {
      link.onClick();
    }
  };

  return (
    <nav
      className={`fixed top-10 left-0 right-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'glass-nav shadow-glass-md py-2.5'
          : 'bg-sand/90 backdrop-blur-md border-b border-champagne-500/30 py-3.5'
      }`}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo with warm bronze & espresso styling - Clean WelNex without tagline */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              if (onNavigateHome) {
                onNavigateHome();
              }
            }}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            aria-label="WelNex Homepage"
          >
            <WelNexLogo size="md" />
          </a>


          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeNav === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'text-copper-700 bg-copper-500/15 font-semibold border border-copper-500/30'
                      : 'text-espresso-800/90 hover:text-copper-600 hover:bg-copper-500/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" />
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-copper-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Elements: User Profile & Admin Portal */}
          <div className="hidden md:flex items-center gap-2.5">
            {isSignedIn && user ? (
              /* Authenticated User Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-white/80 hover:bg-white border border-champagne-500/50 hover:border-copper-500/50 shadow-xs transition-all cursor-pointer group"
                  aria-label="User account menu"
                >
                  <div className="relative">
                    <img
                      src={user.imageUrl}
                      alt={user.fullName}
                      className="w-7 h-7 rounded-xl object-cover border border-champagne-500/40"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div className="text-left hidden lg:block pr-1">
                    <span className="text-xs font-bold text-espresso-950 block leading-tight">
                      {user.firstName || user.fullName}
                    </span>
                    <span className="text-[10px] text-copper-700 font-medium block leading-none">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-espresso-600 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Glass Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FAF5EE]/95 border border-champagne-500/60 shadow-2xl backdrop-blur-xl p-3 z-50 animate-fadeIn text-left">
                    {/* User Header */}
                    <div className="p-2.5 rounded-xl bg-champagne-500/20 border border-champagne-500/30 mb-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.imageUrl}
                          alt={user.fullName}
                          className="w-9 h-9 rounded-xl border border-copper-500/40"
                        />
                        <div className="overflow-hidden">
                          <span className="text-xs font-bold text-espresso-950 block truncate">
                            {user.fullName}
                          </span>
                          <span className="text-[10px] text-espresso-600 block truncate font-mono">
                            {user.primaryEmailAddress.emailAddress}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="px-2 py-0.5 rounded-md bg-copper-500/15 text-copper-700 font-bold">
                          {user.role}
                        </span>
                        <span className="text-espresso-500 font-mono text-[9px] truncate max-w-[120px]">
                          ID: {user.id.substring(0, 10)}...
                        </span>
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="space-y-1">
                      {onOpenSimulator && (
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                            onOpenSimulator();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-espresso-800 hover:text-copper-700 hover:bg-copper-500/10 transition-colors text-left cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5 text-copper-600" />
                          <span>Virtual Portfolio Workspace</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                          onOpenAdminLogin();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-espresso-800 hover:text-copper-700 hover:bg-copper-500/10 transition-colors text-left cursor-pointer"
                      >
                        <Shield className="w-3.5 h-3.5 text-copper-600" />
                        <span>Admin CMS Dashboard</span>
                      </button>

                      <div className="my-1 border-t border-champagne-500/30" />

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-700 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Sign In Button */
              <button
                onClick={openAuthModal}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-copper-800 bg-white/90 hover:bg-white border border-champagne-500/50 hover:border-copper-500/60 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {/* Small Google G */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign In</span>
              </button>
            )}

            {/* Admin Portal Quick Link */}
            <Button
              variant={currentView === 'admin' ? 'primary' : 'secondary'}
              size="sm"
              icon={<Shield className="w-3.5 h-3.5 text-copper-600" />}
              iconPosition="left"
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                onOpenAdminLogin();
              }}
              className="text-xs tracking-wide uppercase font-semibold cursor-pointer"
            >
              {currentView === 'admin' ? 'Admin Portal' : 'Admin'}
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-xl border border-champagne-500/40 bg-white/80 text-espresso-800 hover:bg-copper-500/10 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card-elevated border-b border-champagne-500/30 px-5 pt-3 pb-6 mt-2 space-y-2 animate-fadeIn bg-sand-50/95 backdrop-blur-xl">
          {/* User Status Bar in Mobile Menu */}
          {isSignedIn && user ? (
            <div className="p-3 rounded-2xl bg-white/90 border border-champagne-500/40 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={user.imageUrl}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-xl object-cover border border-champagne-500/40"
                />
                <div>
                  <span className="text-xs font-bold text-espresso-950 block">{user.fullName}</span>
                  <span className="text-[10px] text-copper-700 block">{user.primaryEmailAddress.emailAddress}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut();
                }}
                className="text-xs font-bold text-red-600 hover:text-red-700 p-1"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="mb-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-espresso-900 border border-champagne-500/50 shadow-xs flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign In with Google (Gmail)</span>
              </button>
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeNav === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-copper-500/20 text-copper-700 font-semibold border border-copper-500/30'
                      : 'text-espresso-800 hover:bg-copper-500/10'
                  }`}
                >
                  <Icon className="w-4 h-4 text-copper-600" />
                  <span>{link.name}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-champagne-500/30">
            <Button
              variant={currentView === 'admin' ? 'primary' : 'secondary'}
              size="md"
              icon={<Shield className="w-4 h-4 text-copper-600" />}
              iconPosition="left"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                onOpenAdminLogin();
              }}
              className="w-full text-xs uppercase tracking-wider font-semibold"
            >
              {currentView === 'admin' ? 'Admin Portal' : 'Admin Portal'}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
