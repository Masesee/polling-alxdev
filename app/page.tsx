import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <main className="flex flex-col items-center text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome to Polling App</h1>
        <p className="text-xl mb-8">
          Create polls, share them with QR codes, and collect votes easily.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-12">
          <div className="border rounded-lg p-6 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">Create Polls</h2>
            <p className="mb-6 text-gray-600">
              Create custom polls with multiple options and share them with others.
            </p>
            <Link 
              href="/polls/create"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-auto"
            >
              Create Poll
            </Link>
          </div>
          
          <div className="border rounded-lg p-6 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">View Results</h2>
            <p className="mb-6 text-gray-600">
              See real-time results and analytics for your polls.
            </p>
            <Link 
              href="/polls"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-auto"
            >
              View Polls
            </Link>
          </div>
        </div>
        
        <div className="w-full max-w-2xl border rounded-lg p-8 bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              href="/auth/login"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/register"
              className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Register
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
