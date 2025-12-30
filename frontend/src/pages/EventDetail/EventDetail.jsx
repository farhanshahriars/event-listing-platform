import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaCalendar, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaTag, 
  FaMoneyBill,
  FaHeart, 
  FaRegHeart,
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaShare,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle
} from 'react-icons/fa';
import { format, isPast, isToday, isFuture } from 'date-fns';
import EventCard from '../../components/EventCard/EventCard';
import Loader from '../../components/Loader/Loader';
import useEventStore from '../../store/eventStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentEvent, 
    events, 
    loading, 
    fetchEvent, 
    toggleSaveEvent, 
    deleteEvent,
    savedEvents 
  } = useEventStore();
  const { isAuthenticated, user } = useAuthStore();
  
  const [imageIndex, setImageIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  
  useEffect(() => {
    if (id) {
      fetchEvent(id);
    }
  }, [id, fetchEvent]);

  
  const similarEvents = useMemo(() => {
    if (!currentEvent || !events || !Array.isArray(events)) return [];
    
    return events
      .filter(event => 
        event._id !== currentEvent._id && 
        event.category === currentEvent.category
      )
      .slice(0, 4);
  }, [currentEvent, events]);

  const isSaved = useMemo(() => {
    return savedEvents.some(savedEvent => savedEvent._id === currentEvent?._id);
  }, [savedEvents, currentEvent]);

  const isOwner = useMemo(() => {
    return isAuthenticated && currentEvent?.createdBy?._id === user?._id;
  }, [isAuthenticated, currentEvent, user]);

  const eventDate = useMemo(() => {
    if (!currentEvent?.date) return null;
    try {
      return new Date(currentEvent.date);
    } catch {
      return null;
    }
  }, [currentEvent]);

  const getEventStatus = useMemo(() => {
    if (!eventDate) return 'unknown';
    
    if (isPast(eventDate)) return 'past';
    if (isToday(eventDate)) return 'today';
    if (isFuture(eventDate)) return 'upcoming';
    
    return 'unknown';
  }, [eventDate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'past': return 'bg-gray-100 text-gray-800';
      case 'today': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'past': return 'Event Ended';
      case 'today': return 'Happening Today';
      case 'upcoming': return 'Upcoming Event';
      default: return 'Unknown Status';
    }
  };

  const handleSaveEvent = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save events');
      navigate('/login');
      return;
    }

    const result = await toggleSaveEvent(currentEvent._id);
    if (result.success) {
      toast.success(result.data.saved ? 'Event saved!' : 'Event removed from saved');
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteEvent = async () => {
    if (!isOwner) {
      toast.error('You are not authorized to delete this event');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteEvent(currentEvent._id);
    setIsDeleting(false);

    if (result.success) {
      toast.success('Event deleted successfully');
      navigate('/dashboard?tab=events');
    } else {
      toast.error(result.error);
    }
  };

  const handleShareEvent = () => {
    const eventUrl = window.location.href;
    navigator.clipboard.writeText(eventUrl)
      .then(() => {
        toast.success('Event link copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  const handleAttendEvent = () => {
    if (!isAuthenticated) {
      toast.error('Please login to attend events');
      navigate('/login');
      return;
    }
    toast.success('You are now attending this event!');
  };

  const eventImages = useMemo(() => {
    if (!currentEvent?.image) return [];
    
    if (Array.isArray(currentEvent.image)) {
      return currentEvent.image;
    }
    
    return [currentEvent.image];
  }, [currentEvent]);

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % eventImages.length);
  };

  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + eventImages.length) % eventImages.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Loader />
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-xl shadow p-8 max-w-2xl mx-auto">
            <div className="text-gray-400 mb-4">
              <FaCalendar className="text-6xl mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-6">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/events" className="btn-primary">
                Browse Events
              </Link>
              <Link to="/" className="btn-secondary">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft />
            Back to Events
          </button>
        </div>

        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          
          <div className="relative h-96 overflow-hidden">
            {eventImages.length > 0 && (
              <img
                src={eventImages[imageIndex]}
                alt={`${currentEvent.title} - Image ${imageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            )}
            
            
            {eventImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                  <FaChevronRight />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {eventImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === imageIndex ? 'bg-white w-6' : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            
            <div className="absolute top-4 left-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(getEventStatus)}`}>
                {getStatusText(getEventStatus)}
              </span>
            </div>

           
            <div className="absolute top-4 right-4">
              <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-800 flex items-center gap-2">
                <FaTag />
                {currentEvent.category}
              </span>
            </div>

            
            <button
              onClick={handleSaveEvent}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors shadow-lg"
            >
              {isSaved ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-gray-600 text-xl" />
              )}
            </button>
          </div>

          
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {currentEvent.title}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold">
                            {currentEvent.createdBy?.name?.charAt(0) || 'E'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm">Hosted by</p>
                          <p className="font-semibold">
                            {currentEvent.createdBy?.name || 'EventHub User'}
                          </p>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-sm">Created on</p>
                        <p className="font-semibold">
                          {format(new Date(currentEvent.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>

                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleShareEvent}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Share event"
                    >
                      <FaShare />
                    </button>
                    
                    {isOwner && (
                      <>
                        <Link
                          to={`/dashboard?tab=edit&id=${currentEvent._id}`}
                          className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                          title="Edit event"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={handleDeleteEvent}
                          disabled={isDeleting}
                          className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete event"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Description</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">
                      {currentEvent.description}
                    </p>
                  </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-4">Event Details</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FaCalendar className="text-blue-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">
                            {eventDate ? format(eventDate, 'EEEE, MMMM dd, yyyy') : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaClock className="text-green-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="font-medium">{currentEvent.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{currentEvent.location}</p>
                          {currentEvent.address && (
                            <p className="text-sm text-gray-600">{currentEvent.address}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-4">Event Information</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FaTag className="text-purple-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium">{currentEvent.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaMoneyBill className="text-yellow-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-medium">
                            {currentEvent.price > 0 ? `$${currentEvent.price}` : 'Free'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaUsers className="text-indigo-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Attendees</p>
                          <p className="font-medium">
                            {currentEvent.attendees?.length || 0}
                            {currentEvent.capacity && ` / ${currentEvent.capacity}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                
                {getEventStatus === 'upcoming' || getEventStatus === 'today' ? (
                  <button
                    onClick={handleAttendEvent}
                    className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                  >
                    <FaCheckCircle className="text-xl" />
                    Attend This Event
                  </button>
                ) : getEventStatus === 'past' ? (
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <p className="text-gray-600 font-medium">
                      This event has already taken place
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        
        {similarEvents.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Similar Events</h2>
              <Link 
                to={`/events?category=${currentEvent.category}`}
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
              >
                View All
                <FaArrowLeft className="rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
