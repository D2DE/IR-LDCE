// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyCRhKq7k4v2MdiE5xT4H7-Yb7SLQ5mvTn8",
  authDomain: "quiz-app-1b48b.firebaseapp.com",
  projectId: "quiz-app-1b48b",
  storageBucket: "quiz-app-1b48b.appspot.com", // fix domain here (not firebasestorage.app)
  messagingSenderId: "765334603137",
  appId: "1:765334603137:web:1c8a13f6086a6773c2d480",
  measurementId: "G-YQJQWJ12N7"
};

export const app = initializeApp(firebaseConfig);
