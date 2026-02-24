'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState<NewsArticle | null>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const handleImgError = (index: number) => {
    setFailedImages((prev) => new Set(prev).add(index));
  };

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setFeatured(data.articles[0]);
          setArticles(data.articles.slice(1));
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen pt-20 lg:pt-24 page-transition">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Newspaper className="w-8 h-8 text-forest-600" />
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-forest-900">
              Plant & Forest News
            </h1>
          </div>
          <p className="text-forest-600 text-lg max-w-2xl">
            Stay updated with the latest developments in forestry, botany, and environmental conservation
            from around the world.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="space-y-8">
            {/* Featured skeleton */}
            <div className="skeleton h-80 rounded-2xl" />
            {/* Grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-64 rounded-xl" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featured && (
              <motion.a
                href={featured.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-12 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="relative rounded-2xl overflow-hidden bg-forest-900">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Image */}
                    <div className="relative h-64 lg:h-[380px]">
                      {featured.image && !failedImages.has(-1) ? (
                        <Image
                          src={featured.image}
                          alt={featured.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          onError={() => handleImgError(-1)}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-forest-800 flex items-center justify-center">
                          <Newspaper className="w-16 h-16 text-forest-500" />
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="p-6 lg:p-10 flex flex-col justify-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-700 text-forest-100 text-xs font-medium rounded-full w-fit mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Featured
                      </span>
                      <h2 className="text-2xl lg:text-3xl font-display font-bold text-white mb-3 group-hover:text-cream-200 transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-forest-300 text-sm lg:text-base mb-4 line-clamp-3">
                        {featured.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 text-forest-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          {formatDate(featured.publishedAt)}
                          {featured.source?.name && (
                            <>
                              <span className="text-forest-600">·</span>
                              <span>{featured.source.name}</span>
                            </>
                          )}
                        </div>
                        <span className="text-forest-300 group-hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
                          Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.a>
            )}

            {/* News Grid */}
            {articles.length > 0 && (
              <div>
                <h3 className="text-xl font-display font-bold text-forest-900 mb-6">Latest Stories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article, index) => (
                    <motion.a
                      key={index}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white rounded-xl overflow-hidden border border-forest-100 hover:border-forest-200 hover:shadow-lg transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                    >
                      {/* Image */}
                      <div className="relative h-44 overflow-hidden">
                        {article.image && !failedImages.has(index) ? (
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            onError={() => handleImgError(index)}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-forest-50 flex items-center justify-center">
                            <Newspaper className="w-10 h-10 text-forest-200" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-display font-semibold text-forest-900 mb-2 line-clamp-2 group-hover:text-forest-700 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-forest-500 text-sm line-clamp-2 mb-4">{article.description}</p>
                        <div className="flex items-center justify-between text-xs text-forest-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(article.publishedAt)}
                          </div>
                          <div className="flex items-center gap-1 text-forest-500 group-hover:text-forest-700 transition-colors font-medium">
                            <ExternalLink className="w-3.5 h-3.5" />
                            {article.source?.name || 'Source'}
                          </div>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {articles.length === 0 && !featured && (
              <div className="text-center py-20">
                <Newspaper className="w-16 h-16 text-forest-200 mx-auto mb-4" />
                <h3 className="text-lg font-display font-bold text-forest-900 mb-2">No News Available</h3>
                <p className="text-forest-500">Check back later for the latest plant and forestry news.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
