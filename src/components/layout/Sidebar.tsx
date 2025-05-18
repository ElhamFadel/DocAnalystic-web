import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  Tags,
  Upload,
  ChevronLeft,
  FileIcon,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Documents', path: '/documents', icon: <FileText size={20} /> },
    { name: 'Search', path: '/search', icon: <Search size={20} /> },
    { name: 'Classification', path: '/classification', icon: <Tags size={20} /> },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-20 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30 lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-5 border-b">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary-600 text-white">
                <FileIcon size={20} />
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-800">DocAnalytics</span>
            </div>
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
              aria-label="Close sidebar"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className={`mr-3`}>{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Upload size={16} className="mr-2" />
              Upload New Document
            </button>
          </div>
          
          <div className="px-4 py-3 bg-primary-50 text-xs text-primary-800">
            <div className="flex items-center mb-1">
              <BarChart3 size={14} className="mr-1" />
              <span className="font-medium">System Status</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Storage Used:</span>
              <span className="font-medium">428.5 MB</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Documents:</span>
              <span className="font-medium">142</span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;