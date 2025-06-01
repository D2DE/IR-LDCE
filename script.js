import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB5yTVihZxy-uOUq7DgSS8--5Ht7CIe8z8",
  authDomain: "mcq-exam-portal-3ae5b.firebaseapp.com",
  projectId: "mcq-exam-portal-3ae5b",
  storageBucket: "mcq-exam-portal-3ae5b.appspot.com",
  messagingSenderId: "468215394057",
  appId: "1:468215394057:web:a6c74c38f71df20d7e05ff",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let quizId = new URLSearchParams(window.location.search).get("quizId");
let questions = [];
let currentIndex = 0;
let answers = [];
let timeLeft = 600; // 10 minutes
let timerInterval;

const quizContainer = document.getElementById("quiz-container");
const indexContainer = document.getElementById("index-container");
const timerCircle = document.getElementById("timer-circle");
const timerText = document.getElementById("timer-text");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const quizDoc = await getDoc(doc(db, "quizzes", quizId));
    if (quizDoc.exists()) {
      questions = quizDoc.data().questions || [];
      answers = new Array(questions.length).fill(null);
      renderIndex();
      renderQuestion();
      startTimer();
    } else {
      alert("Quiz not found");
    }
  } else {
    window.location.href = "login.html";
  }
});

function renderIndex() {
  indexContainer.innerHTML = "";
  questions.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.className = "index-btn";
    btn.textContent = i + 1;
    btn.onclick = () => {
      currentIndex = i;
      renderQuestion();
    };
    indexContainer.appendChild(btn);
  });
}

function renderQuestion() {
  const q = questions[currentIndex];
  quizContainer.innerHTML = `
    <h2>Q${currentIndex + 1}: ${q.question}</h2>
    <div id="options">
      ${q.options
        .map(
          (opt, i) => `
        <label>
          <input type="radio" name="option" value="${i}" ${
            answers[currentIndex] === i ? "checked" : ""
          }>
          ${opt}
        </label><br>
      `
        )
        .join("")}
    </div>
    <div class="actions">
      <button onclick="prevQuestion()">Previous</button>
      <button onclick="nextQuestion()">Next</button>
      <button onclick="markForReview()">Mark for Review</button>
      <button onclick="clearResponse()">Clear</button>
    </div>
    <button onclick="submitQuiz()" class="submit-btn">Submit Quiz</button>
  `;

  const options = document.getElementsByName("option");
  options.forEach((opt) => {
    opt.onchange = () => {
      answers[currentIndex] = parseInt(opt.value);
      updateIndexButtonState(currentIndex);
    };
  });

  updateIndexButtonState(currentIndex);
}

function updateIndexButtonState(index) {
  const btn = indexContainer.children[index];
  if (answers[index] !== null) {
    btn.style.backgroundColor = "#4caf50"; // attempted
  } else {
    btn.style.backgroundColor = "#ff9800"; // unattempted
  }
}

function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
}

function markForReview() {
  const btn = indexContainer.children[currentIndex];
  btn.style.backgroundColor = "#9c27b0"; // marked for review
  nextQuestion();
}

function clearResponse() {
  answers[currentIndex] = null;
  renderQuestion();
  updateIndexButtonState(currentIndex);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitQuiz();
    }
  }, 1000);
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerText.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const percent = (timeLeft / 600) * 100;
  const angle = (percent / 100) * 360;
  timerCircle.style.background = `conic-gradient(#03a9f4 ${angle}deg, #e0e0e0 0deg)`;
}

async function submitQuiz() {
  clearInterval(timerInterval);

  const user = auth.currentUser;
  let correct = 0;
  let wrong = 0;

  questions.forEach((q, i) => {
    if (answers[i] === q.answer) {
      correct++;
    } else if (answers[i] !== null) {
      wrong++;
    }
  });

  const total = questions.length;
  const score = correct - wrong / 3;

  await setDoc(doc(db, "quizHistory", `${user.uid}_${quizId}_${Date.now()}`), {
    userId: user.uid,
    quizId,
    answers,
    correct,
    wrong,
    total,
    score,
    submittedAt: serverTimestamp(),
  });

  alert(`Quiz submitted!\nScore: ${score.toFixed(2)}\nCorrect: ${correct}\nWrong: ${wrong}`);
  window.location.href = "dashboard.html";
}
