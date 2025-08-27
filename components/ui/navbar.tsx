'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };
  
  // Don't show navbar on homepage
  if (pathname === '/') return null;
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm py-3 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          href="/" 
          className="text-lg font-medium hover:text-blue-600 transition-colors dark:text-white"
        >
          SnapVote
        </Link>
        
        <div className="flex gap-6">
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
          {!isLoading && user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                {user.email}
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
    </nav>
  );
}