// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "shelter-seeker.firebaseapp.com",
  projectId: "shelter-seeker",
  storageBucket: "shelter-seeker.appspot.com",
  messagingSenderId: "834371567114",
  appId: "1:834371567114:web:ef1fa7ab11b9a2c190e9f3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);