'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  TreePine,
  Leaf,
  Search,
  ArrowRight,
  Sprout,
  Globe,
  BookOpen,
  Star,
  ChevronRight,
  Sparkles,
  MapPin,
} from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import { getDailyFact, getMonthlyPlant } from '@/lib/utils';

const heroImages = [
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80',
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1920&q=80',
];

const features = [
  {
    icon: Search,
    title: '30,000+ Species',
    description: 'Access comprehensive data on tens of thousands of plant species from verified botanical sources.',
  },
  {
    icon: Globe,
    title: 'Global Distribution',
    description: 'Explore where plants grow naturally around the world, with county-level distribution data.',
  },
  {
    icon: MapPin,
    title: 'Philippine Flora',
    description: 'Special emphasis on the rich biodiversity of the Philippines with 13,500+ native species.',
  },
  {
    icon: BookOpen,
    title: 'Detailed Information',
    description: 'From leaf textures to growth habits — get detailed botanical information for every species.',
  },
];

const categories = [
  { name: 'Trees', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80', href: '/explore?q=tree', count: '8,200+' },
  { name: 'Flowers', image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&q=80', href: '/explore?q=flower', count: '12,000+' },
  { name: 'Ferns', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80', href: '/explore?q=fern', count: '3,100+' },
  { name: 'Grasses', image: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=600&q=80', href: '/explore?q=grass', count: '4,500+' },
  { name: 'Mosses', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', href: '/explore?q=moss', count: '1,800+' },
  { name: 'Succulents', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80', href: '/explore?q=succulent', count: '2,300+' },
];

export default function LandingPage() {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const dailyFact = getDailyFact();
  const monthlyPlant = getMonthlyPlant();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-transition">
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {heroImages.map((img, i) => (
          <div
            key={img}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === currentHeroImage ? 1 : 0 }}
          >
            <Image src={img} alt="Forest landscape" fill className="object-cover" priority={i === 0} />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/50 to-forest-950/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest-500/20 border border-forest-400/30 rounded-full mb-6 backdrop-blur-sm">
                <Sprout className="w-3.5 h-3.5 text-forest-300" />
                <span className="text-xs font-medium text-forest-200 tracking-wide">EXPLORE THE PLANT KINGDOM</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white leading-[1.1] mb-6">
                Discover the<br />
                <span className="text-forest-300">World of Trees</span><br />& Plants
              </h1>
              <p className="text-lg text-cream-200 max-w-xl mb-8 leading-relaxed font-body">
                Your comprehensive botanical encyclopedia. Explore over 30,000 species, from towering redwoods to delicate orchids — with special focus on Philippine flora.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mb-8">
              <SearchBar variant="hero" placeholder="Search any tree, plant, or flower..." />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="flex flex-wrap gap-3">
              <Link href="/explore" className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 text-white rounded-xl hover:bg-forest-700 transition-colors text-sm font-medium">
                <Leaf className="w-4 h-4" /> Browse All Plants <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/philippines" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors text-sm font-medium backdrop-blur-sm border border-white/20">
                <MapPin className="w-4 h-4" /> Philippine Flora
              </Link>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="mt-16 mb-8 md:mb-0 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Species', value: '30,000+' },
              { label: 'Families', value: '600+' },
              { label: 'Distribution Zones', value: '726' },
              { label: 'Data Sources', value: '4' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-display font-bold text-white">{value}</div>
                <div className="text-xs text-cream-300 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-2.5 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-20 lg:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-forest-600 text-sm font-medium tracking-wider uppercase">Why Dendro</span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-forest-900 mt-3 mb-4">Your Gateway to Botanical Knowledge</h2>
            <p className="text-forest-600 font-body">Comprehensive plant data from trusted sources, beautifully organized and easily accessible.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }, index) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-white rounded-xl p-6 border border-forest-100 hover:shadow-lg hover:border-forest-200 transition-all group">
                <div className="w-12 h-12 bg-forest-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-forest-100 transition-colors">
                  <Icon className="w-6 h-6 text-forest-600" />
                </div>
                <h3 className="font-display font-semibold text-forest-900 mb-2">{title}</h3>
                <p className="text-sm text-forest-600 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-forest-600 text-sm font-medium tracking-wider uppercase">Browse by Category</span>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-forest-900 mt-3">Explore Plant Types</h2>
            </div>
            <Link href="/explore" className="hidden sm:inline-flex items-center gap-1 text-sm text-forest-600 hover:text-forest-800 font-medium transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {categories.map(({ name, image, href, count }, index) => (
              <motion.div key={name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }}>
                <Link href={href} className="group block relative rounded-xl overflow-hidden aspect-[3/2]">
                  <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                    <h3 className="font-display font-bold text-white text-lg lg:text-xl">{name}</h3>
                    <p className="text-cream-300 text-xs mt-1">{count} species</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PLANT FACT OF THE DAY ═══ */}
      <section className="py-20 lg:py-28 bg-forest-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest-700 rounded-full mb-6">
                <Sparkles className="w-3.5 h-3.5 text-forest-300" />
                <span className="text-xs font-medium text-forest-200">PLANT FACT OF THE DAY</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">{dailyFact.plantName}</h2>
              <p className="text-lg text-cream-200 leading-relaxed mb-8">&ldquo;{dailyFact.fact}&rdquo;</p>
              <Link href="/explore" className="inline-flex items-center gap-2 px-5 py-3 bg-forest-500 text-white rounded-xl hover:bg-forest-400 transition-colors text-sm font-medium">
                Discover More Facts <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-forest-800 rounded-2xl p-8 border border-forest-700">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-bark-400" />
                <h3 className="font-display font-semibold text-white">Plant of the Month</h3>
              </div>
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-forest-700">
                <Image src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80" alt={monthlyPlant.name} fill className="object-cover" />
              </div>
              <h4 className="text-xl font-display font-bold text-white mb-2">{monthlyPlant.name}</h4>
              <p className="text-sm text-cream-300 leading-relaxed">{monthlyPlant.description}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ PHILIPPINE FLORA SPOTLIGHT ═══ */}
      <section className="py-20 lg:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative aspect-square rounded-2xl overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80" alt="Philippine tropical forest" fill className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-forest-950/80 to-transparent p-6">
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Philippine Archipelago</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <span className="text-forest-600 text-sm font-medium tracking-wider uppercase">Featured Region</span>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-forest-900 mt-3 mb-4">Philippine Flora</h2>
              <p className="text-forest-600 mb-6 leading-relaxed">
                The Philippines is one of the most biodiverse countries on Earth, home to over 13,500 plant species — many found nowhere else. From the majestic Narra tree to the world&rsquo;s largest flower, Rafflesia, Philippine forests are a botanical treasure.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { value: '13,500+', label: 'Plant Species' },
                  { value: '33%', label: 'Endemic Species' },
                  { value: '7,641', label: 'Islands' },
                  { value: '50+', label: 'Key Forests' },
                ].map(({ value, label }) => (
                  <div key={label} className="bg-white rounded-xl p-4 border border-forest-100">
                    <div className="text-xl font-display font-bold text-forest-700">{value}</div>
                    <div className="text-xs text-forest-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
              <Link href="/philippines" className="inline-flex items-center gap-2 px-5 py-3 bg-forest-600 text-white rounded-xl hover:bg-forest-700 transition-colors text-sm font-medium">
                Explore Philippine Flora <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <TreePine className="w-12 h-12 text-forest-400 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-forest-900 mb-4">Start Your Botanical Journey</h2>
            <p className="text-forest-600 max-w-lg mx-auto mb-8">Create a free account to bookmark your favorite plants, build collections, and get personalized recommendations.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup" className="inline-flex items-center gap-2 px-8 py-3 bg-forest-600 text-white rounded-xl hover:bg-forest-700 transition-colors font-medium">
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/explore" className="inline-flex items-center gap-2 px-8 py-3 bg-forest-50 text-forest-700 rounded-xl hover:bg-forest-100 transition-colors font-medium border border-forest-200">
                Browse as Guest
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
