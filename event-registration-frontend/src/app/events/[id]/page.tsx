"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import dayjs from "dayjs";

export default function EventDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setIsRegistering(true);
    setMessage(null);
    try {
      const res = await api.post("/registrations", { eventId: id });
      setMessage({ type: "success", text: res.data.message });
      fetchEvent(); // Refresh spots count
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Registration failed",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-700">Event not found</h2>
        </div>
      </div>
    );
  }

  const isFull = event.availableSpots <= 0;
  const isPast = new Date() > new Date(event.registrationDeadline);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline mb-6 flex items-center gap-1"
        >
          ← Back to Events
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-8 py-6">
            <span className="bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {event.category.name}
            </span>
            <h1 className="text-3xl font-bold text-white mt-3">
              {event.title}
            </h1>
            <p className="text-blue-100 mt-1">By {event.organizer.fullName}</p>
          </div>

          <div className="p-8">
            {/* Success/Error Message */}
            {message && (
              <div
                className={`px-4 py-3 rounded-lg mb-6 text-sm font-medium ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left - Details */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    About this Event
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Event Details
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📅</span>
                      <div>
                        <p className="font-medium text-gray-800">Date & Time</p>
                        <p className="text-gray-600">
                          {dayjs(event.startDate).format("dddd, MMMM D, YYYY")}
                        </p>
                        <p className="text-gray-600">
                          {dayjs(event.startDate).format("h:mm A")} -{" "}
                          {dayjs(event.endDate).format("h:mm A")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="font-medium text-gray-800">Location</p>
                        <p className="text-gray-600">{event.venue}</p>
                        <p className="text-gray-600">
                          {event.address}, {event.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <p className="font-medium text-gray-800">
                          Registration Deadline
                        </p>
                        <p className="text-gray-600">
                          {dayjs(event.registrationDeadline).format(
                            "MMMM D, YYYY • h:mm A",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Registration Card */}
              <div className="md:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {event.isFree ? "Free" : `$${event.price}`}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className={`w-2 h-2 rounded-full ${isFull ? "bg-red-500" : "bg-green-500"}`}
                    />
                    <span
                      className={`text-sm font-medium ${isFull ? "text-red-600" : "text-green-600"}`}
                    >
                      {isFull
                        ? "Fully Booked"
                        : `${event.availableSpots} spots left`}
                    </span>
                  </div>

                  {/* Capacity bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(((event.capacity - event.availableSpots) / event.capacity) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mb-6">
                    {event.capacity - event.availableSpots} / {event.capacity}{" "}
                    registered
                  </p>

                  {user?.role === "ATTENDEE" && (
                    <button
                      onClick={handleRegister}
                      disabled={isRegistering || isPast}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      {isRegistering
                        ? "Registering..."
                        : isPast
                          ? "Registration Closed"
                          : isFull
                            ? "Join Waitlist"
                            : "Register Now"}
                    </button>
                  )}

                  {!user && (
                    <button
                      onClick={() => router.push("/login")}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                      Login to Register
                    </button>
                  )}

                  {user?.role === "ORGANIZER" && (
                    <div className="text-center text-gray-500 text-sm">
                      You are the organizer of this event
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
