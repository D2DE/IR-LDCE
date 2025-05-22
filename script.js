// Manual code to full name mapping
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

// Get manual code from URL parameter (e.g., ?manual=irwm)
const urlParams = new URLSearchParams(window.location.search);
const manual = urlParams.get('manual');

// Build the JSON file URL (hosted on GitHub Pages)
const jsonFile = manual
    ? `https://d2de.github.io/IR-LDCE/${manual}-questions.json`
    : null;

let questions = [];
let questionElement, answerButtons, nextButton, headingElement;
let currentQuestionIndex = 0;
let score = 0;

// Wait for DOM and authentication before running quiz logic
document.addEventListener('DOMContentLoaded', function() {
    // Only run if quiz content is visible (i.e., user is authenticated)
    if (!document.querySelector('.app') || document.querySelector('.app').style.display === 'none') return;

    questionElement = document.getElementById("question");
    answerButtons = document.getElementById("answer-buttons");
    nextButton = document.getElementById("next-btn");
    headingElement = document.querySelector('.app h1');

    // Dynamically set the heading
    if (manual && manualNames[manual]) {
        headingElement.childNodes[0].textContent = manualNames[manual] + " Quiz ";
    } else {
        headingElement.childNodes[0].textContent = "Quiz ";
    }

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
        questionElement.innerHTML = `<strong>${questionNo}. ${currentQuestion.question}</strong>`;

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

    // Confirmation before leaving quiz
    const backBtn = document.getElementById('backToDashboardBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to leave this quiz and return to the dashboard?')) {
                window.location.href = 'dashboard.html';
            }
        });
    }
});
