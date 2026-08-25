import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA71g3bzHV-qSKPvOFB93K62iUfXpPTEmA",
  authDomain: "bikesland-b0e0e.firebaseapp.com",
  projectId: "bikesland-b0e0e",
  storageBucket: "bikesland-b0e0e.firebasestorage.app",
  messagingSenderId: "1097040461046",
  appId: "1:1097040461046:web:3be3460bf81f1705a680d7",
  measurementId: "G-TXKT87B7NX",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);