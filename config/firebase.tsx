// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGqmQOsYkMJPzw440sT7Giv4-Bw7d8Ibc",
  authDomain: "word-forger.firebaseapp.com",
  projectId: "word-forger",
  storageBucket: "word-forger.appspot.com",
  messagingSenderId: "585806154913",
  appId: "1:585806154913:web:c1355cd0c7c9cd007734e0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth() 