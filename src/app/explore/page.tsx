'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Filter, X, ChevronLeft, ChevronRight, Leaf, SlidersHorizontal } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import PlantGrid from '@/components/plants/PlantGrid';

interface PlantResult {
  id: string;
  name: string;
  scientificName: string;
  imageUrl: string | null;
  family: string | null;
  source: string;
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page') || '1');

  const [plants, setPlants] = useState<PlantResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [familyFilter, setFamilyFilter] = useState('');
  const [edibleFilter, setEdibleFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('trefle');

  const fetchPlants = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      params.set('page', String(page));
      if (familyFilter) params.set('family', familyFilter);
      if (edibleFilter) params.set('edible', edibleFilter);
      if (sourceFilter) params.set('source', sourceFilter);

      const res = await fetch(`/api/plants?${params.toString()}`);
      const data = await res.json();

      if (data.plants) {
        setPlants(data.plants);
        setTotal(data.meta?.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch plants:', error);
    } finally {
      setLoading(false);
    }
  }, [query, page, familyFilter, edibleFilter, sourceFilter]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    router.push(`/explore?q=${encodeURIComponent(newQuery)}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(total / 20);

  const families = [
    'Rosaceae', 'Fabaceae', 'Asteraceae', 'Poaceae', 'Orchidaceae',
    'Pinaceae', 'Fagaceae', 'Moraceae', 'Arecaceae', 'Myrtaceae',
  ];

  return (
    <div className="min-h-screen pt-20 lg:pt-24 page-transition">
      {/* Header */}
      <div className="bg-forest-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-forest-400" />
              <span className="text-forest-300 text-sm font-medium">Plant Explorer</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-6">
              {query ? `Results for "${query}"` : 'Explore All Plants'}
            </h1>
            <div className="max-w-2xl">
              <SearchBar variant="hero" defaultValue={query} onSearch={handleSearch} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-forest-600">
            {loading ? 'Loading...' : `${total.toLocaleString()} species found`}
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showFilters
                ? 'bg-forest-600 text-white'
                : 'bg-white text-forest-700 border border-forest-200 hover:bg-forest-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl border border-forest-100 p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-forest-900">Filters</h3>
              <button
                onClick={() => {
                  setFamilyFilter('');
                  setEdibleFilter('');
                  setSourceFilter('trefle');
                }}
                className="text-xs text-forest-500 hover:text-forest-700"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Family Filter */}
              <div>
                <label className="block text-xs font-medium text-forest-700 mb-2">Plant Family</label>
                <select
                  value={familyFilter}
                  onChange={(e) => { setFamilyFilter(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 text-sm border border-forest-200 rounded-lg bg-white text-forest-900 focus:ring-2 focus:ring-forest-300 focus:outline-none"
                >
                  <option value="">All Families</option>
                  {families.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              {/* Edible Filter */}
              <div>
                <label className="block text-xs font-medium text-forest-700 mb-2">Edible</label>
                <select
                  value={edibleFilter}
                  onChange={(e) => { setEdibleFilter(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 text-sm border border-forest-200 rounded-lg bg-white text-forest-900 focus:ring-2 focus:ring-forest-300 focus:outline-none"
                >
                  <option value="">Any</option>
                  <option value="true">Edible</option>
                  <option value="false">Non-Edible</option>
                </select>
              </div>
              {/* Source Filter */}
              <div>
                <label className="block text-xs font-medium text-forest-700 mb-2">Data Source</label>
                <div className="flex gap-2">
                  {(['trefle', 'perenual'] as const).map((src) => (
                    <button
                      key={src}
                      onClick={() => { setSourceFilter(src); setPage(1); }}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
                        sourceFilter === src
                          ? 'bg-forest-700 text-white border-forest-700'
                          : 'bg-white text-forest-700 border-forest-200 hover:bg-forest-50'
                      }`}
                    >
                      {src.charAt(0).toUpperCase() + src.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Active Filters */}
            {(familyFilter || edibleFilter) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-forest-100">
                {familyFilter && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-forest-50 text-forest-700 rounded-full text-xs">
                    Family: {familyFilter}
                    <button onClick={() => setFamilyFilter('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {edibleFilter && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-forest-50 text-forest-700 rounded-full text-xs">
                    {edibleFilter === 'true' ? 'Edible' : 'Non-Edible'}
                    <button onClick={() => setEdibleFilter('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Plant Grid */}
        <PlantGrid plants={plants} loading={loading} />

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-forest-700 bg-white border border-forest-200 rounded-lg hover:bg-forest-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                      page === pageNum
                        ? 'bg-forest-600 text-white'
                        : 'text-forest-700 hover:bg-forest-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-forest-700 bg-white border border-forest-200 rounded-lg hover:bg-forest-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-forest-400 animate-pulse">Loading...</div>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
