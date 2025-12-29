import { create } from 'zustand';
import axios from '../api';

const useEventStore = create((set) => ({
  events: [],
  savedEvents: [],
  userEvents: [],
  currentEvent: null,
  loading: false,
  categories: [
    'Music', 'Sports', 'Arts', 'Food', 
    'Technology', 'Business', 'Education', 'Other'
  ],

  setEvents: (events) => set({ events }),
  setCurrentEvent: (event) => set({ currentEvent: event }),
  
  fetchEvents: async (filters = {}) => {
    set({ loading: true });
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(`/events?${params}`);
      set({ events: response.data, loading: false });
      return { success: true, data: response.data };
    } catch {
      set({ loading: false });
      return { success: false, error: 'Failed to fetch events' };
    }
  },
  
  fetchEvent: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/events/${id}`);
      set({ currentEvent: response.data, loading: false });
      return { success: true, data: response.data };
    } catch {
      set({ loading: false });
      return { success: false, error: 'Failed to fetch event' };
    }
  },
  
  createEvent: async (eventData) => {
    set({ loading: true });
    try {
      const response = await axios.post('/events', eventData);
      const newEvent = response.data.event;
      
      set(state => ({
        events: [newEvent, ...state.events],
        userEvents: [newEvent, ...state.userEvents],
        loading: false
      }));
      
      return { success: true, data: response.data };
    } catch (err) {
      set({ loading: false });
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to create event' 
      };
    }
  },
  
  updateEvent: async (id, eventData) => {
    set({ loading: true });
    try {
      const response = await axios.put(`/events/${id}`, eventData);
      
      set(state => ({
        events: state.events.map(event => 
          event._id === id ? response.data.event : event
        ),
        userEvents: state.userEvents.map(event =>
          event._id === id ? response.data.event : event
        ),
        currentEvent: state.currentEvent?._id === id 
          ? response.data.event 
          : state.currentEvent,
        loading: false
      }));
      
      return { success: true, data: response.data };
    } catch (err) {
      set({ loading: false });
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to update event' 
      };
    }
  },
  
  deleteEvent: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/events/${id}`);
      
      set(state => ({
        events: state.events.filter(event => event._id !== id),
        userEvents: state.userEvents.filter(event => event._id !== id),
        savedEvents: state.savedEvents.filter(event => event._id !== id),
        currentEvent: state.currentEvent?._id === id ? null : state.currentEvent,
        loading: false
      }));
      
      return { success: true };
    } catch (err) {
      set({ loading: false });
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to delete event' 
      };
    }
  },
  
  toggleSaveEvent: async (id) => {
    try {
      const response = await axios.post(`/events/${id}/save`);
      
      set(state => ({
        savedEvents: response.data.saved
          ? [...state.savedEvents, state.events.find(e => e._id === id)]
          : state.savedEvents.filter(event => event._id !== id)
      }));
      
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to save event' 
      };
    }
  },
  
  fetchSavedEvents: async () => {
    try {
      const response = await axios.get('/events/user/saved');
      set({ savedEvents: response.data });
      return { success: true, data: response.data };
    } catch {
      return { success: false, error: 'Failed to fetch saved events' };
    }
  },
  
  fetchUserEvents: async () => {
    try {
      const response = await axios.get('/events/user/created');
      set({ userEvents: response.data });
      return { success: true, data: response.data };
    } catch {
      return { success: false, error: 'Failed to fetch user events' };
    }
  }
}));

export default useEventStore;