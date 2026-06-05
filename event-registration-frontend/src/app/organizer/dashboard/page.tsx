'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import dayjs from 'dayjs';

export default function OrganizerDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'ORGANIZER' && user.role !== 'ADMIN') {
      router.push('/attendee/dashboard');
      return;
    }
    fetchMyEvents();
  }, [user, authLoading]);

  const fetchMyEvents = async () => {
    try {
      const res = await api.get('/events/my-events');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      fetchMyEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handlePublish = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.patch(`/events/${id}`, { status: newStatus });
      fetchMyEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-700';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'COMPLETED': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
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
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
            <p className="text-gray-500">Welcome back, {user?.fullName}!</p>
          </div>
          <Link href="/organizer/create-event"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-medium">
            + Create Event
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Events', value: events.length },
            { label: 'Published', value: events.filter(e => e.status === 'PUBLISHED').length },
            { label: 'Draft', value: events.filter(e => e.status === 'DRAFT').length },
            { label: 'Total Registrations', value: events.reduce((acc, e) => acc + e._count.registrations, 0) },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="text-5xl mb-4">🎪</p>
            <h3 className="text-xl font-semibold text-gray-700">No events yet</h3>
            <p className="text-gray-500 mt-2 mb-6">Create your first event!</p>
            <Link href="/organizer/create-event"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Create Event
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
                      <p>📅 {dayjs(event.startDate).format('MMM D, YYYY • h:mm A')}</p>
                      <p>👥 {event._count.registrations} / {event.capacity} registered</p>
                      <p>📍 {event.venue}, {event.city}</p>
                      <p>🏷️ {event.category.name}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/organizer/attendees/${event.id}`}
                      className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200">
                      👥 Attendees
                    </Link>
                    <button
                      onClick={() => handlePublish(event.id, event.status)}
                      className={`text-sm px-3 py-2 rounded-lg ${
                        event.status === 'PUBLISHED'
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}>
                      {event.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                    </button>
                    <Link href={`/organizer/edit-event/${event.id}`}
                      className="text-sm bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-sm bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200">
                      Delete
                    </button>
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