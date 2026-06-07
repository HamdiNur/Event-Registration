'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import EventCard from '@/components/EventCard';
import api from '@/services/api';

interface Category {
  id: string;
  name: string;
}

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    categoryId: '',
    city: '',
    search: '',
  });

  useEffect(() => {
    fetchCategories();
    fetchEvents();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEvents = async (params = {}) => {
    setIsLoading(true);
    try {
      const res = await api.get('/events', { params });
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== '')
    );
    fetchEvents(cleanFilters);
  };

  const clearFilters = () => {
    setFilters({ categoryId: '', city: '', search: '' });
    fetchEvents();
  };

  const hasFilters = filters.categoryId || filters.city || filters.search;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80')`,
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 w-full max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 border border-white/30 uppercase tracking-widest">
              🎉 Discover Events Near You
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Find & Join <span className="text-blue-300">Amazing Events</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Connect with your community through conferences, workshops, cultural events and more.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center bg-white rounded-xl shadow-xl overflow-hidden max-w-xl mx-auto"
          >
            <span className="px-4 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search events..."
              className="flex-1 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
            />
            <button className="bg-blue-600 text-white px-5 py-3.5 font-semibold hover:bg-blue-700 transition text-sm">
              Search
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-10 mt-8"
          >
            {[
              { label: 'Live Events', value: events.length },
              { label: 'Categories', value: categories.length },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          <button
            onClick={() => handleFilterChange('categoryId', '')}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition ${
              !filters.categoryId
                ? 'bg-blue-600 text-white shadow'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilterChange('categoryId', cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition ${
                filters.categoryId === cat.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📍</span>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="Filter by city..."
              className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 w-44"
            />
          </div>

          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearFilters}
              className="flex items-center gap-1 bg-red-50 text-red-500 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-red-100 transition border border-red-100"
            >
              ✕ Clear
            </motion.button>
          )}

          <span className="ml-auto text-gray-400 text-sm">
            {isLoading ? 'Loading...' : `${events.length} event${events.length !== 1 ? 's' : ''} found`}
          </span>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="h-40 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">🎪</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No events found</h3>
            <p className="text-gray-400 text-sm mb-6">Try adjusting your filters</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence>
              {events.map((event: any, index: number) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}