'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Leaf,
  Flower2,
  TreePine,
  Droplets,
  Sun,
  Thermometer,
  MapPin,
  Info,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useDendroStore } from '@/store';

export default function PlantDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [plant, setPlant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { isBookmarked, isFavorited, addBookmark, removeBookmark, addFavorite, removeFavorite } =
    useDendroStore();

  useEffect(() => {
    async function fetchPlant() {
      setLoading(true);
      try {
        const res = await fetch(`/api/plants/${id}`);
        const data = await res.json();
        if (data.plant) {
          setPlant(data.plant);
          setSelectedImage(data.plant.imageUrl);
        }
      } catch (error) {
        console.error('Failed to fetch plant:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlant();
  }, [id]);

  const bookmarked = plant ? isBookmarked(plant.id) : false;
  const favorited = plant ? isFavorited(plant.id) : false;

  const handleBookmark = () => {
    if (!plant) return;
    if (bookmarked) {
      removeBookmark(plant.id);
    } else {
      addBookmark({
        id: crypto.randomUUID(),
        userId: '',
        plantId: plant.id,
        plantName: plant.commonName || plant.scientificName,
        plantImage: plant.imageUrl,
        plantScientificName: plant.scientificName,
        category: 'general',
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleFavorite = () => {
    if (!plant) return;
    if (favorited) {
      removeFavorite(plant.id);
    } else {
      addFavorite({
        id: crypto.randomUUID(),
        userId: '',
        plantId: plant.id,
        plantName: plant.commonName || plant.scientificName,
        plantImage: plant.imageUrl,
        plantScientificName: plant.scientificName,
        createdAt: new Date().toISOString(),
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="skeleton h-8 w-32 rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="skeleton aspect-square rounded-2xl" />
            <div className="space-y-4">
              <div className="skeleton h-10 w-3/4 rounded" />
              <div className="skeleton h-6 w-1/2 rounded" />
              <div className="skeleton h-24 w-full rounded" />
              <div className="skeleton h-40 w-full rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-16 h-16 text-forest-300 mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-forest-900 mb-2">Plant Not Found</h2>
          <p className="text-forest-600 mb-4">We couldn&apos;t find the plant you&apos;re looking for.</p>
          <Link href="/explore" className="text-forest-600 hover:text-forest-800 font-medium">
            &larr; Back to Explorer
          </Link>
        </div>
      </div>
    );
  }

  // Collect all images
  const allImages: { url: string; type: string }[] = [];
  if (plant.imageUrl) allImages.push({ url: plant.imageUrl, type: 'Main' });
  if (plant.images) {
    Object.entries(plant.images).forEach(([type, imgs]: [string, any]) => {
      if (Array.isArray(imgs)) {
        imgs.forEach((img: any) => {
          if (img.image_url || img.url) {
            allImages.push({ url: img.image_url || img.url, type });
          }
        });
      }
    });
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'foliage', label: 'Foliage & Flowers', icon: Flower2 },
    { id: 'growth', label: 'Growth', icon: TreePine },
    { id: 'distribution', label: 'Distribution', icon: MapPin },
  ];

  return (
    <div className="min-h-screen pt-20 lg:pt-24 page-transition">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-forest-500">
          <Link href="/explore" className="hover:text-forest-700 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Explorer
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-forest-700 font-medium truncate">
            {plant.commonName || plant.scientificName}
          </span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-24">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100 mb-4">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt={plant.commonName || plant.scientificName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-forest-300">
                    <Leaf className="w-20 h-20" />
                  </div>
                )}
              </div>
              {/* Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.slice(0, 8).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img.url)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        selectedImage === img.url ? 'border-forest-600' : 'border-transparent'
                      }`}
                    >
                      <Image src={img.url} alt={img.type} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Header */}
            <div className="mb-6">
              {plant.family && (
                <span className="inline-block px-3 py-1 bg-forest-50 text-forest-600 text-xs font-medium rounded-full mb-3">
                  {plant.familyCommonName || plant.family}
                </span>
              )}
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-forest-900 mb-1">
                {plant.commonName || 'Unknown'}
              </h1>
              <p className="text-lg text-forest-500 italic">{plant.scientificName}</p>
              {plant.author && (
                <p className="text-sm text-bark-500 mt-1">
                  {plant.author} {plant.year && `(${plant.year})`}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={handleFavorite}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  favorited
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-white text-forest-700 border border-forest-200 hover:bg-forest-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                {favorited ? 'Favorited' : 'Favorite'}
              </button>
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  bookmarked
                    ? 'bg-forest-50 text-forest-700 border border-forest-300'
                    : 'bg-white text-forest-700 border border-forest-200 hover:bg-forest-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                {bookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
            </div>

            {/* Quick Info Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {plant.edible && (
                <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                  Edible
                </span>
              )}
              {plant.vegetable && (
                <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                  Vegetable
                </span>
              )}
              {plant.status && (
                <span className="px-3 py-1.5 bg-bark-50 text-bark-700 text-xs font-medium rounded-full capitalize">
                  {plant.status}
                </span>
              )}
              {plant.rank && (
                <span className="px-3 py-1.5 bg-cream-200 text-bark-700 text-xs font-medium rounded-full capitalize">
                  {plant.rank}
                </span>
              )}
              {plant.duration && plant.duration.length > 0 && (
                <span className="px-3 py-1.5 bg-forest-50 text-forest-700 text-xs font-medium rounded-full capitalize">
                  {plant.duration.join(', ')}
                </span>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-forest-100 mb-6">
              <nav className="flex gap-1 -mb-px overflow-x-auto">
                {tabs.map(({ id: tabId, label, icon: Icon }) => (
                  <button
                    key={tabId}
                    onClick={() => setActiveTab(tabId)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tabId
                        ? 'border-forest-600 text-forest-700'
                        : 'border-transparent text-forest-400 hover:text-forest-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="overview">
                  {plant.observations && (
                    <div className="bg-cream-50 rounded-xl p-4 border border-cream-200 mb-4">
                      <h4 className="text-sm font-medium text-forest-700 mb-1">Observations</h4>
                      <p className="text-sm text-forest-600">{plant.observations}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <InfoCard label="Family" value={plant.family} />
                    <InfoCard label="Genus" value={plant.genus} />
                    <InfoCard label="Bibliography" value={plant.bibliography} />
                    <InfoCard label="Year" value={plant.year} />
                    {plant.ediblePart && <InfoCard label="Edible Parts" value={plant.ediblePart.join(', ')} />}
                  </div>
                  {/* Common Names */}
                  {plant.commonNames && Object.keys(plant.commonNames).length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-display font-semibold text-forest-900 mb-3">Common Names</h4>
                      <div className="space-y-2">
                        {Object.entries(plant.commonNames).slice(0, 8).map(([lang, names]: [string, any]) => (
                          <div key={lang} className="flex items-start gap-3">
                            <span className="text-xs font-medium text-bark-500 uppercase w-8 flex-shrink-0 pt-0.5">{lang}</span>
                            <p className="text-sm text-forest-700">{Array.isArray(names) ? names.join(', ') : names}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'foliage' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="foliage">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Flower */}
                    <div className="bg-white rounded-xl p-5 border border-forest-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Flower2 className="w-5 h-5 text-forest-500" />
                        <h4 className="font-display font-semibold text-forest-900">Flower</h4>
                      </div>
                      <div className="space-y-2">
                        <DetailRow label="Color" value={plant.flower?.color?.join(', ')} />
                        <DetailRow label="Conspicuous" value={plant.flower?.conspicuous != null ? (plant.flower.conspicuous ? 'Yes' : 'No') : null} />
                      </div>
                    </div>
                    {/* Foliage */}
                    <div className="bg-white rounded-xl p-5 border border-forest-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Leaf className="w-5 h-5 text-forest-500" />
                        <h4 className="font-display font-semibold text-forest-900">Foliage</h4>
                      </div>
                      <div className="space-y-2">
                        <DetailRow label="Color" value={plant.foliage?.color?.join(', ')} />
                        <DetailRow label="Texture" value={plant.foliage?.texture} />
                        <DetailRow label="Leaf Retention" value={plant.foliage?.leaf_retention != null ? (plant.foliage.leaf_retention ? 'Yes' : 'No') : null} />
                      </div>
                    </div>
                    {/* Fruit/Seed */}
                    <div className="bg-white rounded-xl p-5 border border-forest-100">
                      <div className="flex items-center gap-2 mb-3">
                        <TreePine className="w-5 h-5 text-forest-500" />
                        <h4 className="font-display font-semibold text-forest-900">Fruit & Seed</h4>
                      </div>
                      <div className="space-y-2">
                        <DetailRow label="Color" value={plant.fruitOrSeed?.color?.join(', ')} />
                        <DetailRow label="Conspicuous" value={plant.fruitOrSeed?.conspicuous != null ? (plant.fruitOrSeed.conspicuous ? 'Yes' : 'No') : null} />
                        <DetailRow label="Seed Persistence" value={plant.fruitOrSeed?.seed_persistence != null ? (plant.fruitOrSeed.seed_persistence ? 'Yes' : 'No') : null} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'growth' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="growth">
                  <div className="space-y-4">
                    {/* Specifications */}
                    <div className="bg-white rounded-xl p-5 border border-forest-100">
                      <h4 className="font-display font-semibold text-forest-900 mb-3">Specifications</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <DetailRow label="Growth Form" value={plant.specifications?.growth_form} />
                        <DetailRow label="Growth Habit" value={plant.specifications?.growth_habit} />
                        <DetailRow label="Growth Rate" value={plant.specifications?.growth_rate} />
                        <DetailRow label="Ligneous Type" value={plant.specifications?.ligneous_type} />
                        <DetailRow label="Toxicity" value={plant.specifications?.toxicity} />
                        {plant.specifications?.average_height?.cm && (
                          <DetailRow label="Average Height" value={`${plant.specifications.average_height.cm} cm`} />
                        )}
                        {plant.specifications?.maximum_height?.cm && (
                          <DetailRow label="Maximum Height" value={`${plant.specifications.maximum_height.cm} cm`} />
                        )}
                      </div>
                    </div>
                    {/* Growth Conditions */}
                    <div className="bg-white rounded-xl p-5 border border-forest-100">
                      <h4 className="font-display font-semibold text-forest-900 mb-3">Growing Conditions</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {plant.growth?.light != null && (
                          <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4 text-bark-400" />
                            <div>
                              <span className="text-xs text-forest-500 block">Light</span>
                              <div className="flex gap-0.5 mt-1">
                                {Array.from({ length: 10 }).map((_, i) => (
                                  <div key={i} className={`w-2 h-2 rounded-full ${i < plant.growth.light ? 'bg-bark-400' : 'bg-forest-100'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        {plant.growth?.atmospheric_humidity != null && (
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-400" />
                            <div>
                              <span className="text-xs text-forest-500 block">Humidity</span>
                              <div className="flex gap-0.5 mt-1">
                                {Array.from({ length: 10 }).map((_, i) => (
                                  <div key={i} className={`w-2 h-2 rounded-full ${i < plant.growth.atmospheric_humidity ? 'bg-blue-400' : 'bg-forest-100'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        <DetailRow label="pH Range" value={
                          plant.growth?.ph_minimum != null && plant.growth?.ph_maximum != null
                            ? `${plant.growth.ph_minimum} - ${plant.growth.ph_maximum}`
                            : null
                        } />
                        {plant.growth?.minimum_temperature?.deg_c != null && (
                          <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-red-400" />
                            <div>
                              <span className="text-xs text-forest-500">Min Temperature</span>
                              <p className="text-sm text-forest-900 font-medium">{plant.growth.minimum_temperature.deg_c}°C</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Bloom/Growth Months */}
                    {plant.growth?.bloom_months && plant.growth.bloom_months.length > 0 && (
                      <div className="bg-white rounded-xl p-5 border border-forest-100">
                        <h4 className="font-display font-semibold text-forest-900 mb-2">Bloom Months</h4>
                        <div className="flex flex-wrap gap-2">
                          {plant.growth.bloom_months.map((month: string) => (
                            <span key={month} className="px-3 py-1 bg-forest-50 text-forest-700 text-xs rounded-full capitalize">
                              {month}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'distribution' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="distribution">
                  <div className="space-y-4">
                    {plant.distribution?.native && plant.distribution.native.length > 0 && (
                      <div className="bg-white rounded-xl p-5 border border-forest-100">
                        <h4 className="font-display font-semibold text-forest-900 mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-500" /> Native Distribution
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {plant.distribution.native.map((zone: string) => (
                            <span key={zone} className="px-3 py-1.5 bg-green-50 text-green-700 text-xs rounded-full">
                              {zone}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {plant.distribution?.introduced && plant.distribution.introduced.length > 0 && (
                      <div className="bg-white rounded-xl p-5 border border-forest-100">
                        <h4 className="font-display font-semibold text-forest-900 mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-bark-500" /> Introduced Distribution
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {plant.distribution.introduced.map((zone: string) => (
                            <span key={zone} className="px-3 py-1.5 bg-bark-50 text-bark-700 text-xs rounded-full">
                              {zone}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Sources */}
                    {plant.sources && plant.sources.length > 0 && (
                      <div className="bg-white rounded-xl p-5 border border-forest-100">
                        <h4 className="font-display font-semibold text-forest-900 mb-3">Sources</h4>
                        <div className="space-y-2">
                          {plant.sources.map((source: any, i: number) => (
                            <div key={i} className="flex items-start gap-2">
                              <ExternalLink className="w-3.5 h-3.5 text-forest-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-forest-700 font-medium">{source.name}</p>
                                {source.url && (
                                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-forest-500 hover:text-forest-700 underline">
                                    {source.url}
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: any }) {
  if (!value) return null;
  return (
    <div className="bg-cream-50 rounded-lg p-3 border border-cream-200">
      <span className="text-xs text-forest-500 block mb-0.5">{label}</span>
      <p className="text-sm text-forest-900 font-medium">{String(value)}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: any }) {
  if (!value) return null;
  return (
    <div>
      <span className="text-xs text-forest-500">{label}</span>
      <p className="text-sm text-forest-900 font-medium capitalize">{String(value)}</p>
    </div>
  );
}
