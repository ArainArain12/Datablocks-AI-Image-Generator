// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';



const firebaseConfig = {
  apiKey: "AIzaSyDPjFHKqKkyrfcLSNpyB6EFxfMPE5buP5E",
  authDomain: "datablocks-507b8.firebaseapp.com",
  projectId: "datablocks-507b8",
  storageBucket: "datablocks-507b8.appspot.com",
  messagingSenderId: "629877656635",
  appId: "1:629877656635:web:dca9a23164b552b62fe01e",
  measurementId: "G-04JQVBGF69"
  };
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  
  export { storage, ref,uploadBytes,getDownloadURL };