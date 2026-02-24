import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAMNHkpWrYNnPBxSYo_6-9jOlpy4ga6Quc",
  authDomain: "edubox-mvp-74ba7.firebaseapp.com",
  projectId: "edubox-mvp-74ba7",
  storageBucket: "edubox-mvp-74ba7.appspot.com",
  messagingSenderId: "528103804380",
  appId: "1:528103804380:web:772fa8a68f776c8d1cd319",
  measurementId: "G-H714ZB9CBN",
};

// ✅ Prevent duplicate Firebase init
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Firestore
const db = getFirestore(app);

// ✅ Auth
const auth = getAuth(app);

export {
  db,
  auth,
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  orderBy,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
};
