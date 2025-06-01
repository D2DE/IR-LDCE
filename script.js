const manualNames = {
  irwm: "Indian Railway Works Manual",
  irpwm: "Indian Railway P-way Manual",
  irdim: "Indian Railway Schedule of Dimensions",
  irec: "Indian Railway Engineering Code",
  stm: "Small Track Machine Manual",
  usfd: "USFD Manual",
  fbwm: "FBW Manual",
  store: "Store Manual",
  account: "Account Manual",
  pyq2022: "PYQ 30% Main 2022",
  pyq2021: "PYQ 30% Main 2021"
};

window.initQuiz = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const manual = urlParams.get("manual");
  const jsonFile = manual ? `https://d2de.github.io/IR-LDCE/${manual}-questions.json` : null;

  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  const quizDuration = 600;
  let totalTimeLeft = quizDuration;
  let totalTimer;
  const answersSelected = [];
  const markedForReview = new Set();

  const questionElement = document.getElementById("question");
  const answerButtons = document.getElementById("answer-buttons");
  const nextButton = document.getElementById("next-btn");
  const markReviewButton = document.getElementById("mark-review-btn");
  const timerElement = document.getElementById("timer");
  const reviewPanel = document.getElementById("review-panel");
  const headingElement = document.querySelector(".app h1");

  if (manual && manualNames[manual]) {
    headingElement.textContent = `${manualNames[manual]} Quiz`;
  }

  async function loadQuestions() {
    if (!jsonFile) {
      questionElement.innerHTML = "No manual selected.<br><a href='index.html'>Go back</a>";
      return;
    }

    try {
      const res = await fetch(jsonFile);
      if (!res.ok) throw new Error("Unable to load questions.");
      questions = await res.json();
      startQuiz();
    } catch (err) {
      questionElement.innerHTML = "Error loading questions.<br><a href='index.html'>Go back</a>";
      console.error(err);
    }
  }

  function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    answersSelected.length = questions.length;
    markedForReview.clear();
    updateReviewPanel();
    startTotalTimer();
    showQuestion();
  }

  function startTotalTimer() {
    updateTimerDisplay();
    totalTimer = setInterval(() => {
      totalTimeLeft--;
      updateTimerDisplay();
      if (totalTimeLeft <= 0) {
        clearInterval(totalTimer);
        alert("⏰ Time's up!");
        showScore();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const mins = Math.floor(totalTimeLeft / 60);
    const secs = totalTimeLeft % 60;
    const percent = (totalTimeLeft / quizDuration) * 100;

    timerElement.innerHTML = `
      <div style="position: relative; width: 80px; height: 80px;">
        <svg width="80" height="80">
          <circle r="35" cx="40" cy="40" fill="transparent" stroke="#eee" stroke-width="6"/>
          <circle r="35" cx="40" cy="40" fill="transparent" stroke="#007bff" stroke-width="6"
            stroke-dasharray="${2 * Math.PI * 35}"
            stroke-dashoffset="${((100 - percent) / 100) * 2 * Math.PI * 35}"
            transform="rotate(-90 40 40)"/>
        </svg>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    font-size: 14px; font-weight: bold;">
          ${mins}:${secs.toString().padStart(2, "0")}
        </div>
      </div>`;
  }

  function showQuestion() {
    resetState();
    updateReviewPanel();

    const q = questions[currentQuestionIndex];
    const questionNo = currentQuestionIndex + 1;
    let html = `<strong>${questionNo}. ${q.question}</strong>`;
    if (q.image) {
      html += `<div><img src="${q.image}" alt="question image" class="img-fluid my-2" style="max-height:200px;"></div>`;
    }

    questionElement.innerHTML = html;

    const ul = document.createElement("ul");
    ul.className = "list-unstyled";

    q.answers.forEach((ans, idx) => {
      const li = document.createElement("li");
      li.className = "mb-2";

      const btn = document.createElement("button");
      btn.className = "btn btn-outline-primary w-100 text-start";
      btn.innerHTML = ans.image
        ? `<span>${ans.text}</span><img src="${ans.image}" alt="option image" class="ms-auto" style="max-height:40px;">`
        : ans.text;

      btn.dataset.correct = ans.correct;
      btn.addEventListener("click", () => selectAnswer(idx, btn));

      if (answersSelected[currentQuestionIndex] === idx) {
        btn.classList.remove("btn-outline-primary");
        btn.classList.add(ans.correct ? "btn-success" : "btn-danger");
      }

      li.appendChild(btn);
      ul.appendChild(li);
    });

    answerButtons.appendChild(ul);
  }

  function resetState() {
    nextButton.style.display = "none";
    markReviewButton.style.display = "inline-block";
    answerButtons.innerHTML = "";
  }

  function selectAnswer(index, button) {
    answersSelected[currentQuestionIndex] = index;
    const correct = button.dataset.correct === "true";

    if (correct) score += 1;
    else score -= 1 / 3;

    const buttons = answerButtons.querySelectorAll("button");
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (btn.dataset.correct === "true") {
        btn.classList.add("btn-success");
      } else if (i === index) {
        btn.classList.add("btn-danger");
      }
    });

    nextButton.style.display = "inline-block";
    updateReviewPanel();
  }

  nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      showQuestion();
    } else {
      confirmSubmit();
    }
  });

  markReviewButton.addEventListener("click", () => {
    markedForReview.add(currentQuestionIndex);
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      showQuestion();
    } else {
      confirmSubmit();
    }
  });

  function confirmSubmit() {
    const unanswered = answersSelected.filter((a) => a === undefined).length;
    const marked = markedForReview.size;

    if (unanswered > 0 || marked > 0) {
      if (
        confirm(
          `You have ${unanswered} unanswered and ${marked} marked questions.\nSubmit anyway?`
        )
      ) {
        showScore();
      }
    } else {
      showScore();
    }
  }

  function showScore() {
    clearInterval(totalTimer);
    resetState();
    updateReviewPanel();

    questionElement.innerHTML = `
      <div class="alert alert-info" role="alert">
        You scored <strong>${score.toFixed(2)}</strong> out of <strong>${questions.length}</strong>!
      </div>
      <a href="index.html" class="btn btn-secondary mt-2">Back to Manuals</a>`;

    nextButton.textContent = "Play Again";
    nextButton.style.display = "inline-block";
    markReviewButton.style.display = "none";

    saveQuizResult();
  }

  function updateReviewPanel() {
    if (!reviewPanel) return;

    reviewPanel.innerHTML = "";
    questions.forEach((_, idx) => {
      const btn = document.createElement("button");
      btn.className = "btn btn-sm mx-1 mb-2";

      if (answersSelected[idx] !== undefined) {
        btn.classList.add("btn-success");
      } else if (markedForReview.has(idx)) {
        btn.classList.add("btn-warning");
      } else {
        btn.classList.add("btn-secondary");
      }

      btn.textContent = idx + 1;
      btn.addEventListener("click", () => {
        currentQuestionIndex = idx;
        showQuestion();
      });

      reviewPanel.appendChild(btn);
    });
  }

  async function saveQuizResult() {
    try {
      const auth = window.firebaseAuth;
      const db = window.firebaseDb;
      const user = auth.currentUser;
      if (!user) return;

      const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

      await addDoc(collection(db, "users", user.uid, "quizHistory"), {
        manual,
        score,
        totalQuestions: questions.length,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn("Skipping Firebase saving:", err.message);
    }
  }

  loadQuestions();
};
