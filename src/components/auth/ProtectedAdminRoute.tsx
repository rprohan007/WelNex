import React, { useEffect, useState } from 'react';
import { useAuth, isEmailAuthorizedAdmin } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  onRedirectHome: () => void;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
  onRedirectHome
}) => {
  const { user, isSignedIn, isLoaded, openAuthModal } = useAuth();
  const [countdown, setCountdown] = useState(3);

  const isUserAdmin = Boolean(
    isSignedIn &&
    user &&
    (
      user.isAdmin ||
      user.publicMetadata?.role === 'admin' ||
      user.publicMetadata?.role === 'super_admin' ||
      isEmailAuthorizedAdmin(user.primaryEmailAddress?.emailAddress, user.publicMetadata)
    )
  );

  // Auto-redirect unauthorized visitors back to home and clean address bar
  useEffect(() => {
    if (!isLoaded) return;

    if (!isUserAdmin) {
      // Clean up URL if /admin or #admin was entered directly
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        window.history.replaceState(null, '', '/');
      }

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onRedirectHome();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoaded, isUserAdmin, onRedirectHome]);

  // Loading state while auth session restores
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center p-4">
        <div className="p-6 rounded-2xl bg-white/80 border border-champagne-500/40 text-center space-y-3 shadow-sm">
          <div className="w-8 h-8 rounded-full border-2 border-copper-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-semibold text-espresso-700">Verifying Administrative Privileges...</p>
        </div>
      </div>
    );
  }

  // Access Granted: render CMS
  if (isUserAdmin) {
    return <>{children}</>;
  }

  // Access Denied (403 Unauthorized Screen)
  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl border border-rose-500/30 shadow-glass-xl p-8 relative text-center space-y-5 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center mx-auto text-rose-700">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-800 text-xs font-bold font-mono mb-2">
            <Lock className="w-3 h-3" />
            403 • ACCESS FORBIDDEN
          </span>
          <h2 className="text-2xl font-display font-extrabold text-espresso-950">
            Unauthorized Admin Access
          </h2>
          <p className="text-xs text-espresso-700 mt-2 leading-relaxed">
            {isSignedIn && user ? (
              <>
                Authenticated as <span className="font-mono font-bold text-espresso-900">{user.primaryEmailAddress?.emailAddress}</span>.
                This account lacks verified <code className="bg-sand-200 px-1 py-0.5 rounded text-copper-800 font-mono text-[11px]">user.publicMetadata.role === 'admin'</code> credentials.
              </>
            ) : (
              'This administrative portal is restricted. Direct access to /admin requires an active session with verified administrator credentials.'
            )}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-sand-100 border border-champagne-500/40 text-[11px] text-espresso-600 text-left">
          <span>Redirecting to homepage in <strong className="font-mono text-copper-700">{countdown}s</strong>...</span>
        </div>

        <div className="space-y-2 pt-1">
          <Button
            variant="primary"
            size="sm"
            onClick={onRedirectHome}
            icon={<ArrowLeft className="w-4 h-4" />}
            iconPosition="left"
            className="w-full text-xs font-bold cursor-pointer"
          >
            Return to Home Page
          </Button>

          {!isSignedIn && (
            <Button
              variant="outline"
              size="sm"
              onClick={openAuthModal}
              className="w-full text-xs font-semibold cursor-pointer"
            >
              Sign In with Admin Account
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

