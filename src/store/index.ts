import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Bookmark, Favorite } from '@/types';

interface DendroStore {
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Bookmarks (local cache, synced with Supabase when logged in)
  bookmarks: Bookmark[];
  setBookmarks: (bookmarks: Bookmark[]) => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (plantId: string) => void;
  isBookmarked: (plantId: string) => boolean;

  // Favorites (local cache, synced with Supabase when logged in)
  favorites: Favorite[];
  setFavorites: (favorites: Favorite[]) => void;
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (plantId: string) => void;
  isFavorited: (plantId: string) => boolean;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useDendroStore = create<DendroStore>()(
  persist(
    (set, get) => ({
      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Bookmarks
      bookmarks: [],
      setBookmarks: (bookmarks) => set({ bookmarks }),
      addBookmark: (bookmark) =>
        set((state) => ({ bookmarks: [...state.bookmarks, bookmark] })),
      removeBookmark: (plantId) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.plantId !== plantId),
        })),
      isBookmarked: (plantId) =>
        get().bookmarks.some((b) => b.plantId === plantId),

      // Favorites
      favorites: [],
      setFavorites: (favorites) => set({ favorites }),
      addFavorite: (favorite) =>
        set((state) => ({ favorites: [...state.favorites, favorite] })),
      removeFavorite: (plantId) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.plantId !== plantId),
        })),
      isFavorited: (plantId) =>
        get().favorites.some((f) => f.plantId === plantId),

      // UI State
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    }),
    {
      name: 'dendro-storage',
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        favorites: state.favorites,
      }),
    }
  )
);
