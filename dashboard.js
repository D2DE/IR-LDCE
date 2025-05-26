import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, orderBy, getDocs, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCRhKq7k4v2MdiE5xT4H7-Yb7SLQ5mvTn8",
  authDomain: "quiz-app-1b48b.firebaseapp.com",
  projectId: "quiz-app-1b48b",
  storageBucket: "quiz-app-1b48b.appspot.com",
  messagingSenderId: "765334603137",
  appId: "1:765334603137:web:1c8a13f6086a6773c2d480"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Check localStorage-based login
function isLoggedInLocalStorage() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

// Format Firestore timestamp into readable string
function formatDateTime(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString() + ", " +
         d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

// DOM references
const errorDiv = document.getElementById('error-message');
const dashboardContainer = document.querySelector('.dashboard-container');
const usernameSpan = document.getElementById('dashboard-username');
const emailSpan = document.getElementById('account-email');
const avatarImg = document.getElementById('userAvatar');
const historyBody = document.getElementById('quizHistoryBody');

// Show demo dashboard for localStorage auth
function showDemoDashboard() {
  errorDiv.style.display = 'none';
  dashboardContainer && (dashboardContainer.style.display = 'block');
  
  // Show demo data
  usernameSpan.textContent = "Demo User";
  emailSpan.textContent = "demo@example.com";
  avatarImg.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=demo";
  
  // Show demo quiz history
  historyBody.innerHTML = `
    <tr><td colspan="3" class="text-center text-muted">Demo mode - No quiz history available.</td></tr>
  `;
  
  // Setup quiz buttons
  document.querySelectorAll('.manual-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const manual = btn.dataset.manual;
      if (manual) {
        window.location.href = `quiz.html?manual=${encodeURIComponent(manual)}`;
      }
    });
  });
}

// Show error (not logged in)
function showNotLoggedIn() {
  errorDiv.style.display = 'block';
  dashboardContainer && (dashboardContainer.style.display = 'none');
}

// Handle auth state
onAuthStateChanged(auth, async (user) => {
  // First check localStorage auth (for demo login from header)
  if (!user && !isLoggedInLocalStorage()) {
    showNotLoggedIn();
    return;
  }
  
  // If localStorage login but no Firebase user, show demo dashboard
  if (!user && isLoggedInLocalStorage()) {
    showDemoDashboard();
    return;
  }
  
  // If Firebase user exists, show full dashboard
  errorDiv.style.display = 'none';
  dashboardContainer && (dashboardContainer.style.display = 'block');

  // Load profile
  try {
    const userRef = doc(db, "users", user.uid);
    let userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const username = user.email.split('@')[0];
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`;
      await setDoc(userRef, {
        email: user.email,
        username,
        createdAt: serverTimestamp(),
        avatarUrl
      });
      userSnap = await getDoc(userRef); // re-fetch
    }

    const userData = userSnap.data();
    usernameSpan.textContent = userData.username || user.email.split('@')[0];
    emailSpan.textContent = user.email;
    avatarImg.src = userData.avatarUrl || "default-avatar.png";

    // Optional: fallback in case avatar fails to load
    avatarImg.onerror = () => {
      avatarImg.src = "default-avatar.png";
    };
  } catch (err) {
    console.error("Profile load error:", err);
    errorDiv.innerHTML = 'Failed to load user profile. Please <a href="login.html">login again</a>.';
    errorDiv.style.display = 'block';
    dashboardContainer && (dashboardContainer.style.display = 'none');
    return;
  }

  // Load quiz history
  try {
    const quizQuery = query(
      collection(db, "users", user.uid, "quizHistory"),
      orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(quizQuery);
    historyBody.innerHTML = "";

    if (snapshot.empty) {
      historyBody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">No quiz attempts yet.</td></tr>`;
    } else {
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        historyBody.innerHTML += `
          <tr>
            <td>${formatDateTime(data.timestamp)}</td>
            <td>${data.manual || '-'}</td>
            <td>${data.score}/${data.totalQuestions}</td>
          </tr>`;
      });
    }
  } catch (err) {
    console.error("Quiz history error:", err);
    historyBody.innerHTML = `<tr><td colspan="3" class="text-danger">Failed to load quiz history.</td></tr>`;
  }

  // Setup quiz buttons
  document.querySelectorAll('.manual-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const manual = btn.dataset.manual;
      if (manual) {
        window.location.href = `quiz.html?manual=${encodeURIComponent(manual)}`;
      }
    });
  });
});
