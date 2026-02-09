"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookSearchProps {
  onSearch: (query: string) => void;
  onSortChange: (sort: string) => void;
  sortBy: string;
  onSubmitQuery: (submitted: boolean) => void;
  submittedQuery: boolean;
}

export function BookSearch({
  onSearch,
  onSortChange,
  sortBy,
  onSubmitQuery,
  submittedQuery,
}: BookSearchProps) {
  const [searchInput, setSearchInput] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearch(searchInput);
    }, 500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [onSearch]);

  return (
    <div className=" bg-card p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Search and Sort Row */}
        <div className="flex gap-4 items-end md:w-[80%] m-auto">
          <div className="flex-1 relative overflow-hidden">
            {!submittedQuery && (
              <div className={`transition-all duration-500 ease-in-out`}>
                <p className="text-[46px] font-[400] text-center my-3">
                  Smarter Book Discovery powered by AI Recommendations
                </p>
                <p className="text-[16px] text-gray-500 text-center my-3">
                  Ask for recommendations, explore trending titles and get your
                  next read instantly
                </p>
              </div>
            )}
            <form
              className="px-2 h-12 text-base border flex gap-2 items-center py-2 rounded-full w-[80%] m-auto"
              onSubmit={(e) => {
                e.preventDefault();
                onSearch(searchInput);
                onSubmitQuery(true);
              }}
            >
              <Search className=" w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, or keyword..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-transparent border-none bg-none "
              />
              <Button
                variant="outline"
                type="submit"
                size="sm"
                className="rounded-full w-[100px] p-3"
              >
                Search
              </Button>
            </form>
          </div>
          {/* <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select> */}
        </div>
      </div>
    </div>
  );
}
