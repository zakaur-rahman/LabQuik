"use client";
import React, { useState, useEffect } from "react";
import { useSearchTestQuery } from "@/redux/features/search/searchTest";
import { GoSearch } from "react-icons/go";

interface Item {
  testId: string;
  name: string;
  price: number;
}

interface SearchTestProps {
  onSelect: (item: Item) => void;
}

const SearchTest: React.FC<SearchTestProps> = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const { data, isLoading, isError } = useSearchTestQuery(debouncedQuery, {
    skip: debouncedQuery.length < 2,
  });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Update filtered items based on API data
  useEffect(() => {
    if (data?.tests?.length) {
      setFilteredItems(
        data?.tests.map((item: any) => ({
          testId: item._id,
          name: item.testName,
          price: item.cost,
        }))
      );
    } else {
      setFilteredItems([]); // Clear filtered items if no data
    }
  }, [data]);

  const handleSelectItem = (item: Item) => {
    onSelect(item);
    setSearchQuery(""); // Clear search query after selection
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 border rounded px-2 w-full">
        <input
          type="text"
          placeholder="Enter test name OR test id..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2 outline-none focus:outline-none"
        />
        <GoSearch className="text-[#000000ac] w-10 h-10 font-[300] antialiased p-2" size={25} />
      </div>

      {isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
          <div className="px-3 py-2 text-gray-500">Loading...</div>
        </div>
      )}

      {filteredItems.length > 0 && searchQuery.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white text-black border rounded shadow-lg">
          {filteredItems.map((item: Item, index: number) => (
            <li
              key={item.testId || index}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectItem(item)}
            >
              {item.name} - Rs.{item.price}
            </li>
          ))}
        </ul>
      )}

      {!isLoading && filteredItems.length === 0 && searchQuery && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
          <div className="px-3 py-2 text-gray-500">No options available</div>
        </div>
      )}
    </div>
  );
};

export default SearchTest;
