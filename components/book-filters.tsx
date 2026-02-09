interface BookFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy?: string;
  onSortChange?: (sortBy: string) => void;
}

export default function BookFiltersUI({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: BookFilterProps) {
  const categories = [
    "All",
    "Romance",
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Poetry",
  ];

  return (
    <div className=" mx-auto p-6 w-full bg-white flex flex-wrap gap-5 items-center">
      
      {/* Sorting */}
      <div className="flex flex-col md:flex-row gap-4 ">
        <select
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortBy}
          onChange={(e) => onSortChange && onSortChange(e.target.value)}
        >
          <option value="relevance">Sort by: Relevance</option>
          <option value="newest">Sort by: Newest</option>
        </select>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category / Genre */}
        <select
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category === "All" ? "" : category}>
              {category === "All" ? "All Genres" : category}
            </option>
          ))}
        </select>

        {/* Published Date */}
        {/* <input
          type="text"
          placeholder="Published Year (e.g. 2020)"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        /> */}

        {/* Rating */}
        {/* <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Ratings</option>
          <option value="3">3+ stars</option>
          <option value="4">4+ stars</option>
          <option value="5">5 stars</option>
        </select> */}
      </div>
    </div>
  );
}
