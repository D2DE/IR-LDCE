import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, orderBy, getDocs, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase config
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

// Utility: Format date and time
function formatDateTime(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  // Example: "23/05/2025, 20:37"
  return d.toLocaleDateString() + ", " +
         d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

onAuthStateChanged(auth, async (user) => {
  const errorDiv = document.getElementById('error-message');
  if (!user) {
    errorDiv.style.display = 'block';
    document.querySelector('.dashboard-container').style.display = 'none';
    return;
  }
  document.querySelector('.dashboard-container').style.display = 'block';
  errorDiv.style.display = 'none';

  // Load user profile
  const userRef = doc(db, "users", user.uid);
  let userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    // Create user doc if not exists, with default avatar (use a good avatar API here if you wish)
    await setDoc(userRef, {
      email: user.email,
      username: user.email.split('@')[0],
      createdAt: serverTimestamp(),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email.split('@')[0])}`
    });
    userSnap = await getDoc(userRef);
  }
  const userData = userSnap.data();
  document.getElementById('dashboard-username').textContent = userData.username || user.email.split('@')[0];
  document.getElementById('account-email').textContent = user.email;
  document.getElementById('userAvatar').src = userData.avatarUrl || "default-avatar.png";

  // Load quiz history
  const q = query(collection(db, "users", user.uid, "quizHistory"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  const historyBody = document.getElementById('quizHistoryBody');
  historyBody.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    historyBody.innerHTML += `
      <tr>
        <td>${formatDateTime(data.timestamp)}</td>
        <td>${data.manual}</td>
        <td>${data.score}/${data.totalQuestions}</td>
      </tr>
    `;
  });

  // Quiz button handlers
  document.querySelectorAll('.manual-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = `quiz.html?manual=${btn.dataset.manual}`;
    });
  });

  // No manual logout button here; handled by header
});
