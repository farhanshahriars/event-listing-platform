const { body } = require('express-validator');

exports.validateRegister = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.validateLogin = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

exports.validateEvent = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Please enter a valid date'),
  
  body('time')
    .notEmpty().withMessage('Time is required'),
  
  body('location')
    .notEmpty().withMessage('Location is required'),
  
  body('address')
    .notEmpty().withMessage('Address is required'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Music', 'Sports', 'Arts', 'Food', 'Technology', 'Business', 'Education', 'Other'])
    .withMessage('Invalid category'),
  
  body('price')
    .optional()
    .isNumeric().withMessage('Price must be a number')
    .custom(value => value >= 0).withMessage('Price cannot be negative'),
  
  body('capacity')
    .optional()
    .isInt({ min: 1 }).withMessage('Capacity must be a positive number')
];