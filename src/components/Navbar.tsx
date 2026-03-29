import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Brain, MessageSquare, LayoutDashboard, Smile, Users, Shield, LogOut, Menu, X, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    const checkDb = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) setDbStatus('connected');
        else setDbStatus('error');
      } catch {
        setDbStatus('error');
      }
    };
    checkDb();
    const interval = setInterval(checkDb, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: Brain },
    { name: 'Chat', path: '/chat', icon: MessageSquare, protected: true },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, protected: true },
    { name: 'Mood', path: '/mood', icon: Smile, protected: true },
    { name: 'Help', path: '/help', icon: Users },
    { name: 'Awareness', path: '/awareness', icon: Shield },
    { name: 'Admin', path: '/admin', icon: Shield, adminOnly: true },
  ];

  const filteredItems = navItems.filter(item => {
    if (item.protected && !user) return false;
    if (item.adminOnly && user?.role !== 'admin') return false;
    return true;
  });

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-primary/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary font-serif">
                MindCare AI
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="flex items-center space-x-4">
            {/* DB Status Indicator */}
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-50 border border-gray-100">
              <Database className={`h-3 w-3 ${
                dbStatus === 'connected' ? 'text-green-500' : 
                dbStatus === 'checking' ? 'text-amber-500 animate-pulse' : 'text-red-500'
              }`} />
              <span className="text-[10px] font-bold uppercase text-gray-400">
                {dbStatus === 'connected' ? 'DB Online' : dbStatus === 'checking' ? 'Connecting...' : 'DB Offline'}
              </span>
            </div>

            {filteredItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            {user ? (
              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-primary/10 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {filteredItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium ${
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-primary/5'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-primary text-white px-3 py-2 rounded-lg text-center font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
