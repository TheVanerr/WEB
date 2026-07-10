// Firebase yapılandırması ve veri katmanı (CDN, düz HTML projeleri için)
// Ücretsiz plan: sadece Firestore + Anonymous Auth (Storage kullanılmıyor)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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
const auth = getAuth(app);

const COL = {
  machines: "machines",
  documents: "documents",
  assignments: "assignments"
};

let authPromise = null;

function formatFirebaseError(err) {
  const code = err && err.code ? err.code : '';
  if (code === 'auth/operation-not-allowed') {
    return 'Anonymous Auth kapalı. Firebase Console → Authentication → Sign-in method → Anonymous → Enable';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'Domain yetkisiz. Authentication → Settings → Authorized domains → thevanerr.github.io ekleyin';
  }
  if (code === 'permission-denied') {
    return 'Firestore izni yok. Firestore Database → Rules güncelleyin';
  }
  return (err && err.message) ? err.message : 'Bilinmeyen Firebase hatası';
}

function ensureAuth() {
  if (!authPromise) {
    authPromise = signInAnonymously(auth).catch(function (err) {
      authPromise = null;
      throw new Error(formatFirebaseError(err));
    });
  }
  return authPromise;
}

async function fetchAll(colName) {
  await ensureAuth();
  const snap = await getDocs(collection(db, colName));
  return snap.docs.map(function (d) {
    return Object.assign({ _id: d.id }, d.data());
  });
}

async function add(colName, data) {
  await ensureAuth();
  const refDoc = await addDoc(collection(db, colName), data);
  return refDoc.id;
}

async function removeById(colName, id) {
  await ensureAuth();
  await deleteDoc(doc(db, colName, id));
}

const DolfinDB = {
  ready: ensureAuth,
  getMachines() { return fetchAll(COL.machines); },
  getDocuments() { return fetchAll(COL.documents); },
  getAssignments() { return fetchAll(COL.assignments); },
  addMachine(m) { return add(COL.machines, m); },
  addDocument(d) { return add(COL.documents, d); },
  addAssignment(a) { return add(COL.assignments, a); },
  deleteMachine(id) { return removeById(COL.machines, id); },
  deleteDocument(id) { return removeById(COL.documents, id); },
  deleteAssignment(id) { return removeById(COL.assignments, id); }
};

export { DolfinDB, formatFirebaseError };
