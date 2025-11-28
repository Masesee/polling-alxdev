import { createStore } from '@ai-sdk-tools/store';
import { Poll } from '../types';

// Define the store state interface
interface PollStoreState {
  polls: Poll[];
  currentPoll: Poll | null;
  isLoading: boolean;
  error: string | null;
}

// Create the store with initial state
export const pollStore = createStore<PollStoreState>({
  initialState: {
    polls: [],
    currentPoll: null,
    isLoading: false,
    error: null
  },
  // Optional: Add persistence
  options: {
    persist: {
      key: 'polling-app-state'
    }
  }
});

// Create actions to update the store
export const pollActions = {
  setPolls: (polls: Poll[]) => {
    pollStore.setState({ polls, isLoading: false, error: null });
  },
  setCurrentPoll: (poll: Poll) => {
    pollStore.setState({ currentPoll: poll });
  },
  setLoading: (isLoading: boolean) => {
    pollStore.setState({ isLoading });
  },
  setError: (error: string) => {
    pollStore.setState({ error, isLoading: false });
  }
};