import { createArtifact } from '@ai-sdk-tools/artifacts';
import { Poll } from '../types';

// Create a poll results artifact for real-time updates
export const PollResultsArtifact = createArtifact<{
  pollId: string;
  question: string;
  totalVotes: number;
  options: Array<{
    id: string;
    text: string;
    votes: number;
    percentage: number;
  }>;
}>('poll-results');

// Create a poll analytics artifact
export const PollAnalyticsArtifact = createArtifact<{
  pollId: string;
  votesOverTime: Array<{
    timestamp: string;
    votes: number;
  }>;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  geoDistribution: Record<string, number>;
}>('poll-analytics');

// Example function to stream poll results in real-time
export async function streamPollResults(pollId: string) {
  // Create a new instance of the artifact
  const artifact = PollResultsArtifact.create();
  
  // Initial data
  artifact.update({
    pollId,
    question: 'Loading...',
    totalVotes: 0,
    options: []
  });
  
  try {
    // Fetch poll data
    const response = await fetch(`/api/polls/${pollId}`);
    const data = await response.json();
    
    // Update with real data
    artifact.update({
      pollId,
      question: data.question,
      totalVotes: data.options.reduce((sum: number, opt: any) => sum + (opt.votes || 0), 0),
      options: data.options.map((opt: any) => ({
        id: opt.id,
        text: opt.text,
        votes: opt.votes || 0,
        percentage: 0 // Will be calculated
      }))
    });
    
    // Calculate percentages
    const totalVotes = artifact.data.totalVotes;
    if (totalVotes > 0) {
      artifact.update({
        options: artifact.data.options.map(opt => ({
          ...opt,
          percentage: Math.round((opt.votes / totalVotes) * 100)
        }))
      });
    }
    
    // Complete the artifact
    artifact.complete();
    return artifact;
  } catch (error) {
    // Handle errors
    artifact.error(error instanceof Error ? error : new Error('Failed to load poll results'));
    throw error;
  }
}