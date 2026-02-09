'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { AIRecommendations } from '@/components/ai-recommendations'
import { useSearchHistory } from '@/hooks/use-search-history'
import { useViewedBooks } from '@/hooks/use-viewed-books'
import { Button } from '@/components/ui/button'
import { Bookmark, Search, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface RecentSearch {
  query: string
  timestamp?: string
}

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { history } = useSearchHistory()
  const { viewed, getRecentlyViewed } = useViewedBooks()
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>([])

  useEffect(() => {
    setFavoriteCategories(['Fiction', 'Non-Fiction', 'Mystery'])
  }, [])

  const recentlyViewedIds = getRecentlyViewed(5)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome, Vera</h1>
              <p className="text-muted-foreground mt-1">Here's what we recommend for you today</p>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/">
                  <Search className="w-4 h-4" />
                  Start a Conversation with Biblio
                </Link>
              </Button>
              <div className="w-10 h-10 bg-muted rounded-full" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
          {/* Recent Searches */}
          {history.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-accent" />
                Recent Searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {history.slice(0, 6).map((query, idx) => (
                  <Link key={idx} href={`/?search=${encodeURIComponent(query)}`}>
                    <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors text-sm font-medium">
                      {query}
                    </button>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* AI Recommendations */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Recommended For You
            </h2>
            <AIRecommendations
              searchHistory={history.slice(0, 3)}
              favoriteCategories={favoriteCategories}
              recentlyViewed={recentlyViewedIds}
            />
          </section>

          {/* Recently Viewed */}
          {viewed.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-accent" />
                Recently Viewed
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {viewed.slice(0, 10).map((book) => (
                  <Link key={book.id} href={`/book/${book.id}`}>
                    <div className="cursor-pointer group">
                      <div className="aspect-[2/3] bg-secondary rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow flex items-center justify-center">
                        <div className="text-center px-4">
                          <p className="font-semibold text-sm line-clamp-3 text-foreground">
                            {book.title}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{book.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
