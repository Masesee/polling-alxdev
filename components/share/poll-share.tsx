'use client';

import { useState, useEffect } from 'react';
import { Poll, ShareLink } from '../../lib/types';

interface PollShareProps {
  pollId: string;
}

export default function PollShare({ pollId }: PollShareProps) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchPollAndShareLink = async () => {
      setIsLoading(true);
      
      // TODO: Implement fetching poll and share link from Supabase
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock poll data
      const mockPoll: Poll = {
        id: pollId,
        question: 'What is your favorite programming language?',
        options: [
          { id: 'opt-1', text: 'JavaScript', votes: 10 },
          { id: 'opt-2', text: 'Python', votes: 8 },
          { id: 'opt-3', text: 'Java', votes: 5 },
        ],
        createdBy: 'user-1',
        createdAt: new Date(),
        isActive: true,
      };
      
      // Mock share link
      const mockShareLink: ShareLink = {
        id: 'share-1',
        pollId,
        url: `https://polling-app.example.com/vote/${pollId}`,
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://polling-app.example.com/vote/' + pollId,
        createdAt: new Date(),
      };
      
      setPoll(mockPoll);
      setShareLink(mockShareLink);
      setIsLoading(false);
    };

    fetchPollAndShareLink();
  }, [pollId]);

  const copyToClipboard = async () => {
    if (!shareLink) return;
    
    try {
      await navigator.clipboard.writeText(shareLink.url);
      setIsCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading share information...</div>;
  }

  if (!poll || !shareLink) {
    return <div className="text-center py-10">Poll not found</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-2">Share Your Poll</h1>
      <p className="text-gray-600 mb-6">
        {poll.question}
      </p>
      
      <div className="space-y-6">
        {/* QR Code */}
        <div className="border rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-lg font-medium mb-4">QR Code</h2>
          <div className="bg-white p-2 rounded-lg shadow-sm">
            {/* This would be replaced with an actual QR code component */}
            <img 
              src={shareLink.qrCodeUrl} 
              alt="QR Code for poll" 
              className="w-48 h-48"
            />
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Scan this QR code to access the poll
          </p>
        </div>
        
        {/* Share Link */}
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Share Link</h2>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={shareLink.url}
              className="flex-1 border rounded-l-md px-3 py-2 bg-gray-50"
            />
            <button
              onClick={copyToClipboard}
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        
        {/* Social Sharing Buttons (placeholder) */}
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Share on Social Media</h2>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Facebook
            </button>
            <button className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600">
              Twitter
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}