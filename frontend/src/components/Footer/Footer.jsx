import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaGithub, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope 
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-400" />
              EventHub
            </h3>
            <p className="text-gray-400 mb-4">
              Discover and share amazing local events in your area. Connect with your community through memorable experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub size={20} />
              </a>
            </div>
          </div>

          
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/events?category=Music" className="text-gray-400 hover:text-white transition-colors">
                  Music Events
                </Link>
              </li>
              <li>
                <Link to="/events?category=Sports" className="text-gray-400 hover:text-white transition-colors">
                  Sports Events
                </Link>
              </li>
              <li>
                <Link to="/events?category=Food" className="text-gray-400 hover:text-white transition-colors">
                  Food & Drink
                </Link>
              </li>
            </ul>
          </div>

          
          <div>
            <h4 className="text-xl font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/events?category=Music" className="text-gray-400 hover:text-white transition-colors">
                  Music Concerts
                </Link>
              </li>
              <li>
                <Link to="/events?category=Sports" className="text-gray-400 hover:text-white transition-colors">
                  Sports Games
                </Link>
              </li>
              <li>
                <Link to="/events?category=Arts" className="text-gray-400 hover:text-white transition-colors">
                  Art Exhibitions
                </Link>
              </li>
              <li>
                <Link to="/events?category=Technology" className="text-gray-400 hover:text-white transition-colors">
                  Tech Conferences
                </Link>
              </li>
              <li>
                <Link to="/events?category=Business" className="text-gray-400 hover:text-white transition-colors">
                  Business Networking
                </Link>
              </li>
            </ul>
          </div>

          
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-blue-400" />
                <span className="text-gray-400">123 Event Street, City, Country</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-blue-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-blue-400" />
                <span className="text-gray-400">support@eventhub.com</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="font-semibold mb-2">Subscribe to Newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-3 py-2 text-gray-800 rounded-l-lg focus:outline-none"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} EventHub - Event Listing Platform. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Built with React, Node.js, and MongoDB | Final Assignment Project
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
