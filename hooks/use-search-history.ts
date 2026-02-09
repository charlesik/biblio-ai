'use client';

import { useEffect, useState } from 'react'

const SEARCH_HISTORY_KEY = 'book-discovery-search-history'
const MAX_HISTORY_SIZE = 20

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load search history:', error)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (!isLoaded) return

    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history))
    } catch (error) {
      console.error('Failed to save search history:', error)
    }
  }, [history, isLoaded])

  const addToHistory = (query: string) => {
    if (!query.trim()) return

    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== query)
      const updated = [query, ...filtered].slice(0, MAX_HISTORY_SIZE)
      return updated
    })
  }

  const clearHistory = () => {
    setHistory([])
  }

  return { history, addToHistory, clearHistory }
}
