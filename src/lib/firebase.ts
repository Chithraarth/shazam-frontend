import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1JAA9NKj2q3vtsAI5OgsCOAMh91GHKks",
  authDomain: "videofy-e5106.firebaseapp.com",
  projectId: "videofy-e5106",
  storageBucket: "videofy-e5106.firebasestorage.app",
  messagingSenderId: "816984918533",
  appId: "1:816984918533:web:d77079f3bae586520f2a6c",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
