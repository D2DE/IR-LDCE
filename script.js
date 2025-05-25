const manualNames = {
    irwm: "Indian Railway Works Manual",
    irpwm: "Indian Railway P-way Manual",
    irdim: "Indian Railway Schedule of Dimensions",
    irec: "Indian Railway Engineering Code",
    stm: "Small Track Machine Manual",
    usfd: "USFD Manual",
    fbwm: "FBW Manual",
    store: "Store Manual",
    account: "Account Manual"
};

window.initQuiz = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const manual = urlParams.get('manual');
    const jsonFile = manual ? `https://d2de.github.io/IR-LDCE/${manual}-questions.json` : null;

    let questions = [];
    const questionElement = document.getElementById("question");
    const answerButtons = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");
    const headingElement = document.querySelector('.app h1');
    const timerElement = document.getElementById("timer");

    let currentQuestionIndex = 0;
    let score = 0;
    let countdown;
    const timePerQuestion = 30; // seconds

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

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        nextButton.innerHTML = "Next";
        showQuestion();
    }

    function showQuestion() {
        resetState();
        startTimer();

        const currentQuestion = questions[currentQuestionIndex];
        const questionNo = currentQuestionIndex + 1;
        let html = `<strong>${questionNo}. ${currentQuestion.question}</strong>`;
        if (currentQuestion.image) {
            html += `<div><img src="${currentQuestion.image}" alt="question image" class="img-fluid my-2" style="max-height:200px;"></div>`;
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
        clearInterval(countdown);
        nextButton.style.display = "none";
        answerButtons.innerHTML = "";
        timerElement.textContent = `⏱️ ${timePerQuestion}s`;
    }

    function selectAnswer(e) {
        clearInterval(countdown);
        const selectedBtn = e.target.closest("button");
        const isCorrect = selectedBtn.dataset.correct === "true";

        selectedBtn.classList.remove("btn-outline-primary");
        selectedBtn.classList.add(isCorrect ? "btn-success" : "btn-danger");
        if (isCorrect) score++;

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

    function autoSelectOnTimeout() {
        const correctButton = answerButtons.querySelector("button[data-correct='true']");
        if (correctButton) {
            correctButton.classList.remove("btn-outline-primary");
            correctButton.classList.add("btn-success");
        }

        const allButtons = answerButtons.querySelectorAll("button");
        allButtons.forEach(button => {
            if (button !== correctButton) button.classList.add("btn-secondary");
            button.disabled = true;
        });

        nextButton.style.display = "block";
    }

    function startTimer() {
        let timeLeft = timePerQuestion;
        timerElement.textContent = `⏱️ ${timeLeft}s`;
        countdown = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `⏱️ ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                autoSelectOnTimeout();
            }
        }, 1000);
    }

    async function showScore() {
        resetState();
        questionElement.innerHTML = `
            <div class="alert alert-info" role="alert">
                You scored <strong>${score}</strong> out of <strong>${questions.length}</strong>!
            </div>
            <a href="index.html" class="btn btn-secondary mt-2">Back to Manuals</a>
        `;
        nextButton.innerHTML = "Play Again";
        nextButton.style.display = "block";

        await saveQuizResult();
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

            const { collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

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
