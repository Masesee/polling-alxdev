'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert } from '../ui/alert';
import type { ActionResult } from '../../lib/server-utils/polls';

export type CreatePollResult = ActionResult<{ pollId: string }>

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto rounded-xl bg-primary py-3 px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 disabled:hover:translate-y-0"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

export default function CreatePollForm() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [activeTab, setActiveTab] = useState('basic');
  const [settings, setSettings] = useState({
    allowMultipleVotes: false,
    requireName: false
  });
  const [allowMultipleOptions, setAllowMultipleOptions] = useState(false);
  const [requireLogin, setRequireLogin] = useState(true);
  const [endDate, setEndDate] = useState('');
  const [state, setState] = useState<CreatePollResult | null>(null);
  const [pending, setPending] = useState(false);

  const questionRef = useRef<HTMLInputElement | null>(null);
  const firstOptionRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!state) return;
    if (state.success === true && state.data?.pollId) {
      router.push(`/polls/${state.data.pollId}`);
      return;
    }
    if (!state.success && state.fieldErrors) {
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
    if (options.length <= 2) return;
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setState(null);

    const formData = {
      question,
      options: options.filter(option => option.trim() !== ''),
      allowMultiple: allowMultipleOptions,
      requireLogin,
      endDateRaw: endDate,
    };

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result: CreatePollResult = await response.json();
      setState(result);

      if (!result.success) {
        console.error('API Error:', result.message);
      }
    } catch (error: any) {
      console.error('Network or unexpected error:', error);
      setState({ success: false, message: error.message || 'An unexpected error occurred.' });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-3">
          Create a New Poll
        </h1>
        <p className="text-muted-foreground">
          Ask a question and get real-time answers
        </p>
      </div>

      <div className="bg-card text-card-foreground rounded-3xl overflow-hidden shadow-xl shadow-primary/5 border border-border/50">
        <div className="flex border-b border-border/50 bg-muted/30">
          <button
            type="button"
            className={`flex-1 py-4 text-sm font-medium transition-all duration-300 ${activeTab === 'basic'
              ? 'bg-card text-primary shadow-sm border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            onClick={() => setActiveTab('basic')}
          >
            1. Basic Info
          </button>
          <button
            type="button"
            className={`flex-1 py-4 text-sm font-medium transition-all duration-300 ${activeTab === 'settings'
              ? 'bg-card text-primary shadow-sm border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            onClick={() => setActiveTab('settings')}
          >
            2. Settings
          </button>
        </div>

        <div className="p-6 sm:p-10">
          {!!state && !state.success && (
            <div className="mb-6">
              <Alert variant="error" title="Unable to create poll" description={state.message} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {activeTab === 'basic' && (
              <div className="space-y-8 animate-slide-up">
                <div className="space-y-3">
                  <label htmlFor="question" className="block text-sm font-medium text-foreground">
                    What would you like to ask?
                  </label>
                  <input
                    id="question"
                    name="question"
                    type="text"
                    required
                    className="block w-full rounded-xl border border-input bg-background px-4 py-4 text-lg shadow-sm focus:border-primary focus:ring-primary transition-all duration-200"
                    placeholder="e.g., What's your favorite programming language?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    ref={questionRef}
                  />
                  {state && !state.success && state.fieldErrors?.question && (
                    <p className="text-sm text-red-500">{state.fieldErrors.question}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-foreground">
                    Poll Options
                  </label>
                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3 group">
                        <div className="flex-grow relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-muted-foreground text-xs font-mono">{index + 1}</span>
                          </div>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="block w-full rounded-xl border border-input bg-background pl-8 pr-4 py-3 shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200"
                            required
                            ref={index === 0 ? firstOptionRef : null}
                          />
                        </div>
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="p-3 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            aria-label={`Remove option ${index + 1}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addOption}
                    className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add another option
                  </button>

                  {state && !state.success && state.fieldErrors?.options && (
                    <p className="text-sm text-red-500">{state.fieldErrors.options}</p>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all duration-300"
                  >
                    Next: Settings
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8 animate-slide-up">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">Voting Rules</h3>

                    <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={allowMultipleOptions}
                        onChange={(e) => setAllowMultipleOptions(e.target.checked)}
                      />
                      <div>
                        <span className="block text-sm font-medium text-foreground">Multiple Selections</span>
                        <span className="block text-xs text-muted-foreground mt-1">Allow voters to choose more than one option</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={requireLogin}
                        onChange={(e) => setRequireLogin(e.target.checked)}
                      />
                      <div>
                        <span className="block text-sm font-medium text-foreground">Require Login</span>
                        <span className="block text-xs text-muted-foreground mt-1">Only authenticated users can vote</span>
                      </div>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">Restrictions</h3>

                    <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={settings.allowMultipleVotes}
                        onChange={(e) => setSettings({ ...settings, allowMultipleVotes: e.target.checked })}
                      />
                      <div>
                        <span className="block text-sm font-medium text-foreground">Multiple Votes</span>
                        <span className="block text-xs text-muted-foreground mt-1">Allow users to vote multiple times</span>
                      </div>
                    </label>

                    <div className="p-4 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors">
                      <label htmlFor="endDate" className="block text-sm font-medium text-foreground mb-2">
                        End Date (Optional)
                      </label>
                      <input
                        id="endDate"
                        name="endDate"
                        type="date"
                        className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-border/50">
                  <button
                    type="button"
                    onClick={() => setActiveTab('basic')}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back to Basic Info
                  </button>
                  <SubmitButton pending={pending} />
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}