import { cached } from '@ai-sdk-tools/cache';

// Example of caching an expensive API call to fetch poll data
export const createCachedFetcher = <T>(fetchFn: (...args: any[]) => Promise<T>) => {
  return cached(fetchFn);
};

// Usage example for poll fetching
export const cachedFetchPolls = createCachedFetcher(async (userId: string) => {
  const response = await fetch(`/api/polls?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch polls');
  }
  return await response.json();
});

// Usage example for poll details fetching
export const cachedFetchPollDetails = createCachedFetcher(async (pollId: string) => {
  const response = await fetch(`/api/polls/${pollId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch poll details for ${pollId}`);
  }
  return await response.json();
});