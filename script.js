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

    // Create a bulleted list for answers
    const ul = document.createElement("ul");
    ul.className = "answer-list";
    currentQuestion.answers.forEach((answer, idx) => {
        const li = document.createElement("li");
        li.innerHTML = answer.text;
        li.dataset.correct = answer.correct;
        li.addEventListener("click", selectAnswer);
        ul.appendChild(li);
    });
    answerButtons.appendChild(ul);
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedLi = e.target;
    const ul = selectedLi.parentElement;
    const lis = ul.querySelectorAll("li");
    lis.forEach(li => {
        if (li.dataset.correct === "true") {
            li.classList.add("correct");
        } else {
            li.classList.add("incorrect");
        }
        li.classList.add("disabled");
        li.removeEventListener("click", selectAnswer);
    });
    if (selectedLi.dataset.correct === "true") {
        score++;
    }
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

// If you use dynamic question loading, call loadQuestions(); else call startQuiz();
startQuiz();
