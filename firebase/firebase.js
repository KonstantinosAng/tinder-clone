import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from "@env"

import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from "firebase/auth"
import {
  getFirestore,
  setDoc,
  addDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  collection,
  getDocs,
  query,
  where,
  getDoc,
  orderBy,
} from "firebase/firestore"

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getFirestore()

export {
  auth,
  db,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  setDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  collection,
  getDocs,
  query,
  where,
  getDoc,
  addDoc,
  orderBy,
}
