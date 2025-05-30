// Import Firebase modules and initialize as before
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Format Firestore timestamp into readable string
function formatDateTime(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString() + ", " +
         d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

// DOM references
const errorDiv = document.getElementById('error-message');
const historyBody = document.getElementById('quizHistoryBody');

// Handle auth state
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    errorDiv.style.display = 'block';
    return;
  }

  errorDiv.style.display = 'none';

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
});
