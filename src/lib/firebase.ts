import { initializeApp } from 'firebase/app';
import { getFirestore, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDpA1ttVV9VFytkApgY3wkfirNe9GTvpx4",
  authDomain: "youneskamoulyportfolio2.firebaseapp.com",
  projectId: "youneskamoulyportfolio2",
  storageBucket: "youneskamoulyportfolio2.firebasestorage.app",
  messagingSenderId: "851113538007",
  appId: "1:851113538007:web:b08043a9876889f94f1b92",
  measurementId: "G-V72314WFXY",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const portfolioDocRef = doc(db, 'portfolio', 'data');
