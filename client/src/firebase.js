// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-5cd77.firebaseapp.com",
  projectId: "mern-real-estate-5cd77",
  storageBucket: "mern-real-estate-5cd77.appspot.com",
  messagingSenderId: "897776245790",
  appId: "1:897776245790:web:f6580143a0c301b222a20f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);