'use client'

import { useEffect } from 'react'
import { Alert } from '../../../components/ui/alert'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Could log to an error reporting service here
    // console.error(error)
  }, [error])

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <Alert variant="error" title="Something went wrong" description={error.message} />
        <button
          onClick={() => reset()}
          className="rounded border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try again
        </button>
      </div>
    </div>
  )
}


