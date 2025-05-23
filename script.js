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

window.initQuiz = function() {
    // Get manual code from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const manual = urlParams.get('manual');

    // Build JSON URL
    const jsonFile = manual
        ? `https://d2de.github.io/IR-LDCE/${manual}-questions.json`
        : null;

    // Quiz variables
    let questions = [];
    const questionElement = document.getElementById("question");
    const answerButtons = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");
    const headingElement = document.querySelector('.app h1');
    let currentQuestionIndex = 0;
    let score = 0;

    // Set quiz heading
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

        // Clear previous answers and create a bulleted list
        answerButtons.innerHTML = "";
        const ul = document.createElement('ul');
        ul.style.listStyleType = 'disc';
        ul.style.paddingLeft = '24px';

        currentQuestion.answers.forEach(answer => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.innerHTML = answer.text;
            button.classList.add('btn');
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener('click', selectAnswer);
            li.appendChild(button);
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
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === "true";
        if (isCorrect) {
            selectedBtn.classList.add("correct");
            score++;
        } else {
            selectedBtn.classList.add("incorrect");
        }
        Array.from(answerButtons.querySelectorAll('button')).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            }
            button.disabled = true;
        });
        nextButton.style.display = "block";
    }

    // Save quiz result to Firestore
    async function saveQuizResult() {
        try {
            // Use the Firebase instances from the global window object
            const auth = window.firebaseAuth;
            const db = window.firebaseDb;
            const user = auth.currentUser;

            if (!user) {
                console.error('❌ No authenticated user found');
                return;
            }

            // Import addDoc and serverTimestamp
            const { collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

            await addDoc(collection(db, "users", user.uid, "quizHistory"), {
                manual: manual,
                score: score,
                totalQuestions: questions.length,
                timestamp: serverTimestamp()
            });

            console.log('✅ Quiz result saved for user:', user.uid);
        } catch (error) {
            console.error('❌ Error saving quiz result:', error);
        }
    }

    async function showScore() {
        resetState();
        questionElement.innerHTML = `You scored ${score} out of ${questions.length}!<br><a href="index.html">Back to Manuals</a>`;
        nextButton.innerHTML = "Play Again";
        nextButton.style.display = "block";

        // Save the quiz result to Firestore
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
};
