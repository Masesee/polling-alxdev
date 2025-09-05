'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

/**
 * Defines the shape of the authentication context.
 * @property user The currently authenticated Supabase user, or null if not authenticated.
 * @property isLoading A boolean indicating if the authentication state is currently being loaded.
 */
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

// Create the AuthContext with an initial undefined value.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component manages the authentication state for the application.
 * It listens for Supabase authentication changes and provides the user and loading status to its children.
 * @param children The React nodes to be rendered within the provider's scope.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // State to hold the authenticated user information.
  const [user, setUser] = useState<User | null>(null);
  // State to indicate if the authentication status is still being determined.
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Subscribe to Supabase authentication state changes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // If a session exists, set the user.
        setUser(session.user);
      } else {
        // If no session, clear the user.
        setUser(null);
      }
      // Once the state is determined, set isLoading to false.
      setIsLoading(false);
    });

    // Perform an initial check for the current session when the component mounts.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      }
      setIsLoading(false);
    });

    // Unsubscribe from auth state changes when the component unmounts.
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]); // Dependencies for useEffect: supabase client and router.

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access the authentication context.
 * Throws an error if used outside of an AuthProvider.
 * @returns The authentication context containing the user and isLoading status.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
