import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Search, User, ShoppingCart } from 'lucide-react';
import { MicrophoneIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [searchText, setSearchText] = useState('');
  const recognitionRef = useRef<any>(null);

  // Voice search setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      (recognition as any).maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchText(transcript);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      alert('Voice search is not supported');
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 px-6 py-4 bg-[#0071CE] shadow-md"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
            <img
              src="/Logo.png"
              alt="AI Shopmate"
              className="h-20 w-auto object-contain"
            />
          </motion.div>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group flex items-center bg-white/90 rounded-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
            <input
              type="text"
              placeholder="Search with voice or text..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-full focus:outline-none transition-all group-hover:border group-hover:border-black"
            />
            <button
              onClick={startVoiceSearch}
              type="button"
              className="absolute right-3 p-1 hover:text-yellow-500 transition"
            >
              <MicrophoneIcon className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.span
                whileHover={{ scale: 1.1 }}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-white text-black font-semibold'
                    : 'text-white hover:text-yellow-300'
                }`}
              >
                {item.name}
              </motion.span>
            </Link>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Cart */}
          <Button
            variant="outline"
            size="icon"
            className="bg-white border-none text-black shadow-sm hover:bg-gray-100 transition"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>

          {/* Auth Buttons */}
          {user ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="bg-white border-none shadow-sm text-black hover:bg-gray-100"
              >
                <User className="w-4 h-4" />
              </Button>
              <Button
                onClick={logout}
                variant="outline"
                className="bg-white border-none shadow-sm text-black hover:bg-gray-100"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-md px-4 py-2 transition">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-white text-black font-semibold border border-yellow-400 hover:bg-yellow-50 rounded-md px-4 py-2 transition">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
