'use client'

import { useEffect, useRef, useState } from 'react'
import { BookCard } from '@/components/book-card'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle } from 'lucide-react'
import { useSearchHistory } from '@/hooks/use-search-history'

interface Book {
  id: string
  title: string
  authors?: string[]
  thumbnail?: string
  description?: string
  publishedDate?: string
  categories?: string[]
  averageRating?: number
  ratingsCount?: number
  pageCount?: number
  language?: string
  previewLink?: string
  infoLink?: string
}

interface BookGridProps {
  searchQuery: string
  category: string
  sortBy: string
}

const CATEGORIES: Record<string, string> = {
  'All': '',
  'Romance': 'romance',
  'Fiction': 'fiction',
  'Non-Fiction': 'non-fiction',
  'Mystery': 'mystery',
  'Poetry': 'poetry',
}

export function BookGrid({ searchQuery, category, sortBy }: BookGridProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const observerTarget = useRef<HTMLDivElement>(null)
  const cacheRef = useRef(new Map<string, Book[]>())
  const loadingRef = useRef(new Set<string>())
  const { addToHistory } = useSearchHistory()
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY || ''


  // Reset state when filters change
  useEffect(() => {
    setBooks([])
    setCurrentPage(0)
    setError(null)
    setHasMore(true)
  }, [searchQuery, category, sortBy])

  const loadPage = async (pageIndex: number, isInitial = false) => {
    if (!searchQuery) return

    const cacheKey = `${searchQuery}|${category}|${sortBy}|${pageIndex}`

    // Check cache first
    if (cacheRef.current.has(cacheKey)) {
      const cachedBooks = cacheRef.current.get(cacheKey)!
      setBooks((prev) => (isInitial ? cachedBooks : [...prev, ...cachedBooks]))
      setHasMore(cachedBooks.length === 40)
      return
    }

    // Prevent duplicate requests
    if (loadingRef.current.has(cacheKey)) return

    loadingRef.current.add(cacheKey)
    if (isInitial) {
      setIsLoading(true)
      addToHistory(searchQuery)
    }
    setError(null)

    try {
      const categoryFilter = CATEGORIES[category] ? `subject:${CATEGORIES[category]}` : ''
      const queryParts = [searchQuery, categoryFilter].filter(Boolean)
      const q = queryParts.join('+')

      // Add a small delay to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&key=${apiKey}&startIndex=${pageIndex * 40}&maxResults=40&orderBy=${sortBy === 'newest' ? 'newest' : 'relevance'}`
      )

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment before searching again.')
        }
        throw new Error('Failed to fetch books')
      }

      const data = await response.json()
      const fetchedBooks: Book[] = (data.items || []).map((item: any) => ({
        id: item.id,
        title: item.volumeInfo?.title || 'Unknown',
        authors: item.volumeInfo?.authors || [],
        thumbnail: item.volumeInfo?.imageLinks?.thumbnail?.replace('http://', 'https://') || '',
        description: item.volumeInfo?.description || '',
        publishedDate: item.volumeInfo?.publishedDate || '',
        categories: item.volumeInfo?.categories || [],
        averageRating: item.volumeInfo?.averageRating || null,
        ratingsCount: item.volumeInfo?.ratingsCount || 0,
        pageCount: item.volumeInfo?.pageCount || 0,
        language: item.volumeInfo?.language || '',
        previewLink: item.volumeInfo?.previewLink || '',
        infoLink: item.volumeInfo?.infoLink || '',
      }))

      // Cache the results
      cacheRef.current.set(cacheKey, fetchedBooks)

      // Update state
      setBooks((prev) => (isInitial ? fetchedBooks : [...prev, ...fetchedBooks]))
      setHasMore(fetchedBooks.length === 40)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books')
      setHasMore(false)
    } finally {
      loadingRef.current.delete(cacheKey)
      setIsLoading(false)
    }
  }

  // Load initial results when search or filters change
  useEffect(() => {
    if (searchQuery) {
      loadPage(0, true)
    }
  }, [searchQuery, category, sortBy])

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          hasMore &&
          !isLoading &&
          loadingRef.current.size === 0 &&
          searchQuery
        ) {
          setCurrentPage((prev) => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, searchQuery])

  // Load next page when currentPage changes
  useEffect(() => {
    if (currentPage > 0 && hasMore && !isLoading && loadingRef.current.size === 0) {
      loadPage(currentPage, false)
    }
  }, [currentPage, hasMore, isLoading])

  if (!searchQuery) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white ">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Enter a search query to discover books</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-lg text-foreground font-medium">Error loading books</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-[#f8f6f6] py-10 ">
      <div className="max-w-7xl mx-auto p-6">
        {books.length === 0 && isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Spinner />
          </div>
        ) : books.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            No books found. Try a different search.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 auto-rows-max">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={observerTarget} className="py-8 flex items-center justify-center">
              {hasMore && isLoading && <Spinner />}
            </div>

            {!hasMore && books.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No more books to load
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
