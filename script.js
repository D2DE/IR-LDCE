// Get URL parameters to determine which manual's quiz to load
const urlParams = new URLSearchParams(window.location.search);
const manual = urlParams.get('manual');
const jsonFile = `${manual}-questions.json`;

// Quiz state variables
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// DOM elements
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');

// Fetch questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch(jsonFile);
        if (!response.ok) throw new Error('Failed to load questions');
        questions = await response.json();
        startQuiz();
    } catch (error) {
        console.error('Error loading questions:', error);
        questionElement.innerHTML = 'Failed to load questions. Please try again later.';
        nextButton.style.display = 'none';
    }
}

// Existing quiz logic with JSON integration
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
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Try Again";
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

// Event listeners
nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        window.location.href = "index.html"; // Return to manual selection
    }
});

// Initialize quiz
if (manual) {
    loadQuestions();
} else {
    window.location.href = "index.html"; // Redirect if no manual specified
}
