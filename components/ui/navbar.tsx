'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react'; // Import useState
import { useAuth } from '@/lib/context/auth-context';
import { createClient } from '@/lib/supabase/client';
import ThemeToggle from './theme-toggle';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const supabase = createClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };
  
  // Don't show navbar on homepage
  if (pathname === '/') return null;
  
  return (
    <nav className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 shadow-lg py-3 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          href="/" 
          className="text-lg font-medium hover:text-blue-600 transition-colors dark:text-white"
        >
          SnapVote
        </Link>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 dark:text-gray-200 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link 
            href="/polls" 
            className={`hover:text-blue-600 transition-colors dark:text-gray-200 ${pathname.startsWith('/polls') && pathname !== '/polls/create' ? 'text-blue-600 font-medium' : ''}`}
          >
            My Polls
          </Link>
          <Link 
            href="/polls/create" 
            className={`hover:text-blue-600 transition-colors dark:text-gray-200 ${pathname === '/polls/create' ? 'text-blue-600 font-medium' : ''}`}
          >
            Create Poll
          </Link>
          <ThemeToggle />
          {!isLoading && user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                {user.user_metadata?.full_name || user.email}
              </span>
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            !isLoading && (
              <Link 
                href="/auth/login"
                className={`hover:text-blue-600 transition-colors dark:text-gray-200 ${pathname === '/auth/login' ? 'text-blue-600 font-medium' : ''}`}
              >
                Login
              </Link>
            )
          )}
        </div>
      </div>

      {/* Mobile menu content */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 space-y-2">
          <Link 
            href="/polls" 
            className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${pathname.startsWith('/polls') && pathname !== '/polls/create' ? 'text-blue-600 font-medium' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            My Polls
          </Link>
          <Link 
            href="/polls/create" 
            className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${pathname === '/polls/create' ? 'text-blue-600 font-medium' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Create Poll
          </Link>
          <div className="px-3 py-2">
            <ThemeToggle />
          </div>
          {!isLoading && user ? (
            <div className="block px-3 py-2">
              <span className="text-gray-700 dark:text-gray-300 text-sm block mb-2">
                {user.user_metadata?.full_name || user.email}
              </span>
              <button 
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="w-full text-left text-red-500 hover:text-red-700 transition-colors text-sm px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          ) : (
            !isLoading && (
              <Link 
                href="/auth/login"
                className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${pathname === '/auth/login' ? 'text-blue-600 font-medium' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
}