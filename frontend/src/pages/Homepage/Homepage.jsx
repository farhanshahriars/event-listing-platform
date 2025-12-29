import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaSearch, FaCalendarCheck, FaUsers, FaStar } from 'react-icons/fa';
import EventCard from '../../components/EventCard/EventCard';
import useEventStore from '../../store/eventStore';
import useAuthStore from '../../store/authStore';
import Loader from '../../components/Loader/Loader';

const Homepage = () => {
  const { events, categories, fetchEvents, loading } = useEventStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Use useMemo for derived state instead of useState + useEffect
  const featuredEvents = useMemo(() => {
    if (!events || events.length === 0) return [];
    
    return [...events]
      .sort((a, b) => (b.attendees?.length || 0) - (a.attendees?.length || 0))
      .slice(0, 4);
  }, [events]);

  const upcomingEvents = useMemo(() => {
    if (!events || events.length === 0) return [];
    
    return [...events]
      .filter(event => {
        try {
          return new Date(event.date) > new Date();
        } catch {
          return false;
        }
      })
      .sort((a, b) => {
        try {
          return new Date(a.date) - new Date(b.date);
        } catch {
          return 0;
        }
      })
      .slice(0, 6);
  }, [events]);

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Events Near You
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Find, save, and join local events. From concerts to conferences, we've got something for everyone.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link 
                to="/events" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaSearch />
                Browse Events
                <FaArrowRight />
              </Link>
              
              {!isAuthenticated && (
                <Link 
                  to="/register" 
                  className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
                >
                  Join Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/events?category=${category}`}
                className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaCalendarCheck className="text-blue-600 text-xl" />
                </div>
                <span className="font-medium text-gray-800">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Events</h2>
            <Link 
              to="/events" 
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
            >
              View All
              <FaArrowRight />
            </Link>
          </div>
          
          {loading ? (
            <Loader />
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FaCalendarCheck className="text-6xl mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No featured events yet</h3>
              <p className="text-gray-500">Check back soon for upcoming events!</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Upcoming Events</h2>
            <Link 
              to="/events" 
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
            >
              View All
              <FaArrowRight />
            </Link>
          </div>
          
          {loading ? (
            <Loader />
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FaCalendarCheck className="text-6xl mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No upcoming events</h3>
              <p className="text-gray-500">Be the first to create an event!</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                <FaUsers className="text-3xl" />
                {events.length || 0}
              </div>
              <p className="text-xl">Active Events</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                <FaCalendarCheck className="text-3xl" />
                {categories.length || 8}
              </div>
              <p className="text-xl">Categories</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                <FaStar className="text-3xl" />
                100+
              </div>
              <p className="text-xl">Happy Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Ready to Create Your Own Event?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of event organizers who are connecting with their communities.
          </p>
          
          {isAuthenticated ? (
            <Link 
              to="/dashboard?tab=create"
              className="btn-primary text-lg px-8 py-4"
            >
              Create Event
            </Link>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="btn-primary text-lg px-8 py-4"
              >
                Sign Up Now
              </Link>
              <Link 
                to="/login" 
                className="btn-secondary text-lg px-8 py-4"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Homepage;