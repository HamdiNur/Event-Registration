'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import dayjs from 'dayjs';

export default function AttendeesPage() {
  const { eventId } = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventTitle, setEventTitle] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'ORGANIZER' && user.role !== 'ADMIN') {
      router.push('/attendee/dashboard');
      return;
    }
    fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const [eventRes, regRes] = await Promise.all([
        api.get(`/events/${eventId}`),
        api.get(`/registrations/event/${eventId}`),
      ]);
      setEventTitle(eventRes.data.title);
      setRegistrations(regRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAttendance = async (registrationId: string) => {
    try {
      await api.patch(`/registrations/${registrationId}/attendance`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to mark attendance');
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
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-16 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const confirmed = registrations.filter(r => r.status === 'CONFIRMED').length;
  const attended = registrations.filter(r => r.attendanceConfirmed).length;
  const waitlisted = registrations.filter(r => r.status === 'WAITLISTED').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => router.back()} className="text-blue-600 hover:underline">
            ← Back
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{eventTitle}</h1>
        <p className="text-gray-500 mb-8">Attendee Management</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: registrations.length },
            { label: 'Confirmed', value: confirmed },
            { label: 'Waitlisted', value: waitlisted },
            { label: 'Attended', value: attended },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Attendees Table */}
        {registrations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="text-5xl mb-4">👥</p>
            <h3 className="text-xl font-semibold text-gray-700">No registrations yet</h3>
            <p className="text-gray-500 mt-2">Share your event to get attendees!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">#</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Registered</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {registrations.map((reg, index) => (
                  <tr key={reg.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{reg.attendee.fullName}</p>
                      {reg.attendee.phoneNumber && (
                        <p className="text-xs text-gray-500">{reg.attendee.phoneNumber}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{reg.attendee.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {dayjs(reg.registeredAt).format('MMM D, YYYY')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(reg.status)}`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {reg.attendanceConfirmed ? (
                        <span className="text-green-600 text-sm font-medium">✓ Attended</span>
                      ) : reg.status === 'CONFIRMED' ? (
                        <button
                          onClick={() => handleMarkAttendance(reg.id)}
                          className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200"
                        >
                          Mark Present
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}