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
  pyq2021: "PYQ 30% Main 2021",
  30pyq2023: "PYQ 30% Main 2023",
  30pyq2024: "PYQ 30% Main 2024",
  70pyq2023: "PYQ 70% Main 2023",
  70pyq2023sup: "PYQ 70% Sup 2023",
  70pyq2024main: "PYQ 70% Main 2024",
  nair-qb-2019: "NAIR Question Bank 2019"
};

window.initQuiz = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const manual = urlParams.get('manual');
  const jsonFile = manual ? `https://d2de.github.io/IR-LDCE/${manual}-questions.json` : null;

  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  const quizDuration = 600; // 10 minutes
  let totalTimeLeft = quizDuration;
  let totalTimer;

  const questionElement = document.getElementById("question");
  const answerButtons = document.getElementById("answer-buttons");
  const nextButton = document.getElementById("next-btn");
  const headingElement = document.querySelector('.app h1');
  const timerElement = document.getElementById("timer");

  if (manual && manualNames[manual]) {
    headingElement.textContent = `${manualNames[manual]} Quiz`;
  } else {
    headingElement.textContent = "Quiz";
  }

  async function loadQuestions() {
    if (!jsonFile) {
      questionElement.innerHTML = "No manual selected.<br><a href='index.html'>Go back</a>";
      nextButton.style.display = "none";
      return;
    }

    try {
      const response = await fetch(jsonFile);
      if (!response.ok) throw new Error("Failed to load questions");
      questions = await response.json();
      startQuiz();
    } catch (error) {
      questionElement.innerHTML = "Error loading questions.<br><a href='index.html'>Go back</a>";
      console.error(error);
    }
  }

  function startTotalTimer() {
    updateTimerDisplay();
    totalTimer = setInterval(() => {
      totalTimeLeft--;
      updateTimerDisplay();
      if (totalTimeLeft <= 0) {
        clearInterval(totalTimer);
        alert("⏰ Time is up! Quiz will be submitted.");
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
          <circle r="35" cx="40" cy="40" fill="transparent" stroke="#ddd" stroke-width="6"/>
          <circle r="35" cx="40" cy="40" fill="transparent" stroke="#007bff" stroke-width="6"
            stroke-dasharray="${2 * Math.PI * 35}"
            stroke-dashoffset="${((100 - percent) / 100) * 2 * Math.PI * 35}"
            transform="rotate(-90 40 40)"/>
        </svg>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    font-size: 14px; font-weight: bold;">
          ${mins}:${secs.toString().padStart(2, '0')}
        </div>
      </div>
    `;
  }

  function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    startTotalTimer();
    showQuestion();
  }

  function showQuestion() {
    resetState();

    const currentQuestion = questions[currentQuestionIndex];
    const questionNo = currentQuestionIndex + 1;
    let html = `<strong>${questionNo}. ${currentQuestion.question}</strong>`;
    if (currentQuestion.image) {
      html += `<div><img src="${currentQuestion.image}" alt="question image" style="max-height:200px;" class="img-fluid my-2"></div>`;
    }

    questionElement.innerHTML = html;

    const ul = document.createElement("ul");
    ul.className = "list-unstyled";

    currentQuestion.answers.forEach(answer => {
      const li = document.createElement("li");
      li.className = "mb-2";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-outline-primary w-100 text-start d-flex align-items-center";
      button.setAttribute("tabindex", 0);
      button.setAttribute("aria-label", answer.text);
      button.innerHTML = answer.image
        ? `<span>${answer.text}</span><img src="${answer.image}" alt="option image" class="ms-auto" style="max-height:40px;">`
        : answer.text;

      if (answer.correct) button.dataset.correct = "true";
      button.addEventListener("click", selectAnswer);
      li.appendChild(button);
      ul.appendChild(li);
    });

    answerButtons.appendChild(ul);
  }

  function resetState() {
    nextButton.style.display = "none";
    answerButtons.innerHTML = "";
  }

  function selectAnswer(e) {
    const selectedBtn = e.target.closest("button");
    const isCorrect = selectedBtn.dataset.correct === "true";

    selectedBtn.classList.remove("btn-outline-primary");
    selectedBtn.classList.add(isCorrect ? "btn-success" : "btn-danger");

    if (isCorrect) {
      score += 1;
    } else {
      score -= 1 / 3;
    }

    const allButtons = answerButtons.querySelectorAll("button");
    allButtons.forEach(button => {
      if (button.dataset.correct === "true") {
        button.classList.remove("btn-outline-primary");
        button.classList.add("btn-success");
      }
      button.disabled = true;
    });

    nextButton.style.display = "block";
    nextButton.focus();
  }

  function showScore() {
    clearInterval(totalTimer);
    resetState();

    questionElement.innerHTML = `
      <div class="alert alert-info" role="alert">
        You scored <strong>${score.toFixed(2)}</strong> out of <strong>${questions.length}</strong>!
      </div>
      <a href="index.html" class="btn btn-secondary mt-2">Back to Manuals</a>
    `;

    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";

    saveQuizResult();
  }

  function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showScore();
    }
  }

  nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
      handleNextButton();
    } else {
      startQuiz();
    }
  });

  async function saveQuizResult() {
    try {
      const auth = window.firebaseAuth;
      const db = window.firebaseDb;
      const user = auth.currentUser;
      if (!user) return;

      const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

      await addDoc(collection(db, "users", user.uid, "quizHistory"), {
        manual: manual,
        score: score,
        totalQuestions: questions.length,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn("Skipping Firebase saving:", err.message);
    }
  }

  loadQuestions();
};
