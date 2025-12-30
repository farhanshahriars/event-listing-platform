import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaCalendar,
  FaHeart,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaClock,
  FaTimes
} from 'react-icons/fa';
import { format } from 'date-fns';
import useAuthStore from '../../store/authStore';
import useEventStore from '../../store/eventStore';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader/Loader';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuthStore();
  const {
    userEvents,
    savedEvents,
    fetchUserEvents,
    createEvent,
    deleteEvent,
    categories,
    loading: eventsLoading
  } = useEventStore();

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    bio: ''
  });
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Music',
    price: '0'
  });

  
  useEffect(() => {
    if (user) {
      
      const timeoutId = setTimeout(() => {
        setProfileForm({
          name: user.name || '',
          email: user.email || '',
          bio: user.bio || ''
        });
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [user]);

  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  
  useEffect(() => {
    if (user && activeTab === 'events') {
      fetchUserEvents();
    }
  }, [user, activeTab, fetchUserEvents]);

  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEventFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
    setIsEditingProfile(false);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    
    if (!eventForm.title || !eventForm.description || !eventForm.date || 
        !eventForm.time || !eventForm.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const eventData = {
        ...eventForm,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format&fit=crop'
      };
      
      await createEvent(eventData);
      toast.success('Event created successfully!');
      setActiveTab('events');
      setEventForm({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'Music',
        price: '0'
      });
    } catch {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        toast.success('Event deleted successfully!');
        fetchUserEvents();
      } catch {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
        <button
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <FaEdit />
          {isEditingProfile ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-center mb-6">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Events Created</span>
                <span className="font-semibold">{userEvents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saved Events</span>
                <span className="font-semibold">{savedEvents.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleProfileSubmit} className="bg-white rounded-xl shadow p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                  placeholder="Tell us about yourself..."
                />
              </div>
              {isEditingProfile && (
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderEventsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Events</h2>
        <button
          onClick={() => setActiveTab('create')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <FaPlus />
          Create New Event
        </button>
      </div>

      {eventsLoading ? (
        <Loader />
      ) : userEvents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <FaCalendar className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No events created yet</h3>
          <button
            onClick={() => setActiveTab('create')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userEvents.map(event => (
            <div key={event._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format&fit=crop'}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/events/${event._id}`)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white"
                    title="View Event"
                  >
                    <FaEye className="text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white"
                    title="Delete Event"
                  >
                    <FaTrash className="text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h3>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-3">
                  {event.category}
                </span>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-blue-500" />
                    <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-green-500" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCreateEventTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Create New Event</h2>
        <button
          onClick={() => setActiveTab('events')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
        >
          <FaTimes />
          Cancel
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleEventSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={eventForm.title}
                onChange={handleEventFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter event title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={eventForm.category}
                onChange={handleEventFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={eventForm.description}
              onChange={handleEventFormChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Describe your event..."
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={eventForm.date}
                onChange={handleEventFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={eventForm.time}
                onChange={handleEventFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={eventForm.location}
              onChange={handleEventFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="e.g., Convention Center"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-blue-100">Welcome back, {user.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                    activeTab === 'profile' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <FaUser />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                    activeTab === 'events' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <FaCalendar />
                  <span>My Events</span>
                  <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                    {userEvents.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                    activeTab === 'saved' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <FaHeart />
                  <span>Saved Events</span>
                  <span className="ml-auto bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                    {savedEvents.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                    activeTab === 'create' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <FaPlus />
                  <span>Create Event</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'events' && renderEventsTab()}
            {activeTab === 'create' && renderCreateEventTab()}
            {activeTab === 'saved' && (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <FaHeart className="text-6xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Saved Events</h3>
                <p className="text-gray-500 mb-6">You have {savedEvents.length} saved events</p>
                <button
                  onClick={() => navigate('/events')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                >
                  Browse Events
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
