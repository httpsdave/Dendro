'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Leaf, ArrowRight } from 'lucide-react';
import { useDendroStore } from '@/store';

interface PlantCardProps {
  id: string;
  name: string;
  scientificName: string;
  imageUrl: string | null;
  family: string | null;
  source?: string;
  index?: number;
}

export default function PlantCard({
  id,
  name,
  scientificName,
  imageUrl,
  family,
  source = 'trefle',
  index = 0,
}: PlantCardProps) {
  const [imgError, setImgError] = useState(false);
  const { isBookmarked, isFavorited, addBookmark, removeBookmark, addFavorite, removeFavorite } =
    useDendroStore();

  const bookmarked = isBookmarked(id);
  const favorited = isFavorited(id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(id);
    } else {
      addBookmark({
        id: crypto.randomUUID(),
        userId: '',
        plantId: id,
        plantName: name,
        plantImage: imageUrl,
        plantScientificName: scientificName,
        category: 'general',
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorited) {
      removeFavorite(id);
    } else {
      addFavorite({
        id: crypto.randomUUID(),
        userId: '',
        plantId: id,
        plantName: name,
        plantImage: imageUrl,
        plantScientificName: scientificName,
        createdAt: new Date().toISOString(),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/plants/${id.startsWith(`${source}-`) ? id : `${source}-${id}`}`}>
        <div className="group bg-white rounded-xl overflow-hidden border border-forest-100 plant-card-hover cursor-pointer">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
            {imageUrl && !imgError ? (
              <Image
                src={imageUrl}
                alt={name || scientificName}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-forest-300">
                <Leaf className="w-12 h-12 mb-2" />
                <span className="text-xs">No image available</span>
              </div>
            )}
            {/* Overlay actions */}
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  favorited
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-forest-700 hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  bookmarked
                    ? 'bg-forest-600 text-white'
                    : 'bg-white/80 text-forest-700 hover:bg-white'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
            {/* Family badge */}
            {family && (
              <div className="absolute bottom-2 left-2">
                <span className="px-2 py-1 bg-forest-700/80 text-white text-[10px] font-medium rounded-full backdrop-blur-sm">
                  {family}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-display font-semibold text-forest-900 text-sm line-clamp-1 group-hover:text-forest-600 transition-colors">
              {name || 'Unknown Plant'}
            </h3>
            <p className="text-xs text-forest-500 italic mt-0.5 line-clamp-1">{scientificName}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] text-bark-400 uppercase tracking-wider font-medium">
                {source}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-forest-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
