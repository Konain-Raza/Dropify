import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
 
  import {doc, getDoc,updateDoc,setDoc ,arrayUnion, serverTimestamp, getFirestore} from "firebase/firestore"
const firebaseConfig = {
  apiKey: 'AIzaSyDsmdCacelhQdWNVLsj6ENV2A8imZZBNoI',
  authDomain: 'dropify-58c4f.firebaseapp.com',
  projectId: 'dropify-58c4f',
  storageBucket: 'dropify-58c4f.appspot.com',
  messagingSenderId: '676477366776',
  appId: '1:676477366776:web:e989e1ac55ce997153260d',
  measurementId: 'G-4JMKKRCSJZ',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db,storage, getDoc ,getStorage, ref, uploadBytesResumable,setDoc, getDownloadURL ,doc, updateDoc,arrayUnion, serverTimestamp};
