'use client'

import { useEffect, useState } from 'react'

const VIEWED_BOOKS_KEY = 'book-discovery-viewed-books'
const MAX_VIEWED_SIZE = 30

interface ViewedBook {
  id: string
  title: string
  viewedAt: number
}

export function useViewedBooks() {
  const [viewed, setViewed] = useState<ViewedBook[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load viewed books from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(VIEWED_BOOKS_KEY)
      if (stored) {
        setViewed(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load viewed books:', error)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever viewed changes
  useEffect(() => {
    if (!isLoaded) return

    try {
      localStorage.setItem(VIEWED_BOOKS_KEY, JSON.stringify(viewed))
    } catch (error) {
      console.error('Failed to save viewed books:', error)
    }
  }, [viewed, isLoaded])

  const addViewedBook = (id: string, title: string) => {
    setViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== id)
      const updated = [{ id, title, viewedAt: Date.now() }, ...filtered].slice(0, MAX_VIEWED_SIZE)
      return updated
    })
  }

  const clearViewed = () => {
    setViewed([])
  }

  const getRecentlyViewed = (count = 5): string[] => {
    return viewed.slice(0, count).map((item) => item.id)
  }

  return { viewed, addViewedBook, clearViewed, getRecentlyViewed }
}
