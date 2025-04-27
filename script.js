// Get manual code from URL parameter (e.g., ?manual=irwm)
const urlParams = new URLSearchParams(window.location.search);
const manual = urlParams.get('manual');

// Build the JSON file URL (hosted on GitHub Pages)
const jsonFile = manual
    ? `https://d2de.github.io/IR-LDCE/${manual}-questions.json`
    : null;

let questions = [];
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
let currentQuestionIndex = 0;
let score = 0;

// Fetch questions from JSON file
async function loadQuestions() {
    if (!jsonFile) {
        questionElement.innerHTML = "No manual selected.<br><a href='index.html'>Go back</a>";
        nextButton.style.display = "none";
        return;
    }
    try {
        const response = await fetch(jsonFile);
        if (!response.ok) throw new Error('Could not load questions');
        questions = await response.json();
        startQuiz();
    } catch (error) {
        questionElement.innerHTML = "Failed to load questions. Please try again later.<br><a href='index.html'>Go back</a>";
        nextButton.style.display = "none";
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
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answerButtons.appendChild(button);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!<br><a href="index.html">Back to Manuals</a>`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
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

// Start the quiz by loading questions from JSON
loadQuestions();
