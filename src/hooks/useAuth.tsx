
import { useState, useEffect, createContext, useContext } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  age?: number;
  gender?: string;
  contactNumber?: string;
  budget?: number;
  preferences?: string[];
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          // Fetch user profile from Firestore
          const profileDoc = await getDoc(doc(db, 'users', user.uid));
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data() as UserProfile);
          }
        } catch (error) {
          console.log('Error fetching user profile:', error);
          // Create a basic profile if we can't fetch from Firestore
          setUserProfile({
            uid: user.uid,
            email: user.email!,
            name: user.displayName || 'User'
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signin = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      name,
    };
    
    try {
      await setDoc(doc(db, 'users', user.uid), profile);
      setUserProfile(profile);
    } catch (error) {
      console.log('Error creating user profile in Firestore:', error);
      // Still set the profile locally even if Firestore fails
      setUserProfile(profile);
      throw new Error('Account created but profile save failed due to database permissions');
    }
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    try {
      // Check if user profile exists, if not create one
      const profileDoc = await getDoc(doc(db, 'users', user.uid));
      if (!profileDoc.exists()) {
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          name: user.displayName || 'User',
        };
        await setDoc(doc(db, 'users', user.uid), profile);
        setUserProfile(profile);
      }
    } catch (error) {
      console.log('Error with Google sign-in profile:', error);
      // Create basic profile locally if Firestore fails
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        name: user.displayName || 'User',
      };
      setUserProfile(profile);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateProfile = async (profileUpdates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    const updatedProfile = { ...userProfile, ...profileUpdates };
    
    try {
      await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });
      setUserProfile(updatedProfile as UserProfile);
      console.log('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      if (error.code === 'permission-denied') {
        // Update profile locally even if Firestore fails
        setUserProfile(updatedProfile as UserProfile);
        throw new Error('Profile updated locally but database permissions prevent cloud save');
      }
      
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signin,
    signup,
    signInWithGoogle,
    logout,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
