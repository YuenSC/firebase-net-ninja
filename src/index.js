import { getAnalytics } from "firebase/analytics";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdFjap7sk2Kv6itKTbMQnfTh9UQ7ucbGU",
  authDomain: "myproject-32b53.firebaseapp.com",
  projectId: "myproject-32b53",
  storageBucket: "myproject-32b53.appspot.com",
  messagingSenderId: "864282881150",
  appId: "1:864282881150:web:8565798c09b65d88583c2f",
  measurementId: "G-CZKKEE280C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore();
const collectionRef = collection(db, "books");
getDocs(collectionRef)
  .then((snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
      books.push({ ...doc.data(), id: doc.id });
    });
  })
  .catch((error) => {
    console.log("error :>> ", error);
  });
