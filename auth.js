// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = { ... }; // Paste your config here
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Registration
document.getElementById('registerForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert('Registration successful!');
      window.location.href = 'login.html';
    })
    .catch(error => alert(error.message));
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert('Login successful!');
      window.location.href = 'index.html'; // Redirect to homepage
    })
    .catch(error => alert(error.message));
});
