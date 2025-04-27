const questions = [
    // Your questions array remains the same
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
let currentQuestionIndex = 0;
let score = 0;

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
        const li = document.createElement("li");
        li.innerHTML = answer.text;
        if (answer.correct) {
            li.dataset.correct = answer.correct;
        }
        li.addEventListener("click", selectAnswer);
        answerButtons.appendChild(li);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedLi = e.target;
    const isCorrect = selectedLi.dataset.correct === "true";
    
    // Highlight all answers
    Array.from(answerButtons.children).forEach(li => {
        const isAnswerCorrect = li.dataset.correct === "true";
        li.classList.add(isAnswerCorrect ? "correct" : "incorrect");
        li.style.cursor = "not-allowed";
    });

    if (isCorrect) score++;
    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
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

startQuiz();
