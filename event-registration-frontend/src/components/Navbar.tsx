'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            EventHub
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Events
            </Link>

            {!user ? (
              <>
                <Link href="/login"
                  className="text-gray-600 hover:text-blue-600">
                  Login
                </Link>
                <Link href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {user.role === 'ORGANIZER' || user.role === 'ADMIN' ? (
                  <Link href="/organizer/dashboard"
                    className="text-gray-600 hover:text-blue-600">
                    Dashboard
                  </Link>
                ) : (
                  <Link href="/attendee/dashboard"
                    className="text-gray-600 hover:text-blue-600">
                    My Events
                  </Link>
                )}
                <span className="text-gray-600">Hi, {user.fullName.split(' ')[0]}</span>
                <button onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}