import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAss7jnWSc0cxZcheK4i22HPG8HHxuOpXQ',
  authDomain: 'kupi-baton.firebaseapp.com',
  projectId: 'kupi-baton',
  storageBucket: 'kupi-baton.appspot.com',
  messagingSenderId: '92319164707',
  appId: '1:92319164707:web:88677c74d6536923a10496',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
