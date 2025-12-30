import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Star, Users } from 'lucide-react';
import useEventStore from "../../store/eventStore";
import useAuthStore from "../../store/authStore";

const Homepage = () => {
  const { events, categories, fetchEvents, loading, toggleSaveEvent } = useEventStore();
  const { isAuthenticated } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  
  const filteredEvents = events.filter(event => {
    const categoryMatch = selectedCategory === 'All' || event.category === selectedCategory;
    const today = new Date();
    const eventDate = new Date(event.date);
    
    if (activeTab === 'upcoming') {
      return categoryMatch && eventDate >= today;
    } else {
      return categoryMatch && eventDate < today;
    }
  });

  const handleSaveEvent = async (id, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please login to save events');
      return;
    }
    await toggleSaveEvent(id);
  };

  return (
    <div className="min-h-screen">
      
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Discover Amazing <span className="text-yellow-300">Events</span> Near You
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
            Find, save, and participate in local events. From concerts to workshops, connect with your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/events" 
              className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-4 px-10 rounded-full text-lg transition-all hover:scale-105 shadow-lg"
            >
              Explore Events
            </Link>
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className="bg-transparent border-3 border-white hover:bg-white hover:text-blue-700 font-bold py-4 px-10 rounded-full text-lg transition-all"
              >
                Create Event
              </Link>
            ) : (
              <Link 
                to="/register" 
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold py-4 px-10 rounded-full text-lg transition-all hover:scale-105"
              >
                Join Free
              </Link>
            )}
          </div>
        </div>
      </section>

      
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Browse by Category</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Find events that match your interests
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedCategory === 'All' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'}`}
            >
              All Events
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedCategory === category 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'}`}
              >
                {category}
              </button>
            ))}
          </div>

          
          <div className="mb-8">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 py-4 text-lg font-semibold ${activeTab === 'upcoming' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Calendar className="inline-block mr-2" size={20} />
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`flex-1 py-4 text-lg font-semibold ${activeTab === 'past' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Users className="inline-block mr-2" size={20} />
                Past Events
              </button>
            </div>
          </div>

          
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-6 text-gray-600 text-lg">Loading events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.slice(0, 9).map(event => {
                const eventDate = new Date(event.date);
                const isPast = eventDate < new Date();
                
                return (
                  <div key={event._id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    
                    <div className={`h-48 relative ${isPast ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}>
                      {isPast && (
                        <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Past Event
                        </div>
                      )}
                      <button
                        onClick={(e) => handleSaveEvent(event._id, e)}
                        className="absolute top-4 right-4 p-3 bg-white/90 rounded-full hover:bg-white hover:scale-110 transition-all"
                      >
                        <Star 
                          size={22} 
                          className={event.isSaved ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} 
                        />
                      </button>
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-white/90 text-gray-800 font-bold px-4 py-2 rounded-lg shadow">
                          ${event.price === 0 ? 'FREE' : event.price}
                        </span>
                      </div>
                    </div>

                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {event.title}
                        </h3>
                        <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                          {event.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-5 line-clamp-2 min-h-[3rem]">
                        {event.description}
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-700">
                          <Calendar size={18} className="mr-3 text-blue-600 flex-shrink-0" />
                          <span className="font-medium">{eventDate.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock size={18} className="mr-3 text-blue-600 flex-shrink-0" />
                          <span className="font-medium">{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <MapPin size={18} className="mr-3 text-blue-600 flex-shrink-0" />
                          <span className="font-medium line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                          {event.attendees || 0} attending
                        </div>
                        <Link 
                          to={`/events/${event._id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow">
              <div className="text-6xl mb-6">📅</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No events found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {selectedCategory !== 'All' 
                  ? `No ${selectedCategory.toLowerCase()} events found. Try another category!`
                  : `No ${activeTab} events available. Check back soon!`}
              </p>
              <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setActiveTab('upcoming');
                }}
                className="mt-6 text-blue-600 hover:text-blue-800 font-semibold"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{events.filter(e => new Date(e.date) >= new Date()).length}</div>
              <div className="text-gray-300">Upcoming Events</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{categories.length}</div>
              <div className="text-gray-300">Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {events.reduce((sum, event) => sum + (event.attendees || 0), 0)}
              </div>
              <div className="text-gray-300">Total Attendees</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {events.filter(e => e.price === 0).length}
              </div>
              <div className="text-gray-300">Free Events</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
