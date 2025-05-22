import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCRhKq7k4v2MdiE5xT4H7-Yb7SLQ5mvTn8",
  authDomain: "quiz-app-1b48b.firebaseapp.com",
  projectId: "quiz-app-1b48b",
  // ...other config values
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('error-message');
    errorDiv.style.display = "none";

    if (!email || !password) {
      errorDiv.textContent = "Please enter both email and password.";
      errorDiv.style.display = "block";
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      window.location.href = redirect || 'dashboard.html';
    } catch (error) {
      let msg = "Login failed. Please try again.";
      if (error.code === 'auth/user-not-found') msg = "No user found with this email.";
      else if (error.code === 'auth/wrong-password') msg = "Incorrect password.";
      else if (error.code === 'auth/invalid-email') msg = "Invalid email address.";
      errorDiv.textContent = msg;
      errorDiv.style.display = "block";
    }
  });
}
