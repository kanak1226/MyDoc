// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAehspbzmG-_rNQ7lg61aSO-3Kgqh1WucQ",
  authDomain: "mydoc-2aad6.firebaseapp.com",
  projectId: "mydoc-2aad6",
  storageBucket: "mydoc-2aad6.firebasestorage.app",
  messagingSenderId: "502144266311",
  appId: "1:502144266311:web:3d07238ddfe8549cec8162",
  measurementId: "G-W0BXMP1J85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Firebase Authentication
const db = getFirestore(app);
const auth = getAuth(app);

// Export the initialized services to use them in other files
export { db, auth };
