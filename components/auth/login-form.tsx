'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';

/**
 * LoginForm component handles user authentication via email and password.
 * It provides input fields for email and password, client-side validation,
 * and integrates with Supabase for authentication.
 */
export default function LoginForm() {
  // State variables for email, password, loading status, and error messages.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // State to manage validation errors for individual fields.
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  // Ref for the email input field to allow programmatic focus.
  const emailRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const supabase = createClient();

  /**
   * Handles the form submission for user login.
   * Performs client-side validation and attempts to sign in the user with Supabase.
   * @param e The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    // Initialize an object to hold validation errors.
    const nextFieldErrors: { email?: string; password?: string } = {};
    // Validate if email and password fields are not empty.
    if (!email) nextFieldErrors.email = 'Email is required';
    if (!password) nextFieldErrors.password = 'Password is required';
    setFieldErrors(nextFieldErrors);
    
    // If there are any validation errors, stop the submission and focus on the email field if it has an error.
    if (Object.keys(nextFieldErrors).length > 0) {
      setIsLoading(false);
      if (nextFieldErrors.email && emailRef.current) emailRef.current.focus();
      return;
    }

    // Attempt to sign in with Supabase using the provided email and password.
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If an error occurs during Supabase authentication, display the error message.
    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    // On successful login, redirect the user to the polls page.
    router.push('/polls');
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to manage your polls
        </p>
      </div>
      {error && <p role="alert" className="text-red-500 text-sm text-center">{error}</p>}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4 rounded-md shadow-sm">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`relative block w-full appearance-none rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none sm:text-sm border ${fieldErrors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              ref={emailRef}
            />
            {fieldErrors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={`relative block w-full appearance-none rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none sm:text-sm border ${fieldErrors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            />
            {fieldErrors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
          >
            {isLoading && <Spinner className="text-white" />}
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
        <div className="text-center text-sm mt-4">
          Don't have an account? {' '}
          <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}