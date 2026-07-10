// Firebase yapılandırması ve başlatma (CDN, düz HTML projeleri için)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  doc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCv4PPyM6MDYKOijpuVgL_lBB2PPBk5lP8",
  authDomain: "cnkd-62f43.firebaseapp.com",
  projectId: "cnkd-62f43",
  storageBucket: "cnkd-62f43.firebasestorage.app",
  messagingSenderId: "1024475647893",
  appId: "1:1024475647893:web:b516ac4d364a1d53ca709c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  db,
  storage,
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
};
