import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  User,
  Menu,
  LogOut,
  UserCircle,
  ChevronDown
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useDocuments } from '../../contexts/DocumentContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { setSearchQuery } = useDocuments();
  const { signOut, user } = useAuth();
  const [query, setQuery] = React.useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query);
      navigate('/search');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm z-20">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 mr-2 text-gray-500 rounded-md hover:bg-gray-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
        </div>

        <form 
          onSubmit={handleSearch} 
          className="hidden md:flex items-center max-w-md w-full mx-4 px-4 py-2 bg-gray-100 rounded-md"
        >
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full bg-transparent focus:outline-none text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
            <Bell size={20} />
          </button>
          <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
            <Settings size={20} />
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-sm font-medium text-gray-700 rounded-full hover:bg-gray-100 p-1 transition-colors duration-150"
            >
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <ChevronDown
                size={16}
                className={`ml-1 text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                >
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Signed in
                    </p>
                  </div>
                  
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <UserCircle size={16} className="mr-2" />
                    Profile Settings
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;