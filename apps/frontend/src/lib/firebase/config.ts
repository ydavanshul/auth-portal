import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy_api_key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "localhost",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "auth-portal-yda123",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "localhost",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// Initialize Firebase only once
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Safe export bypassing Next.js server-side prerender crashes if env variables are empty
export const auth: Auth = typeof window !== "undefined" ? getAuth(app) : ({} as unknown as Auth);
export const db: Firestore = typeof window !== "undefined" ? getFirestore(app) : ({} as unknown as Firestore);
export const storage: FirebaseStorage = typeof window !== "undefined" ? getStorage(app) : ({} as unknown as FirebaseStorage);
