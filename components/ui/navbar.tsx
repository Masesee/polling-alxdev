'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
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
        </div>
      </div>
    </nav>
  );
}