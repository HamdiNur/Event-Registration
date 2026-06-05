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
  status: string;
  category: { name: string };
  organizer: { fullName: string };
  _count: { registrations: number };
}

export default function EventCard({ event }: { event: Event }) {
  const isFull = event.availableSpots <= 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden">
      {/* Category Banner */}
      <div className="bg-blue-600 px-4 py-2">
        <span className="text-white text-xs font-semibold uppercase tracking-wide">
          {event.category.name}
        </span>
      </div>

      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📅</span>
            <span>{dayjs(event.startDate).format('MMM D, YYYY • h:mm A')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📍</span>
            <span>{event.venue}, {event.city}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>👤</span>
            <span>By {event.organizer.fullName}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className={`text-sm font-semibold ${isFull ? 'text-red-500' : 'text-green-600'}`}>
              {isFull ? 'Fully Booked' : `${event.availableSpots} spots left`}
            </span>
            <div className="text-lg font-bold text-blue-600">
              {event.isFree ? 'Free' : `$${event.price}`}
            </div>
          </div>
          <Link
            href={`/events/${event.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}