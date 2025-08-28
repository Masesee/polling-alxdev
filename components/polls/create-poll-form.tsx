'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createPoll, type CreatePollResult } from '../../lib/actions/polls';
import { Alert } from '../ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Creating Poll...' : 'Create Poll'}
    </button>
  );
}

export default function CreatePollForm() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [activeTab, setActiveTab] = useState('basic');
  const [allowMultipleOptions, setAllowMultipleOptions] = useState(false);
  const [requireLogin, setRequireLogin] = useState(true);
  const [endDate, setEndDate] = useState('');
  const optionsJoined = useMemo(() => options.join('\n'), [options]);
  const questionRef = useRef<HTMLInputElement | null>(null);
  const firstOptionRef = useRef<HTMLInputElement | null>(null);

  const [state, formAction] = useFormState<CreatePollResult, FormData>(createPoll as any, { success: false });

  useEffect(() => {
    if (!state) return;
    if ('success' in state && state.success === true && state.pollId) {
      router.push(`/polls/${state.pollId}`);
      return;
    }
    if ('fieldErrors' in state && state.fieldErrors) {
      if (state.fieldErrors.question && questionRef.current) {
        questionRef.current.focus();
      } else if (state.fieldErrors.options && firstOptionRef.current) {
        firstOptionRef.current.focus();
      }
    }
  }, [state, router]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options required
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  // Validation is enforced by the server action; client keeps UX-friendly controls

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create New Poll</h1>
      </div>
      
      {/* Tabs */}
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
      
      {!!state && 'success' in state && state.success === false && state.message && (
        <Alert variant="error" title="Unable to create poll" description={state.message} />
      )}

      <form className="mt-4 space-y-6" action={formAction} aria-describedby="form-errors">
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
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
              {/* Hidden field aggregates options for the server action */}
              <input type="hidden" name="options" value={optionsJoined} />
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    required
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    aria-invalid={!!(state && 'fieldErrors' in state && state.fieldErrors?.options)}
                    aria-describedby={state && 'fieldErrors' in state && state.fieldErrors?.options ? 'options-error' : undefined}
                    ref={index === 0 ? firstOptionRef : undefined}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-2 py-1 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Remove
                    </button>
                  )}
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
                className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
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
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            className="rounded bg-white dark:bg-gray-700 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}