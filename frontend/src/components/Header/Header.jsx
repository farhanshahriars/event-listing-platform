import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, LogIn } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuthStore();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-white p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <Calendar size={28} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Event<span className="text-yellow-300">Hub</span>
              </h1>
              <p className="text-blue-100 text-sm">Find local events</p>
            </div>
          </Link>

          
          <nav className="flex flex-wrap justify-center gap-4 md:gap-8">
            <Link 
              to="/" 
              className="text-white hover:text-yellow-300 font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className="text-white hover:text-yellow-300 font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
            >
              Browse Events
            </Link>
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="text-white hover:text-yellow-300 font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
              >
                Dashboard
              </Link>
            )}
          </nav>

          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <User size={20} className="text-white" />
                  <span className="text-white font-medium">
                    {user?.name || 'User'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="bg-white text-blue-700 hover:bg-gray-100 font-semibold py-2 px-6 rounded-full transition-all hover:scale-105 shadow"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="flex items-center space-x-2 text-white hover:text-yellow-300 font-semibold transition-colors"
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register"
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold py-3 px-6 rounded-full transition-all hover:scale-105 shadow-lg"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
