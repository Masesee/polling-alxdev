import Image from "next/image";
import Link from "next/link";
import { redirect } from 'next/navigation';
import { createServerSupabase } from '../lib/supabase/server';

export default async function Home() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/polls');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center text-center max-w-3xl mx-auto w-full">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-900 dark:text-white">Welcome to SnapVote</h1>
        <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
          Create polls, share them with QR codes, and collect votes easily.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mb-12">
          <div className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 border border-white/20 rounded-lg p-8 flex flex-col items-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <h2 className="text-2xl font-extrabold mb-4 dark:text-white">Create Polls</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Create custom polls with multiple options and share them with others.
            </p>
            <Link
              href="/polls/create"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-auto transition-all duration-300 hover:scale-105"
            >
              Create Poll
            </Link>
          </div>

          <div className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 border border-white/20 rounded-lg p-8 flex flex-col items-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <h2 className="text-2xl font-extrabold mb-4 dark:text-white">View Results</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              See real-time results and analytics for your polls.
            </p>
            <Link
              href="/polls"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-auto transition-all duration-300 hover:scale-105"
            >
              View Polls
            </Link>
          </div>
        </div>

        <div className="w-full max-w-2xl backdrop-blur-md bg-gray-50/70 dark:bg-gray-800/70 border border-white/20 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-extrabold mb-4 dark:text-white">Get Started</h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/auth/login"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="backdrop-blur-md bg-white/70 dark:bg-gray-700/70 border border-white/20 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-md hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105"
            >
              Register
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}