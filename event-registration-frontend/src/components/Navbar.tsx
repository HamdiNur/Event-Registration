'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎪</span>
            <span className="text-xl font-bold text-blue-600">EventHub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition">
              Browse Events
            </Link>

            {!user ? (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Sign Up Free
                </Link>
              </>
            ) : (
              <>
                {user.role === 'ORGANIZER' || user.role === 'ADMIN' ? (
                  <Link href="/organizer/dashboard" className="text-gray-600 hover:text-blue-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition">
                    My Events
                  </Link>
                ) : (
                  <Link href="/attendee/dashboard" className="text-gray-600 hover:text-blue-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition">
                    My Registrations
                  </Link>
                )}
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.fullName.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-red-500 hover:text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-5 h-0.5 bg-gray-600 mb-1" />
            <div className="w-5 h-0.5 bg-gray-600 mb-1" />
            <div className="w-5 h-0.5 bg-gray-600" />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden pb-4 space-y-2">
            <Link href="/" className="block text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50">
              Browse Events
            </Link>
            {!user ? (
              <>
                <Link href="/login" className="block text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50">Login</Link>
                <Link href="/register" className="block bg-blue-600 text-white px-3 py-2 rounded-lg text-center">Sign Up Free</Link>
              </>
            ) : (
              <>
                <Link href={user.role === 'ORGANIZER' ? '/organizer/dashboard' : '/attendee/dashboard'}
                  className="block text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50">
                  Dashboard
                </Link>
                <button onClick={logout} className="block w-full text-left text-red-500 px-3 py-2 rounded-lg hover:bg-red-50">
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}