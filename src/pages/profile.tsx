import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserIcon } from '@heroicons/react/24/solid';
import { Footer } from '../components/footer';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data() as {
            name: string;
            email: string;
            phone: string;
            password: string;
          });
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, profileData);
        navigate('/account'); // ✅ redirect to account page
      } catch (error) {
        console.error('Update failed:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <div className="h-36 flex flex-col items-center justify-end pb-4">
          <h1 className="text-[#0071CE] text-xl font-bold mb-4">Edit Profile</h1>
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
            <UserIcon className="w-12 h-12 text-white" />
          </div>
        </div>

        <div className="px-6 py-8 space-y-4 max-w-xl mx-auto border border-black rounded-lg shadow-lg mt-4">
          <div>
            <label className="text-sm text-gray-700">Username</label>
            <Input
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="w-full hover:ring-2 hover:ring-[#0071CE]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Email I’d</label>
            <Input
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className="w-full hover:ring-2 hover:ring-[#0071CE]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Phone Number</label>
            <Input
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
              className="w-full hover:ring-2 hover:ring-[#0071CE]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <Input
              name="password"
              type="password"
              value={profileData.password}
              onChange={handleChange}
              className="w-full hover:ring-2 hover:ring-[#0071CE]"
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-[#FFD100] text-black rounded-full py-2 mt-4 hover:bg-[#e6bd00] hover:scale-105 transition"
          >
            Update
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
