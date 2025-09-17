import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCvoDIeThqegBcZv0sE2VMWcIg2v5P4FBA",
  authDomain: "cryptobotx-trading.firebaseapp.com",
  projectId: "cryptobotx-trading",
  storageBucket: "cryptobotx-trading.firebasestorage.app",
  messagingSenderId: "976199706073",
  appId: "1:976199706073:web:34b8f1503999a9ce0da5c8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);