'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Leaf, Trash2, ExternalLink, Search, FolderOpen } from 'lucide-react';
import Image from 'next/image';
import { useDendroStore } from '@/store';

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useDendroStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(bookmarks.map((b) => b.category || 'general')));

  const filtered = bookmarks.filter((b) => {
    const matchesSearch =
      b.plantName.toLowerCase().includes(search.toLowerCase()) ||
      (b.plantScientificName ?? '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || (b.category || 'general') === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-20 lg:pt-24 page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-8 h-8 text-forest-600" />
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-forest-900">
              Bookmarks
            </h1>
          </div>
          <p className="text-forest-600">
            {bookmarks.length} plant{bookmarks.length !== 1 ? 's' : ''} bookmarked for later
          </p>
        </motion.div>

        {bookmarks.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bookmarks..."
                className="w-full pl-10 pr-4 py-2.5 border border-forest-200 rounded-xl text-sm text-forest-900 bg-white focus:border-forest-400 focus:ring-2 focus:ring-forest-100 outline-none transition-all placeholder:text-forest-300"
              />
            </div>
            {/* Category filter */}
            {categories.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                    !activeCategory
                      ? 'bg-forest-600 text-white'
                      : 'bg-forest-50 text-forest-600 hover:bg-forest-100'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap capitalize transition-colors ${
                      activeCategory === cat
                        ? 'bg-forest-600 text-white'
                        : 'bg-forest-50 text-forest-600 hover:bg-forest-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((bookmark) => (
                <motion.div
                  key={bookmark.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="group bg-white rounded-xl border border-forest-100 overflow-hidden hover:shadow-lg hover:border-forest-200 transition-all duration-300"
                >
                  <Link href={`/plants/${bookmark.plantId}`} className="block relative h-44 overflow-hidden">
                    {bookmark.plantImage ? (
                      <Image
                        src={bookmark.plantImage}
                        alt={bookmark.plantName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-cream-100 flex items-center justify-center">
                        <Leaf className="w-10 h-10 text-forest-200" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Category badge */}
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 text-forest-600 text-[10px] font-medium rounded-full capitalize">
                      {bookmark.category || 'general'}
                    </span>
                  </Link>
                  <div className="p-4">
                    <Link href={`/plants/${bookmark.plantId}`}>
                      <h3 className="font-display font-semibold text-forest-900 mb-0.5 group-hover:text-forest-700 transition-colors">
                        {bookmark.plantName}
                      </h3>
                    </Link>
                    {bookmark.plantScientificName && (
                      <p className="text-xs text-forest-500 italic mb-3">{bookmark.plantScientificName}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/plants/${bookmark.plantId}`}
                        className="text-xs text-forest-600 hover:text-forest-800 font-medium flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View details
                      </Link>
                      <button
                        onClick={() => removeBookmark(bookmark.plantId)}
                        className="text-forest-300 hover:text-red-500 transition-colors p-1"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : bookmarks.length > 0 && filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-forest-200 mx-auto mb-4" />
            <h3 className="text-lg font-display font-bold text-forest-900 mb-2">No matches found</h3>
            <p className="text-forest-500 text-sm">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <FolderOpen className="w-16 h-16 text-forest-200 mx-auto mb-4" />
            <h3 className="text-lg font-display font-bold text-forest-900 mb-2">No Bookmarks Yet</h3>
            <p className="text-forest-500 mb-6 text-sm">
              Browse plants and use the bookmark icon to save them here.
            </p>
            <Link
              href="/explore"
              className="inline-block px-6 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Explore Plants
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
