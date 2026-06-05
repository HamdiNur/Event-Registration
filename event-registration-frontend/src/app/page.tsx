'use client';

import { useState, useEffect } from 'react';
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

    // Remove empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== '')
    );
    fetchEvents(cleanFilters);
  };

  const clearFilters = () => {
    setFilters({ categoryId: '', city: '', search: '' });
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-blue-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Discover Amazing Events</h1>
        <p className="text-blue-100 text-lg mb-8">
          Find and register for events happening in your city
        </p>

        {/* Search */}
        <div className="max-w-xl mx-auto">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search events..."
            className="w-full px-5 py-3 rounded-xl text-gray-900 focus:outline-none shadow-lg"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <select
            value={filters.categoryId}
            onChange={(e) => handleFilterChange('categoryId', e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <input
            type="text"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            placeholder="Filter by city..."
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {(filters.categoryId || filters.city || filters.search) && (
            <button
              onClick={clearFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-gray-500 text-sm mb-6">
          {isLoading ? 'Loading...' : `${events.length} event${events.length !== 1 ? 's' : ''} found`}
        </p>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎪</p>
            <h3 className="text-xl font-semibold text-gray-700">No events found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}