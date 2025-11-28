'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import { createClient } from '@/lib/supabase/client';
import ThemeToggle from './theme-toggle';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const supabase = createClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: '/polls', label: user ? 'My Polls' : 'Polls', protected: false },
    { href: '/polls/create', label: 'Create Poll', protected: false },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-gray-200/50 dark:border-gray-800/50'
        : 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-transparent'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
              S
            </div>
            <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              SnapVote
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                (!link.protected || user) && (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors ${pathname === link.href
                      ? 'text-primary'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                      }`}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-fade-in" />
                    )}
                  </Link>
                )
              ))}
            </div>

            <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              <ThemeToggle />

              {!isLoading && (
                user ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/auth/login"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Get Started
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-full h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
          }`}
        style={{ top: '64px' }}
      >
        <div className="flex flex-col p-4 space-y-4">
          {navLinks.map((link) => (
            (!link.protected || user) && (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-medium px-4 py-3 rounded-xl transition-colors ${pathname === link.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          ))}

          <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />

          {!isLoading && (
            user ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  Signed in as {user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-lg font-medium text-red-500 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 p-4">
                <Link
                  href="/auth/login"
                  className="w-full text-center py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="w-full text-center py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}