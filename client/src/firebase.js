// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-67d0d.firebaseapp.com",
  projectId: "mern-estate-67d0d",
  storageBucket: "mern-estate-67d0d.appspot.com",
  messagingSenderId: "655011118433",
  appId: "1:655011118433:web:518f53e13a8d2391d2d920",
  measurementId: "G-WPNPH3DG8V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);