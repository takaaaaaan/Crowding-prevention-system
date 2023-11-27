import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import { getDatabase, ref, child, get } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js';

// Firebase 구성
const firebaseConfig = {
  apiKey: "AIzaSyCbrEtEbg1DTDI65shQkOUWG0FronjSZ7Y",
  authDomain: "watchaut.firebaseapp.com",
  databaseURL: "https://watchaut-default-rtdb.firebaseio.com",
  projectId: "watchaut",
  storageBucket: "watchaut.appspot.com",
  messagingSenderId: "136117526904",
  appId: "1:136117526904:web:e2d0399b33bf662d7da88d",
  measurementId: "G-Q24YJF35Z1"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);



// load data
const dbRef = ref(database);

get(child(dbRef, `Density`)).then((snapshot) => {
  if (snapshot.exists()) {
      console.log(snapshot.val());
  } else {
      console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});