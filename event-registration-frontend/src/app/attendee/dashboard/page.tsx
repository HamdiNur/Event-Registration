'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import dayjs from 'dayjs';
import Link from 'next/link';

export default function AttendeeDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user?.role !== 'ATTENDEE') router.push('/organizer/dashboard');
    if (user) fetchRegistrations();
  }, [user, authLoading]);

  const fetchRegistrations = async () => {
    try {
      const res = await api.get('/registrations');
      setRegistrations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this registration?')) return;
    try {
      await api.delete(`/registrations/${id}`);
      fetchRegistrations();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-700';
      case 'WAITLISTED': return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Registrations</h1>
            <p className="text-gray-500">Welcome back, {user?.fullName}!</p>
          </div>
          <Link href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Browse Events
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: registrations.length, color: 'blue' },
            { label: 'Confirmed', value: registrations.filter(r => r.status === 'CONFIRMED').length, color: 'green' },
            { label: 'Waitlisted', value: registrations.filter(r => r.status === 'WAITLISTED').length, color: 'yellow' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Registrations List */}
        {registrations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="text-5xl mb-4">🎪</p>
            <h3 className="text-xl font-semibold text-gray-700">No registrations yet</h3>
            <p className="text-gray-500 mt-2 mb-6">Start exploring events and register!</p>
            <Link href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => (
              <div key={reg.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {reg.event.title}
                      </h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(reg.status)}`}>
                        {reg.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📅 {dayjs(reg.event.startDate).format('MMM D, YYYY • h:mm A')}</p>
                      <p>📍 {reg.event.venue}, {reg.event.city}</p>
                      <p>🏷️ {reg.event.category.name}</p>
                      <p className="text-gray-400 text-xs">
                        Registered {dayjs(reg.registeredAt).format('MMM D, YYYY')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Link href={`/events/${reg.event.id}`}
                      className="text-blue-600 text-sm hover:underline text-center">
                      View Event
                    </Link>
                    {reg.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleCancel(reg.id)}
                        className="text-red-500 text-sm hover:underline">
                        Cancel
                      </button>
                    )}
                    {reg.attendanceConfirmed && (
                      <span className="text-green-600 text-xs font-medium">✓ Attended</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}