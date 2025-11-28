'use client';

import { AIDevTools } from '@ai-sdk-tools/devtools';
import { pollStore } from '../../lib/ai-store';

export default function AIDebugTools() {
  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <AIDevTools
      stores={[
        {
          name: 'Poll Store',
          store: pollStore
        }
      ]}
      position="bottom-right"
    />
  );
}