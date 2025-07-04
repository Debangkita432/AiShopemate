
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC7aPfbkyWXyLjCDDp7U0-MuAspOvF1kBs",
  authDomain: "sparkathon-6d562.firebaseapp.com",
  projectId: "sparkathon-6d562",
  storageBucket: "sparkathon-6d562.firebasestorage.app",
  messagingSenderId: "698757852700",
  appId: "1:698757852700:web:a5307fb95db159c30bf9d9",
  measurementId: "G-Z7LVQTTZZQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only in browser environment
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
