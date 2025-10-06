'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
// Removed: import { createPoll, type CreatePollResult } from '../../lib/actions/polls';
import { Alert } from '../ui/alert';
import type { ActionResult, FieldErrors } from '../../lib/server-utils/polls';

/**
 * Type definition for the result of the createPoll API call.
 */
export type CreatePollResult = ActionResult<{ pollId: string }>

/**
 * SubmitButton component displays a button for form submission.
 * It shows a loading state when the form is pending.
 */
function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border border-transparent bg-blue-600 py-2.5 px-5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Creating Poll...
        </span>
      ) : (
        'Create Poll'
      )}
    </button>
  );
}

/**
 * CreatePollForm component provides a form for users to create new polls.
 * It includes fields for the poll question, multiple options, and optional settings like
 * allowing multiple selections, requiring login, and setting an end date.
 * It integrates with an API route for form submission and handles client-side state and validation feedback.
 */
export default function CreatePollForm() {
  const router = useRouter();
  // State for the poll question.
  const [question, setQuestion] = useState('');
  // State for poll options, initialized with two empty options.
  const [options, setOptions] = useState(['', '']);
  // State to manage active tab (Basic Info or Settings).
  const [activeTab, setActiveTab] = useState('basic');
  // State for poll settings.
  const [settings, setSettings] = useState({
    allowMultipleVotes: false,
    requireName: false
  });
  const [allowMultipleOptions, setAllowMultipleOptions] = useState(false);
  const [requireLogin, setRequireLogin] = useState(true);
  const [endDate, setEndDate] = useState('');
  // State for API response and loading status.
  const [state, setState] = useState<CreatePollResult | null>(null);
  const [pending, setPending] = useState(false);

  // Refs for focusing input fields on validation errors.
  const questionRef = useRef<HTMLInputElement | null>(null);
  const firstOptionRef = useRef<HTMLInputElement | null>(null);

  // Effect hook to handle redirection or focus on error after form submission.
  useEffect(() => {
    if (!state) return;
    // If poll creation was successful, redirect to the new poll's detail page.
    if ('success' in state && state.success === true && state.data?.pollId) {
      router.push(`/polls/${state.data.pollId}`);
      return;
    }
    // If there are field errors, focus on the relevant input field.
    if ('fieldErrors' in state && state.fieldErrors) {
      if (state.fieldErrors.question && questionRef.current) {
        questionRef.current.focus();
      } else if (state.fieldErrors.options && firstOptionRef.current) {
        firstOptionRef.current.focus();
      }
    }
  }, [state, router]);

  /**
   * Handles changes to an individual poll option input field.
   * @param index The index of the option being changed.
   * @param value The new value of the option.
   */
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  /**
   * Adds a new empty option field to the poll.
   */
  const addOption = () => {
    setOptions([...options, '']);
  };

  /**
   * Removes an option field at a specific index.
   * Ensures a minimum of two options are always present.
   * @param index The index of the option to remove.
   */
  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options required
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  /**
   * Handles the form submission, sending data to the API route.
   * @param event The form submission event.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setState(null); // Clear previous state

    const formData = {
      question,
      options: options.filter(option => option.trim() !== ''), // Filter out empty options
      allowMultiple: allowMultipleOptions,
      requireLogin,
      endDateRaw: endDate,
    };

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: CreatePollResult = await response.json();
      setState(result);

      if (!response.ok) {
        // Handle HTTP errors (e.g., 400, 500) that still return a JSON body
        console.error('API Error:', result.message || 'Unknown error');
      }
    } catch (error: any) {
      console.error('Network or unexpected error:', error);
      setState({ success: false, message: error.message || 'An unexpected error occurred.' });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create New Poll</h1>
      </div>
      
      {/* Tab navigation for Basic Info and Settings */}
      <div className="flex border-b border-gray-200" role="tablist" aria-label="Create poll tabs">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'basic'}
          aria-controls="tab-panel-basic"
          id="tab-basic"
          className={`py-2 px-4 ${activeTab === 'basic' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Info
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'settings'}
          aria-controls="tab-panel-settings"
          id="tab-settings"
          className={`py-2 px-4 ${activeTab === 'settings' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>
      
      {/* Display error alert if poll creation fails */}
      {!!state && 'success' in state && state.success === false && state.message && (
        <Alert variant="error" title="Unable to create poll" description={state.message} />
      )}

      <form className="mt-4 space-y-6" onSubmit={handleSubmit} aria-describedby="form-errors">
        {activeTab === 'basic' && (
          <div className="space-y-4" id="tab-panel-basic" role="tabpanel" aria-labelledby="tab-basic">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                Poll Question
              </label>
              <input
                id="question"
                name="question"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-colors duration-200"
                placeholder="What would you like to ask?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                aria-invalid={!!(state && 'fieldErrors' in state && state.fieldErrors?.question)}
                aria-describedby={state && 'fieldErrors' in state && state.fieldErrors?.question ? 'question-error' : undefined}
                ref={questionRef}
              />
              {state && 'fieldErrors' in state && state.fieldErrors?.question && (
                <p id="question-error" className="mt-1 text-sm text-red-600">
                  {state.fieldErrors.question}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Poll Options
              </label>
              {/* Removed: Hidden field aggregates options for the server action */}
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-100 p-2 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                    aria-label={`Remove option ${index + 1}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              {state && 'fieldErrors' in state && state.fieldErrors?.options && (
                <p id="options-error" className="text-sm text-red-600">
                  {state.fieldErrors.options}
                </p>
              )}
              <button
                type="button"
                onClick={addOption}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-8 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Option
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="space-y-4" id="tab-panel-settings" role="tabpanel" aria-labelledby="tab-settings">
            <h3 className="text-lg font-medium dark:text-white">Poll Settings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure question options for your poll</p>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="allowMultiple"
                  name="allowMultiple"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={allowMultipleOptions}
                  onChange={(e) => setAllowMultipleOptions(e.target.checked)}
                />
                <label htmlFor="allowMultiple" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">
                  Allow users to select multiple options
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="requireLogin"
                  name="requireLogin"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={requireLogin}
                  onChange={(e) => setRequireLogin(e.target.checked)}
                />
                <label htmlFor="requireLogin" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">
                  Require users to be logged in to vote
                </label>
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Poll End Date (Optional)
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center">
                <input
                  id="allowMultipleVotes"
                  name="allowMultipleVotes"
                  type="checkbox"
                  checked={settings.allowMultipleVotes}
                  onChange={(e) =>
                    setSettings({ ...settings, allowMultipleVotes: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 transition-colors duration-200"
                />
                <label htmlFor="allowMultipleVotes" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Allow multiple votes per person
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="requireName"
                  name="requireName"
                  type="checkbox"
                  checked={settings.requireName}
                  onChange={(e) =>
                    setSettings({ ...settings, requireName: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 transition-colors duration-200"
                />
                <label htmlFor="requireName" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Require name for voting
                </label>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                className="rounded-md bg-white dark:bg-gray-700 py-2.5 px-5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 border border-gray-300 dark:border-gray-600 shadow-sm transition-colors duration-200"
              >
                Cancel
              </button>
              <SubmitButton pending={pending} />
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            className="rounded bg-white dark:bg-gray-700 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
          <SubmitButton pending={pending} />
        </div>
      </form>
    </div>
  );
}