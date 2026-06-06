import Link from 'next/link';
import dayjs from 'dayjs';

interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  city: string;
  startDate: string;
  capacity: number;
  availableSpots: number;
  isFree: boolean;
  price?: number;
  imageUrl?: string;
  status: string;
  category: { name: string };
  organizer: { fullName: string };
  _count: { registrations: number };
}

const categoryColors: Record<string, string> = {
  Conference: 'bg-blue-600',
  Workshop: 'bg-purple-600',
  Seminar: 'bg-indigo-600',
  Social: 'bg-pink-500',
  Sports: 'bg-green-600',
  Cultural: 'bg-orange-500',
  Technology: 'bg-cyan-600',
  Health: 'bg-teal-600',
};

export default function EventCard({ event }: { event: Event }) {
  const isFull = event.availableSpots <= 0;
  const spotsPercent = Math.min(
    ((event.capacity - event.availableSpots) / event.capacity) * 100, 100
  );
  const bgColor = categoryColors[event.category.name] || 'bg-blue-600';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">

      {/* Top Banner */}
{/* Image or Color Banner */}
{event.imageUrl ? (
  <div className="relative h-44 overflow-hidden">
    <img
      src={event.imageUrl}
      alt={event.title}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    <span className="absolute bottom-3 left-4 text-white text-xs font-bold uppercase tracking-wider bg-black/30 px-2 py-1 rounded-full">
      {event.category.name}
    </span>
    <span className="absolute bottom-3 right-4 text-white text-xs font-bold bg-black/30 px-2 py-1 rounded-full">
      {event.isFree ? 'FREE' : `$${event.price}`}
    </span>
  </div>
) : (
  <div className={`${bgColor} px-5 py-3 flex justify-between items-center`}>
    <span className="text-white text-xs font-bold uppercase tracking-wider">
      {event.category.name}
    </span>
    <span className="text-white text-xs font-bold bg-white bg-opacity-20 px-2 py-1 rounded-full">
      {event.isFree ? 'FREE' : `$${event.price}`}
    </span>
  </div>
)}

      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
          {event.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-base">📅</span>
            <span>{dayjs(event.startDate).format('MMM D, YYYY • h:mm A')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-base">📍</span>
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-base">👤</span>
            <span className="truncate">By {event.organizer.fullName}</span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{event.capacity - event.availableSpots} registered</span>
            <span className={isFull ? 'text-red-500 font-semibold' : 'text-green-600 font-semibold'}>
              {isFull ? 'Full' : `${event.availableSpots} spots left`}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${isFull ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${spotsPercent}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <Link
          href={`/events/${event.id}`}
          className={`w-full text-center py-2.5 rounded-xl text-sm font-semibold transition ${
            isFull
              ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isFull ? 'View Event (Waitlist)' : 'View Details →'}
        </Link>
      </div>
    </div>
  );
}