// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2RZNZC_A5HbcxMACOj4P7HMwhyaGxaK0",
  authDomain: "user-list-camplight-app.firebaseapp.com",
  projectId: "user-list-camplight-app",
  storageBucket: "user-list-camplight-app.appspot.com",
  messagingSenderId: "913042274467",
  appId: "1:913042274467:web:0ab5fe4e9ed8db438b6716",
  measurementId: "G-R36HLQ8WT4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };