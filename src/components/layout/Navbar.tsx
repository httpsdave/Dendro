'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TreePine,
  Search,
  Menu,
  X,
  Heart,
  Bookmark,
  Newspaper,
  LogIn,
  User,
  Leaf,
  Home,
} from 'lucide-react';
import { useDendroStore } from '@/store';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Leaf },
  { href: '/philippines', label: 'Philippine Flora', icon: TreePine },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { mobileMenuOpen, setMobileMenuOpen } = useDendroStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  const isLanding = pathname === '/';

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !isLanding
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-forest-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-forest-600 rounded-lg flex items-center justify-center group-hover:bg-forest-700 transition-colors">
                <TreePine className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-xl font-bold font-display tracking-tight transition-colors ${
                  scrolled || !isLanding ? 'text-forest-900' : 'text-white'
                }`}
              >
                Dendro
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'text-forest-700 bg-forest-50'
                        : scrolled || !isLanding
                        ? 'text-forest-700 hover:text-forest-900 hover:bg-forest-50'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-forest-600 rounded-full"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/explore"
                className={`p-2 rounded-lg transition-colors ${
                  scrolled || !isLanding
                    ? 'text-forest-600 hover:bg-forest-50'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Search className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors text-sm font-medium"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled || !isLanding
                  ? 'text-forest-700 hover:bg-forest-50'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-forest-100">
                <span className="font-display font-bold text-forest-900 text-lg">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-forest-600 hover:bg-forest-50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-forest-700 bg-forest-50 border-r-2 border-forest-600'
                          : 'text-forest-700 hover:bg-forest-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </Link>
                  );
                })}
              </div>
              <div className="p-4 border-t border-forest-100">
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors text-sm font-medium"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
