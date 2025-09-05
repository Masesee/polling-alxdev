'use client';

import { useMemo } from 'react';
import { Poll, PollOption } from '../../lib/types';

interface PollResultChartProps {
  poll: Poll;
  chartType?: 'bar' | 'pie';
  showPercentage?: boolean;
  showVoteCount?: boolean;
  className?: string;
}

export default function PollResultChart({ 
  poll, 
  chartType = 'bar',
  showPercentage = true,
  showVoteCount = true,
  className = ''
}: PollResultChartProps) {
  // Calculate total votes and percentages
  const totalVotes = useMemo(() => 
    poll.options.reduce((sum: number, option: PollOption) => sum + (option.votes || 0), 0), 
    [poll.options]
  );

  // Generate colors for the chart segments
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-orange-500',
  ];

  // Sort options by votes (highest first)
  const sortedOptions = useMemo(() => {
    return [...poll.options].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  }, [poll.options]);

  if (chartType === 'pie') {
    return (
      <div className={`w-full ${className}`}>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Poll Results</h2>
        
        {totalVotes === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No votes yet</p>
        ) : (
          <div className="flex flex-col items-center">
            {/* Pie Chart */}
            <div className="relative w-64 h-64 mb-6">
              {sortedOptions.map((option, index) => {
                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                const previousPercentages = sortedOptions
                  .slice(0, index)
                  .reduce((sum, opt) => sum + ((opt.votes / totalVotes) * 100 || 0), 0);
                
                return (
                  <div 
                    key={option.id}
                    className={`absolute inset-0 ${colors[index % colors.length]}`}
                    style={{
                      clipPath: `conic-gradient(from ${previousPercentages * 3.6}deg, currentColor ${percentage * 3.6}deg, transparent 0)`,
                    }}
                    title={`${option.text}: ${percentage.toFixed(1)}%`}
                  />
                );
              })}
              {/* Center circle for donut effect */}
              <div className="absolute inset-0 m-auto w-32 h-32 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium dark:text-white">{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
              {sortedOptions.map((option, index) => {
                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                return (
                  <div key={option.id} className="flex items-center">
                    <div className={`w-4 h-4 ${colors[index % colors.length]} rounded-sm mr-2`} />
                    <span className="text-sm font-medium dark:text-gray-200 truncate">{option.text}</span>
                    <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                      {showPercentage && `${percentage.toFixed(1)}%`}
                      {showPercentage && showVoteCount && ' · '}
                      {showVoteCount && `${option.votes} ${option.votes === 1 ? 'vote' : 'votes'}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default bar chart
  return (
    <div className={`w-full ${className}`}>
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Poll Results</h2>
      
      {totalVotes === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No votes yet</p>
      ) : (
        <div className="space-y-4">
          {sortedOptions.map((option, index) => {
            const votes = option.votes || 0;
            const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
            return (
              <div key={option.id} className="border dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-medium dark:text-white">{option.text}</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    {showVoteCount && `${votes} ${votes === 1 ? 'vote' : 'votes'}`}
                    {showVoteCount && showPercentage && ' · '}
                    {showPercentage && `${percentage}%`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`${colors[index % colors.length]} h-2.5 rounded-full`} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total votes: {totalVotes}</p>
          </div>
        </div>
      )}
    </div>
  );
}