const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');
const { validateEvent } = require('../middleware/validation');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);

// Protected routes (require authentication)
router.post('/', auth, validateEvent, eventController.createEvent);
router.put('/:id', auth, eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);
router.post('/:id/save', auth, eventController.toggleSaveEvent);
router.get('/user/saved', auth, eventController.getSavedEvents);
router.get('/user/created', auth, eventController.getUserEvents);

module.exports = router;