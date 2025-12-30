const Event = require('../models/Event');
const User = require('../models/User');
const { validationResult } = require('express-validator');


exports.createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      date,
      time,
      location,
      address,
      category,
      image,
      price,
      capacity
    } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      address,
      category,
      image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format&fit=crop',
      price,
      capacity,
      createdBy: req.userId
    });

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getAllEvents = async (req, res) => {
  try {
    const { category, location, search } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: 1 });
    
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    
    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    
    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await event.deleteOne();
    
    
    await User.updateMany(
      { savedEvents: req.params.id },
      { $pull: { savedEvents: req.params.id } }
    );
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.toggleSaveEvent = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const eventId = req.params.id;
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const isSaved = user.savedEvents.includes(eventId);
    
    if (isSaved) {
      
      user.savedEvents = user.savedEvents.filter(id => id.toString() !== eventId);
      await user.save();
      
      res.json({
        message: 'Event removed from saved',
        saved: false
      });
    } else {
      
      user.savedEvents.push(eventId);
      await user.save();
      
      res.json({
        message: 'Event saved successfully',
        saved: true
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getSavedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'savedEvents',
      populate: {
        path: 'createdBy',
        select: 'name email'
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user.savedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.userId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
