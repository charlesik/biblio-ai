'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Star, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface BookCardProps {
  book: {
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
    previewLink?: string
    infoLink?: string
  }
}

export function BookCard({ book }: BookCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Link href={`/book/${book.id}`}> 
      <div className="flex flex-col h-full cursor-pointer group">
        {/* Book Cover */}
        <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-shadow">
          {book.thumbnail && !imageError ? (
            <img
              src={book.thumbnail || "/placeholder.svg"}
              alt={book.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Book Info */}
        <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-accent transition-colors">
          {book.title}
        </h3>

        {book.authors && book.authors.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {book.authors.join(', ')}
          </p>
        )}

        {/* Rating */}
        {book.averageRating && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.round(book.averageRating!)
                      ? 'fill-accent text-accent'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({book.ratingsCount || 0})
            </span>
          </div>
        )}

        {/* CTA Button */}
        <Button
          variant="outline"
          size="sm"
          className="mt-auto gap-1 text-xs bg-accent text-accent-foreground hover:bg-accent/90 border-0"
          onClick={(e) => {
            e.preventDefault()
            window.open(book.infoLink, '_blank')
          }}
        >
          Learn more →
        </Button>
      </div>
    </Link>
  )
}
