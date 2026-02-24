import Link from 'next/link';
import Image from 'next/image';
import { TreePine, Github, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest-900 text-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12 lg:py-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-forest-500 rounded-lg flex items-center justify-center">
                <TreePine className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display text-white">Dendro</span>
            </Link>
            <p className="text-cream-300 text-sm leading-relaxed mb-4">
              Your comprehensive guide to the plant kingdom. Discover, explore, and learn about
              trees, plants, and the forests of the world — with special focus on Philippine flora.
            </p>
            {/* Developer Credit */}
            <a
              href="https://github.com/httpsdave"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-forest-800 rounded-xl hover:bg-forest-700 transition-colors group mb-4"
            >
              <Image
                src="https://avatars.githubusercontent.com/httpsdave"
                alt="httpsdave"
                width={36}
                height={36}
                className="rounded-full ring-2 ring-forest-600 group-hover:ring-forest-400 transition-all"
              />
              <div>
                <p className="text-sm font-medium text-white group-hover:text-cream-100 transition-colors">httpsdave</p>
                <p className="text-xs text-cream-400">Developer on GitHub</p>
              </div>
              <Github className="w-4 h-4 text-cream-400 ml-auto group-hover:text-white transition-colors" />
            </a>
            <div className="flex items-center gap-3">
              <a href="https://github.com/httpsdave" target="_blank" rel="noopener noreferrer" className="p-2 bg-forest-800 rounded-lg hover:bg-forest-700 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-forest-800 rounded-lg hover:bg-forest-700 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2">
              {[
                { href: '/explore', label: 'All Plants' },
                { href: '/explore?filter=tree', label: 'Trees' },
                { href: '/explore?filter=flower', label: 'Flowers' },
                { href: '/philippines', label: 'Philippine Flora' },
                { href: '/explore?filter=edible', label: 'Edible Plants' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-cream-300 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                { href: '/news', label: 'Plant News' },
                { href: '/favorites', label: 'My Favorites' },
                { href: '/bookmarks', label: 'My Bookmarks' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-cream-300 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Data Sources</h3>
            <ul className="space-y-2">
              {[
                { href: 'https://trefle.io', label: 'Trefle.io' },
                { href: 'https://perenual.com', label: 'Perenual' },
                { href: 'https://www.gbif.org', label: 'GBIF' },
                { href: 'https://plants.usda.gov', label: 'USDA Plants' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cream-300 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-forest-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream-400">
            &copy; {currentYear} Dendro. Built with{' '}
            <Heart className="w-3 h-3 inline text-red-400" /> for plant lovers.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-cream-400 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-cream-400 hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
