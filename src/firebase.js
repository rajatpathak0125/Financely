
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "AIzaSyCniF1sY3hvCWZmHqGkrN9Uoh2EXyjUjY4",
  authDomain: "financely-a62b6.firebaseapp.com",
  projectId: "financely-a62b6",
  storageBucket: "financely-a62b6.appspot.com",
  messagingSenderId: "510615246937",
  appId: "1:510615246937:web:303727d14ce25d7d58b948",
  measurementId: "G-1HSJZKF3NH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };