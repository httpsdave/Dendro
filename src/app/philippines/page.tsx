'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Leaf, TreePine, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import PlantGrid from '@/components/plants/PlantGrid';
import type { Plant } from '@/types';

const PH_HIGHLIGHTS = [
  {
    name: 'Narra',
    scientific: 'Pterocarpus indicus',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
    desc: 'The national tree of the Philippines, Narra is prized for its durable timber and beautiful rose-gold wood grain. It is widely found in Philippine forests.',
  },
  {
    name: 'Sampaguita',
    scientific: 'Jasminum sambac',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600',
    desc: 'The national flower of the Philippines, known for its small, fragrant white blossoms. Deeply rooted in Filipino culture and traditions.',
  },
  {
    name: 'Waling-Waling',
    scientific: 'Vanda sanderiana',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600',
    desc: 'Often called the "Queen of Philippine Orchids," this stunning orchid is endemic to Mindanao and is one of the most prized orchid species worldwide.',
  },
  {
    name: 'Jade Vine',
    scientific: 'Strongylodon macrobotrys',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
    desc: 'A rare, turquoise-blue vine native to the tropical rainforests of the Philippines. It produces claw-shaped flowers in dramatic cascading clusters.',
  },
];

export default function PhilippinesPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [dataSource, setDataSource] = useState<'tropicos' | 'gbif' | 'trefle'>('tropicos');

  useEffect(() => {
    async function fetchPhilippinePlants() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          distribution: 'PHI',
          source: dataSource,
        });
        if (searchQuery) params.set('q', searchQuery);

        const res = await fetch(`/api/plants?${params.toString()}`);
        const data = await res.json();
        setPlants(data.plants || []);
        setTotalPages(Math.max(1, Math.ceil((data.meta?.total || data.total || 0) / 20)));
      } catch (error) {
        console.error('Failed to fetch Philippine plants:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPhilippinePlants();
  }, [page, searchQuery, dataSource]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-24 page-transition">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 text-white py-16 lg:py-24">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1920"
            alt="Philippine rainforest"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/60 via-transparent to-forest-900/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-forest-300" />
              <span className="text-forest-300 text-sm font-medium uppercase tracking-wider">
                Philippine Flora
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Discover Philippine{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
                Plant Life
              </span>
            </h1>
            <p className="text-forest-200 text-lg max-w-xl mx-auto">
              The Philippines is one of the world&apos;s 18 mega-diverse countries, home to over 13,500 plant
              species — about a third of which are found nowhere else on Earth.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { label: 'Plant Species', value: '13,500+' },
              { label: 'Endemic Species', value: '~5,000' },
              { label: 'Orchid Species', value: '1,100+' },
              { label: 'Tree Species', value: '3,800+' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center px-4 py-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
              >
                <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                <p className="text-forest-300 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Highlight Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-display font-bold text-forest-900 mb-2">Iconic Philippine Plants</h2>
          <p className="text-forest-600 mb-8">
            Some of the most beloved and culturally significant plants found in the Philippine archipelago.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PH_HIGHLIGHTS.map((plant, index) => (
            <motion.div
              key={plant.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-xl border border-forest-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
                <div className="relative h-48 sm:h-auto">
                  <Image
                    src={plant.image}
                    alt={plant.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 200px"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-forest-900 text-lg mb-0.5">{plant.name}</h3>
                  <p className="text-sm text-forest-500 italic mb-3">{plant.scientific}</p>
                  <p className="text-sm text-forest-600 leading-relaxed">{plant.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Plant Browser */}
      <section className="bg-cream-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <TreePine className="w-6 h-6 text-forest-600" />
              <h2 className="text-2xl font-display font-bold text-forest-900">
                Browse Philippine Plants
              </h2>
            </div>
            <p className="text-forest-600 mb-6">
              Explore plants found in the Philippine distribution zone. Switch data sources below.
            </p>

            {/* Data source toggle */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-forest-500 mr-1">Source:</span>
              {([
                { key: 'tropicos', label: 'Tropicos' },
                { key: 'gbif', label: 'GBIF' },
                { key: 'trefle', label: 'Trefle' },
              ] as const).map((src) => (
                <button
                  key={src.key}
                  onClick={() => { setDataSource(src.key); setPage(1); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    dataSource === src.key
                      ? 'bg-forest-600 text-white border-forest-600'
                      : 'bg-white text-forest-600 border-forest-200 hover:bg-forest-50'
                  }`}
                >
                  {src.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Philippine plants..."
                  className="w-full pl-10 pr-4 py-2.5 border border-forest-200 rounded-xl text-sm text-forest-900 bg-white focus:border-forest-400 focus:ring-2 focus:ring-forest-100 outline-none transition-all placeholder:text-forest-300"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Search
              </button>
            </form>
          </motion.div>

          <PlantGrid plants={plants} loading={loading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium border border-forest-200 rounded-lg hover:bg-forest-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-sm text-forest-600 px-4">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium border border-forest-200 rounded-lg hover:bg-forest-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Conservation CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Leaf className="w-10 h-10 text-forest-400 mx-auto mb-4" />
          <h3 className="text-2xl font-display font-bold text-forest-900 mb-2">
            Help Protect Philippine Biodiversity
          </h3>
          <p className="text-forest-600 max-w-lg mx-auto mb-6">
            Many Philippine plant species are endangered due to deforestation and habitat loss.
            Learn more about conservation efforts and how you can help preserve these natural treasures.
          </p>
          <Link
            href="/explore"
            className="inline-block px-8 py-3 bg-forest-600 hover:bg-forest-700 text-white rounded-xl font-semibold transition-colors"
          >
            Explore All Plants
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
