// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';



const firebaseConfig = {
    apiKey: "AIzaSyD1u12-N2soL-kBVxewlN5UbmlyDL7DnxQ",
    authDomain: "datablocks-a36be.firebaseapp.com",
    projectId: "datablocks-a36be",
    storageBucket: "datablocks-a36be.appspot.com",
    messagingSenderId: "259380964926",
    appId: "1:259380964926:web:0d33c479cc279173366b6f"
  };
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  
  export { storage, ref,uploadBytes,getDownloadURL };