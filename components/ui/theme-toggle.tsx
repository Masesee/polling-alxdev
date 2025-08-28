'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const applyTheme = (t: 'light' | 'dark') => {
    const root = document.documentElement
    const body = document.body
    if (t === 'dark') {
      root.classList.add('dark')
      body.classList.add('dark')
    } else {
      root.classList.remove('dark')
      body.classList.remove('dark')
    }
    window.localStorage.setItem('theme', t)
  }

  useEffect(() => {
    setMounted(true)
    const persisted = window.localStorage.getItem('theme') as 'light' | 'dark' | null
    let initial: 'light' | 'dark' = 'light'
    if (persisted) {
      initial = persisted
    }
    setTheme(initial)
    applyTheme(initial)
  }, [])

  useEffect(() => {
    if (!mounted) return
    applyTheme(theme)
  }, [theme, mounted])

  return (
    <button
      type="button"
      aria-label={mounted ? (theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme') : 'Toggle theme'}
      title={mounted ? (theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme') : 'Toggle theme'}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      {mounted ? (
        theme === 'dark' ? (
          <span aria-hidden>🌙</span>
        ) : (
          <span aria-hidden>☀️</span>
        )
      ) : (
        <span aria-hidden suppressHydrationWarning>◐</span>
      )}
      <span suppressHydrationWarning>{mounted ? (theme === 'dark' ? 'Dark' : 'Light') : 'Theme'}</span>
    </button>
  )
}


