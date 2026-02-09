"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { BookSearch } from "@/components/book-search";
import { BookGrid } from "@/components/book-grid";
import { Sidebar } from "@/components/sidebar";
import BookFiltersUI from "./book-filters";

export function SearchPageWrapper() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");
  const [submittedQuery, setSubmittedQuery] = useState(false);

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(decodeURIComponent(query));
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen bg-white">
      {/* <Sidebar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      /> */}

      <main className="flex-1 flex flex-col overflow-hidden">
        
        <BookSearch
          onSearch={setSearchQuery}
          onSortChange={setSortBy}
          sortBy={sortBy}
          onSubmitQuery={setSubmittedQuery}
          submittedQuery={submittedQuery}
        />
        
          {submittedQuery && (
            <BookFiltersUI
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          )}
          <BookGrid
            searchQuery={searchQuery}
            category={selectedCategory}
            sortBy={sortBy}
          />
        
      </main>
    </div>
  );
}
