'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  defaultValue?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({
  variant = 'compact',
  defaultValue = '',
  placeholder = 'Search plants, trees, flowers...',
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        if (onSearch) {
          onSearch(query.trim());
        } else {
          router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
        }
      }
    },
    [query, onSearch, router]
  );

  const clearQuery = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
        <div
          className={`relative flex items-center bg-white rounded-2xl shadow-lg transition-shadow ${
            focused ? 'shadow-xl ring-2 ring-forest-300' : ''
          }`}
        >
          <Search className="absolute left-5 w-5 h-5 text-forest-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="w-full py-4 pl-14 pr-32 text-forest-900 placeholder:text-forest-300 bg-transparent rounded-2xl focus:outline-none text-base font-body"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={clearQuery}
                className="absolute right-28 p-1 text-forest-400 hover:text-forest-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
          <button
            type="submit"
            className="absolute right-2 px-6 py-2.5 bg-forest-600 text-white rounded-xl hover:bg-forest-700 transition-colors text-sm font-medium"
          >
            Search
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full py-2.5 pl-10 pr-4 text-sm text-forest-900 placeholder:text-forest-300 bg-white border border-forest-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-300 transition-all font-body"
      />
      {query && (
        <button
          type="button"
          onClick={clearQuery}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-forest-400 hover:text-forest-600"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </form>
  );
}
