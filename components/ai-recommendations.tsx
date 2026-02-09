'use client'

import { useEffect, useState, useCallback } from 'react'
import { BookCard } from '@/components/book-card'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle } from 'lucide-react'

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

interface AIRecommendationsProps {
  searchHistory: string[]
  favoriteCategories: string[]
  recentlyViewed: string[]
}

export function AIRecommendations({
  searchHistory,
  favoriteCategories,
  recentlyViewed,
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateRecommendations = useCallback(async () => {
    if (searchHistory.length === 0 && favoriteCategories.length === 0) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Use the most recent search term or favorite category
      const query = searchHistory[searchHistory.length - 1] || favoriteCategories[0]
      const categoryFilter =
        favoriteCategories.length > 0 ? `subject:${favoriteCategories[0]}` : ''

      const queryParts = [query, categoryFilter].filter(Boolean)
      const q = queryParts.join('+')

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=10&orderBy=relevance`
      )

      if (!response.ok) throw new Error('Failed to fetch recommendations')

      const data = await response.json()
      const books: Book[] = (data.items || []).map((item: any) => ({
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

      setRecommendations(books)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recommendations')
    } finally {
      setIsLoading(false)
    }
  }, [searchHistory, favoriteCategories])

  useEffect(() => {
    generateRecommendations()
  }, [generateRecommendations])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <p className="text-sm text-red-800">{error}</p>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Recommended For You</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {recommendations.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}
