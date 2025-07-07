import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { UserIcon } from '@heroicons/react/24/solid';
import { Footer } from '../components/footer';
import { useNavigate } from 'react-router-dom';

export default function ShowProfile() {
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
            onClick={() => navigate('/profile')}
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
