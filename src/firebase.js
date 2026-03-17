import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPMrtWEu_j2FZ26Abg70qx2x9pTQpUfyQ",
  authDomain: "croud-il.firebaseapp.com",
  projectId: "croud-il",
  storageBucket: "croud-il.firebasestorage.app",
  messagingSenderId: "220644303182",
  appId: "1:220644303182:android:ae61c37f7d5ba90820fe1f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
