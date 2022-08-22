import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDOBtMqozWu_J9424aqzHFyX_FnOHvA7fQ",
  authDomain: "recordai.firebaseapp.com",
  projectId: "recordai",
  storageBucket: "recordai.appspot.com",
  messagingSenderId: "342762776540",
  appId: "1:342762776540:web:e7d9ef147f90d81acc5119",
  measurementId: "G-5PN5ZWN4NY"
};

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export {firebase};