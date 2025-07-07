import React, { useEffect, useState, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { UserIcon } from '@heroicons/react/24/solid';
import { Footer } from '../components/footer';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User } from 'lucide-react';
import { MicrophoneIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export function ShowProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data() as { name: string; email: string; phone: string; password: string });
        }
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <div className="h-36 flex flex-col items-center justify-end pb-4">
          <h1 className="text-[#0071CE] text-xl font-bold mb-4">My Profile</h1>
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
            <UserIcon className="w-12 h-12 text-white" />
          </div>
        </div>

        <div className="px-6 py-8 space-y-4 max-w-xl mx-auto border border-black rounded-lg shadow-lg mt-4">
          <div>
            <p className="text-sm text-gray-700 font-medium">Username</p>
            <p className="text-lg text-black">{profileData.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-700 font-medium">Email I’d</p>
            <p className="text-lg text-black">{profileData.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-700 font-medium">Phone Number</p>
            <p className="text-lg text-black">{profileData.phone}</p>
          </div>

          <div>
            <p className="text-sm text-gray-700 font-medium">Password</p>
            <p className="text-lg text-black">********</p>
          </div>

          <Button
            onClick={() => navigate('/account')}
            className="w-full bg-[#FFD100] text-black rounded-full py-2 mt-4 hover:bg-[#e6bd00] hover:scale-105 transition"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const recognitionRef = useRef<any>(null);

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
      alert('Voice search not supported');
    }
  };

  const navItems = [
    { name: 'Categories', path: '/categories' },
    { name: 'Profile', path: '/account' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-[#0071CE] shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 py-4 gap-4">
        <Link to="/" className="flex-shrink-0">
          <motion.div whileHover={{ scale: 1.05 }}>
            <img src="/Logo.png" alt="AI Shopmate" className="h-24 w-auto object-contain" />
          </motion.div>
        </Link>

        <div className="flex-1 w-full sm:w-auto sm:flex-grow max-w-lg">
          <div className="relative group flex items-center bg-white/90 rounded-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
            <input
              type="text"
              placeholder="Search with voice or text..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-full focus:outline-none transition-all"
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

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            className="bg-white border-none text-black shadow-sm hover:bg-gray-100 transition"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>

          <div className="hidden md:flex items-center space-x-3">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <motion.span
                  whileHover={{ scale: 1.05 }}
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

            <div className="relative group">
              <Button
                variant="outline"
                size="icon"
                className="bg-white border-none shadow-sm text-black hover:bg-gray-100"
              >
                <User className="w-4 h-4" />
              </Button>
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
                {user ? (
                  <>
                    <button
                      onClick={() => navigate('/account')}
                      className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/signin')}
                      className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => navigate('/signup')}
                      className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-white" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mt-2 bg-[#005DAA] rounded-lg overflow-hidden px-4 py-4 space-y-4"
          >
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`block w-full text-left px-4 py-2 rounded-full ${
                  location.pathname === item.path
                    ? 'bg-white text-black font-semibold'
                    : 'text-white hover:bg-yellow-400 hover:text-black'
                }`}
              >
                {item.name}
              </button>
            ))}

            <div className="pt-2 border-t border-white/20 space-y-2">
              {user ? (
                <Button
                  onClick={logout}
                  className="w-full bg-white text-black font-semibold"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => handleNavigate('/signin')}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => handleNavigate('/signup')}
                    className="w-full bg-white border border-yellow-400 text-black font-semibold hover:bg-yellow-100"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
