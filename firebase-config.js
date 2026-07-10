// Firebase yapılandırması ve veri katmanı (CDN, düz HTML projeleri için)
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

// Koleksiyon adları
const COL = {
  machines: "machines",
  documents: "documents",
  assignments: "assignments"
};

async function fetchAll(colName) {
  const snap = await getDocs(collection(db, colName));
  return snap.docs.map(function (d) {
    return Object.assign({ _id: d.id }, d.data());
  });
}

async function add(colName, data) {
  const refDoc = await addDoc(collection(db, colName), data);
  return refDoc.id;
}

async function removeById(colName, id) {
  await deleteDoc(doc(db, colName, id));
}

async function uploadFile(path, file) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

async function deleteFile(path) {
  try {
    await deleteObject(ref(storage, path));
  } catch (e) {
    // Dosya yoksa ya da silinemezse sessizce geç
  }
}

const DolfinDB = {
  // Okuma
  getMachines() { return fetchAll(COL.machines); },
  getDocuments() { return fetchAll(COL.documents); },
  getAssignments() { return fetchAll(COL.assignments); },
  // Yazma
  addMachine(m) { return add(COL.machines, m); },
  addDocument(d) { return add(COL.documents, d); },
  addAssignment(a) { return add(COL.assignments, a); },
  // Silme
  deleteMachine(id) { return removeById(COL.machines, id); },
  deleteDocument(id) { return removeById(COL.documents, id); },
  deleteAssignment(id) { return removeById(COL.assignments, id); },
  // Dosya
  uploadFile: uploadFile,
  deleteFile: deleteFile
};

export { DolfinDB };
