
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyDvIykqiu0cizKrNhC5k20vPk5ZCwFs13A",
  authDomain: "ngo1-74945.firebaseapp.com",
  projectId: "ngo1-74945",
  storageBucket: "ngo1-74945.appspot.com",
  messagingSenderId: "146622681607",
  appId: "1:146622681607:web:608a61a4749d42250550a2",
  measurementId: "G-ZZ62T6JGEB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const storage = getStorage(app)

// const analytics = getAnalytics(app)

export {db, storage, app}
export default firebaseConfig