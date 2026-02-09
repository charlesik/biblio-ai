"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  ChevronLeft,
  ExternalLink,
  Star,
  BookOpen,
  Calendar,
  Users,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useViewedBooks } from "@/hooks/use-viewed-books";

interface BookDetails {
  id: string;
  title: string;
  authors?: string[];
  description?: string;
  thumbnail?: string;
  publishedDate?: string;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  pageCount?: number;
  language?: string;
  previewLink?: string;
  infoLink?: string;
  publisher?: string;
  isbn?: string;
}

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const [book, setBook] = useState<BookDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const { addViewedBook } = useViewedBooks();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY || "";

  useEffect(() => {
    const fetchBook = async () => {
      try {
        // Add a small delay to prevent rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));

        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`,
        );
        if (!response.ok) throw new Error("Book not found");

        const data = await response.json();
        const volumeInfo = data.volumeInfo || {};

        const bookData = {
          id: data.id,
          title: volumeInfo.title || "Unknown Title",
          authors: volumeInfo.authors || [],
          description: volumeInfo.description || "",
          thumbnail:
            volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") ||
            "",
          publishedDate: volumeInfo.publishedDate || "",
          categories: volumeInfo.categories || [],
          averageRating: volumeInfo.averageRating || null,
          ratingsCount: volumeInfo.ratingsCount || 0,
          pageCount: volumeInfo.pageCount || 0,
          language: volumeInfo.language || "",
          previewLink: volumeInfo.previewLink || "",
          infoLink: volumeInfo.infoLink || "",
          publisher: volumeInfo.publisher || "",
          isbn: volumeInfo.industryIdentifiers?.[0]?.identifier || "",
        };
        setBook(bookData);
        addViewedBook(bookData.id, bookData.title);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load book");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  // }, [bookId, addViewedBook]);
  }, []);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <p className="text-lg text-foreground font-medium">
            {error || "Book not found"}
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          {/* <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Vera Adeniji</span>
            <div className="w-8 h-8 bg-muted rounded-full" />
          </div> */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div>
            <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden shadow-lg mb-6">
              {book.thumbnail && !imageError ? (
                <img
                  src={book.thumbnail || "/placeholder.svg"}
                  alt={book.title}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary">
                  <BookOpen className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {/* <div className="space-y-3">
              <Button className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <span>Add to Library</span>
              </Button>
              {book.infoLink && (
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-transparent"
                  asChild
                >
                  <a
                    href={book.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Google Books
                  </a>
                </Button>
              )}
            </div> */}
          </div>

          {/* Book Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Title and Authors */}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-3">
                {book.title}
              </h1>
              {book.authors && book.authors.length > 0 && (
                <p className="text-lg text-muted-foreground">
                  by {book.authors.join(", ")}
                </p>
              )}
            </div>

            {/* Rating */}
            {book.averageRating && (
              <div className="flex items-center gap-4 pb-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(book.averageRating!)
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-foreground">
                    {book.averageRating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({book.ratingsCount} ratings)
                  </span>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              {book.publishedDate && (
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Published</p>
                    <p className="font-medium text-foreground">
                      {book.publishedDate}
                    </p>
                  </div>
                </div>
              )}
              {book.pageCount && (
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pages</p>
                    <p className="font-medium text-foreground">
                      {book.pageCount}
                    </p>
                  </div>
                </div>
              )}
              {book.publisher && (
                <div className="flex gap-3">
                  <Users className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Publisher</p>
                    <p className="font-medium text-foreground">
                      {book.publisher}
                    </p>
                  </div>
                </div>
              )}
              {book.language && (
                <div className="flex gap-3">
                  <BookOpen className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Language</p>
                    <p className="font-medium text-foreground capitalize">
                      {book.language}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Categories */}
            {book.categories && book.categories.length > 0 && (
              <div className="pt-6 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {book.categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {book.description && (
              <div className="pt-6 border-t border-border">
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  Description
                </h2>
                <div
                  className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: book.description }}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
