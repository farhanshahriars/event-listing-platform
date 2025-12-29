import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendar, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUsers,
  FaHeart,
  FaRegHeart,
  FaTag
} from 'react-icons/fa';
import { format } from 'date-fns';
import useAuthStore from '../../store/authStore';
import useEventStore from '../../store/eventStore';
import toast from 'react-hot-toast';

const EventCard = ({ event, viewMode = 'grid' }) => {
  const { isAuthenticated } = useAuthStore();
  const { toggleSaveEvent, savedEvents } = useEventStore();
  const isSaved = savedEvents.some(savedEvent => savedEvent._id === event._id);

  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to save events');
      return;
    }

    const result = await toggleSaveEvent(event._id);
    if (result.success) {
      toast.success(result.data.saved ? 'Event saved!' : 'Event removed');
    } else {
      toast.error(result.error);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Music': 'bg-purple-100 text-purple-800',
      'Sports': 'bg-green-100 text-green-800',
      'Arts': 'bg-pink-100 text-pink-800',
      'Food': 'bg-red-100 text-red-800',
      'Technology': 'bg-blue-100 text-blue-800',
      'Business': 'bg-yellow-100 text-yellow-800',
      'Education': 'bg-indigo-100 text-indigo-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.Other;
  };

  // List view layout
  if (viewMode === 'list') {
    return (
      <Link to={`/events/${event._id}`}>
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 mb-4 flex flex-col md:flex-row">
          {/* Image for list view */}
          <div className="md:w-48 h-48 md:h-auto overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none flex-shrink-0">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Content for list view */}
          <div className="p-6 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                  {event.price > 0 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                      ${event.price}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleSaveClick}
                className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
              >
                {isSaved ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FaRegHeart className="text-gray-400 text-xl" />
                )}
              </button>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
              {event.description}
            </p>
            
            {/* Event info in horizontal layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-center text-gray-700">
                <FaCalendar className="mr-2 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-sm font-medium">
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <FaClock className="mr-2 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="text-sm font-medium">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <FaMapMarkerAlt className="mr-2 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-sm font-medium">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <div>
                  <p className="text-sm text-gray-500">Attendees</p>
                  <p className="text-sm font-medium">
                    {event.attendees?.length || 0}
                    {event.capacity && ` / ${event.capacity}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view (default)
  return (
    <Link to={`/events/${event._id}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
        {/* Event Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={handleSaveClick}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
          >
            {isSaved ? (
              <FaHeart className="text-red-500 text-lg" />
            ) : (
              <FaRegHeart className="text-gray-600 text-lg" />
            )}
          </button>
          <div className="absolute bottom-3 left-3">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(event.category)}`}>
              {event.category}
            </span>
          </div>
          {event.price > 0 && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="font-bold text-gray-800">${event.price}</span>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
            {event.description}
          </p>

          {/* Event Info */}
          <div className="space-y-3 mt-auto">
            <div className="flex items-center text-gray-700">
              <FaCalendar className="mr-2 text-blue-500 flex-shrink-0" />
              <span className="text-sm">
                {format(new Date(event.date), 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <FaClock className="mr-2 text-green-500 flex-shrink-0" />
              <span className="text-sm">{event.time}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FaMapMarkerAlt className="mr-2 text-red-500 flex-shrink-0" />
              <span className="text-sm line-clamp-1">{event.location}</span>
            </div>
            {event.capacity && (
              <div className="flex items-center text-gray-700">
                <FaUsers className="mr-2 text-purple-500 flex-shrink-0" />
                <span className="text-sm">{event.attendees?.length || 0} / {event.capacity} attendees</span>
              </div>
            )}
          </div>

          {/* Host Info */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-blue-600 font-bold">
                  {event.createdBy?.name?.charAt(0) || 'E'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hosted by</p>
                <p className="text-sm font-semibold text-gray-800">
                  {event.createdBy?.name || 'EventHub User'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;