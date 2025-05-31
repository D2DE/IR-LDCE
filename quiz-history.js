// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCRhKq7k4v2MdiE5xT4H7-Yb7SLQ5mvTn8",
  authDomain: "quiz-app-1b48b.firebaseapp.com",
  projectId: "quiz-app-1b48b",
  storageBucket: "quiz-app-1b48b.appspot.com",
  messagingSenderId: "765334603137",
  appId: "1:765334603137:web:1c8a13f6086a6773c2d480"
};

// Initialize Firebase (v9 compat)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Set auth persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// DOM references
const errorDiv = document.getElementById('error-message');
const historyBody = document.getElementById('quizHistoryBody');
const loginLink = document.getElementById('loginLink');
const logoutButton = document.getElementById('logoutButton');
const dashboardLink = document.getElementById('dashboardLink');
const mobileDashboardLink = document.getElementById('mobileDashboardLink');


// Format Firestore timestamp into readable string
function formatDateTime(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString() + ", " +
         d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

// Load quiz history function
async function loadQuizHistory(user) {
  try {
    console.log("Loading quiz history for user:", user.uid);
    
    const quizHistoryRef = db.collection("users").doc(user.uid).collection("quizHistory");
    const snapshot = await quizHistoryRef.orderBy("timestamp", "desc").get();
    
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
}

// Handle logout
function handleLogout() {
  auth.signOut().then(() => {
    console.log("User signed out successfully");
  }).catch((error) => {
    console.error("Sign out error:", error);
  });
}

// Set up event listeners
logoutButton.addEventListener("click", handleLogout);

// Handle auth state changes (v9 compat style)
auth.onAuthStateChanged((user) => {
  console.log("Auth state changed:", user ? `User: ${user.email}` : "No user");
  
  if (user) {
    // User is signed in
    errorDiv.classList.add('d-none');
    loginLink.style.display = "none";
    logoutButton.style.display = "inline-block";
    dashboardLink.style.display = "inline-block";
    if (mobileDashboardLink) mobileDashboardLink.style.display = "inline";
    
    // Load quiz history
    loadQuizHistory(user);
  } else {
    // User is signed out
    errorDiv.classList.remove('d-none');
    loginLink.style.display = "inline-block";
    logoutButton.style.display = "none";
    dashboardLink.style.display = "none";
    if (mobileDashboardLink) mobileDashboardLink.style.display = "none";
    
    // Clear history table
    historyBody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">Please log in to view your quiz history.</td></tr>`;
  }
});

console.log("Quiz history script loaded with Firebase v9 compat");
