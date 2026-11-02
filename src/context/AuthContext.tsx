import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useUser as useClerkUser, useClerk } from '@clerk/clerk-react';

export interface WelNexUser {
  id: string;
  fullName: string;
  firstName: string;
  primaryEmailAddress: {
    emailAddress: string;
  };
  imageUrl: string;
  isAdmin: boolean;
  role: string;
  publicMetadata?: {
    role?: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: WelNexUser | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  isClerkConfigured: boolean;
  signInWithGoogle: (email?: string, name?: string) => void;
  signOut: () => Promise<void> | void;
  isAuthorizedAdmin: (email?: string) => boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

const AUTH_STORAGE_KEY = 'welnex_auth_session';
const ADMIN_TEAM_STORAGE_KEY = 'welnex_admin_team';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function isEmailAuthorizedAdmin(email?: string, userMetadata?: { role?: string; [key: string]: any }): boolean {
  if (userMetadata?.role === 'admin' || userMetadata?.role === 'super_admin') return true;
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (normalized === 'rprohan06@gmail.com') return true;

  try {
    const raw = localStorage.getItem(ADMIN_TEAM_STORAGE_KEY);
    if (raw) {
      const team = JSON.parse(raw);
      if (Array.isArray(team)) {
        return team.some((member: any) => member.email && member.email.trim().toLowerCase() === normalized);
      }
    }
  } catch (err) {
    console.error('Error checking admin authorization:', err);
  }

  // Built-in fallback authorized team emails
  const defaultAdminEmails = [
    'priya.sharma@welnex.in',
    'amitav.roy@welnex.in',
    'neha.d@welnex.in'
  ];
  return defaultAdminEmails.includes(normalized);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn: clerkSignedIn } = useClerkUser();
  const clerk = useClerk();

  const [localUser, setLocalUser] = useState<WelNexUser | null>(null);
  const [isLocalLoaded, setIsLocalLoaded] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Check if Clerk key is provided in environment
  const clerkPubKey = (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = typeof clerkPubKey === 'string' && clerkPubKey.startsWith('pk_') && !clerkPubKey.includes('your_clerk');

  // Load persisted session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: WelNexUser = JSON.parse(stored);
        const isAdmin = isEmailAuthorizedAdmin(parsed.primaryEmailAddress?.emailAddress, parsed.publicMetadata);
        setLocalUser({
          ...parsed,
          isAdmin,
          role: isAdmin ? (parsed.primaryEmailAddress?.emailAddress === 'rprohan06@gmail.com' ? 'Super Admin' : 'Admin') : 'Verified Investor',
          publicMetadata: {
            role: isAdmin ? 'admin' : (parsed.publicMetadata?.role || 'investor')
          }
        });
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    } finally {
      setIsLocalLoaded(true);
    }
  }, []);

  // Compute live active user (prioritizing live Clerk session)
  const activeUser: WelNexUser | null = useMemo(() => {
    if (clerkSignedIn && clerkUser) {
      const clerkEmail = clerkUser.primaryEmailAddress?.emailAddress || '';
      const clerkName = clerkUser.fullName || clerkUser.firstName || (clerkEmail ? clerkEmail.split('@')[0] : 'Investor');
      const clerkFirstName = clerkUser.firstName || clerkName.split(' ')[0];
      const isAdmin = isEmailAuthorizedAdmin(clerkEmail, clerkUser.publicMetadata);

      return {
        id: clerkUser.id,
        fullName: clerkName,
        firstName: clerkFirstName,
        primaryEmailAddress: {
          emailAddress: clerkEmail,
        },
        imageUrl: clerkUser.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(clerkEmail)}&backgroundColor=C16226&textColor=FAF5EE`,
        isAdmin,
        role: isAdmin ? (clerkEmail.toLowerCase().trim() === 'rprohan06@gmail.com' ? 'Super Admin' : 'Admin') : 'Verified Investor',
        publicMetadata: {
          ...clerkUser.publicMetadata,
          role: isAdmin ? 'admin' : ((clerkUser.publicMetadata as any)?.role || 'investor'),
        },
      };
    }
    return localUser;
  }, [clerkSignedIn, clerkUser, localUser]);

  // Sync admin auth flag to localStorage if user is admin
  useEffect(() => {
    if (activeUser?.isAdmin) {
      localStorage.setItem('welnex_admin_auth', 'true');
    }
  }, [activeUser]);

  const signInWithGoogle = (customEmail?: string, customName?: string) => {
    const email = customEmail ? customEmail.trim() : 'investor@gmail.com';
    const name = customName ? customName.trim() : (customEmail ? customEmail.split('@')[0].replace(/[._]/g, ' ') : 'Verified Investor');
    const firstName = name.split(' ')[0];
    const isAdmin = isEmailAuthorizedAdmin(email);

    const avatarSeed = encodeURIComponent(email);
    const imageUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=C16226&textColor=FAF5EE`;

    const newUser: WelNexUser = {
      id: `user_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`,
      fullName: name,
      firstName,
      primaryEmailAddress: {
        emailAddress: email
      },
      imageUrl,
      isAdmin,
      role: isAdmin ? (email.toLowerCase().trim() === 'rprohan06@gmail.com' ? 'Super Admin' : 'Admin') : 'Verified Investor',
      publicMetadata: {
        role: isAdmin ? 'admin' : 'investor'
      }
    };

    setLocalUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    if (isAdmin) {
      localStorage.setItem('welnex_admin_auth', 'true');
    }
    setIsAuthModalOpen(false);
  };

  const signOut = async () => {
    setLocalUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('welnex_admin_auth');
    if (clerkSignedIn) {
      try {
        await clerk.signOut();
      } catch (e) {
        console.error('Error signing out of Clerk:', e);
      }
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user: activeUser,
        isSignedIn: Boolean(activeUser),
        isLoaded: clerkLoaded && isLocalLoaded,
        isClerkConfigured,
        signInWithGoogle,
        signOut,
        isAuthorizedAdmin: isEmailAuthorizedAdmin,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook matching Clerk's useUser interface for high compatibility
export const useUser = () => {
  const { user, isSignedIn, isLoaded } = useAuth();
  return {
    user,
    isSignedIn,
    isLoaded
  };
};
