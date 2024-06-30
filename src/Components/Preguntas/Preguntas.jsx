const apiURL = "http://apiexamenes.somee.com/api/pregunta/random/1/10";
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15; // Tiempo inicial del temporizador
const timerDuration = 15;
let timerRunning = false; // Indicador de si el temporizador está en funcionamiento

async function fetchQuestions() {
    try {
        const response = await fetch(apiURL);
        questions = await response.json();
        showQuestion();
        updateQuestionCount();
    } catch (error) {
        console.error("Error al obtener preguntas:", error);
    }
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

    const question = questions[currentQuestionIndex];
    const questionText = document.getElementById("questionText");
    const answersList = document.getElementById("answersList");
    const nextButton = document.getElementById("nextButton");
    const timerElement = document.getElementById("timerValue");
    const timerProgressBar = document.getElementById("timerProgressBar");

    questionText.textContent = question.texto;
    answersList.innerHTML = "";
    nextButton.classList.add("hidden");

    question.respuestas.forEach((respuesta) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.textContent = respuesta.texto;
        li.onclick = () => {
            if (timerRunning) {
                selectAnswer(respuesta, li);
            }
        };
        answersList.appendChild(li);
    });

    timerElement.textContent = timeLeft; // Mostrar tiempo restante actual
    timerProgressBar.style.width = "100%"; // Reiniciar la barra de progreso
    startTimer();
    updateQuestionCount(); // Actualizar el contador de preguntas
}

function selectAnswer(respuesta, li) {
    if (document.querySelector(".selected")) return;

    const nextButton = document.getElementById("nextButton");
    li.classList.add("selected");

    if (respuesta.esCorrecta) {
        li.classList.add("correct");
        li.innerHTML += ' <span>&#10004;</span>';
        score++;
    } else {
        li.classList.add("incorrect");
        li.innerHTML += ' <span>&#10008;</span>';
        const correctAnswer = questions[currentQuestionIndex].respuestas.find(r => r.esCorrecta);
        document.querySelectorAll(".list-group-item").forEach(item => {
            if (item.textContent === correctAnswer.texto) {
                item.classList.add("correct");
                item.innerHTML += ' <span>&#10004;</span>';
            }
        });
    }

    nextButton.classList.remove("hidden");
    stopTimer();
}

function startTimer() {
    timerRunning = true;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timerValue").textContent = timeLeft;
        const progressWidth = (timeLeft / timerDuration) * 100;
        document.getElementById("timerProgressBar").style.width = `${progressWidth}%`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            timerRunning = false; // Marcar que el temporizador ha terminado
            markUnanswered();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timerRunning = false; // Marcar que el temporizador ha terminado
}

function markUnanswered() {
    const nextButton = document.getElementById("nextButton");
    document.querySelectorAll(".list-group-item").forEach(item => {
        if (!item.classList.contains("selected")) {
            item.classList.add("incorrect");
            item.innerHTML += ' <span>&#10008;</span>';
        }
    });
    nextButton.classList.remove("hidden");
}

function nextQuestion() {
    currentQuestionIndex++;
    timeLeft = timerDuration; // Reiniciar el tiempo para la siguiente pregunta
    showQuestion();
}

function endQuiz() {
    const resultContainer = document.getElementById("resultContainer");
    const resultMessage = document.getElementById("resultMessage");
    const messages = [
        { min: 8, message: `¡Felicitaciones! 🎉, conseguiste ${score} de 10` },
        { min: 5, message: `¡Qué bien! 😎, conseguiste ${score} de 10` },
        { min: 1, message: `Hay que estudiar 😅, conseguiste ${score} de 10` },
        { min: 0, message: `Lo siento 😞, conseguiste ${score} de 10` }
    ];

    const finalMessage = messages.find(m => score >= m.min).message;
    resultMessage.textContent = finalMessage;
    resultContainer.classList.remove("hidden");
    document.getElementById("questionContainer").classList.add("hidden");
}

document.getElementById("startButton").onclick = function() {
    fetchQuestions();
    document.getElementById("startButtonContainer").classList.add("hidden");
    document.getElementById("questionContainer").classList.remove("hidden");
};

document.getElementById("nextButton").onclick = nextQuestion;

document.getElementById("repeatButton").onclick = function() {
    resetQuiz(); // Resetea el estado del examen
    fetchQuestions(); // Obtiene nuevas preguntas
};

document.getElementById("exitButton").onclick = function() {
    window.location.href = "index.html"; // Redirige al usuario a index.html
};

function resetQuiz() {
    questions = [];
    currentQuestionIndex = 0;
    score = 0;
    clearInterval(timer);
    timerRunning = false;
    timeLeft = timerDuration;
    document.getElementById("resultContainer").classList.add("hidden");
    document.getElementById("questionContainer").classList.remove("hidden");
}

function updateQuestionCount() {
    const questionCountElement = document.getElementById("questionCount");
    questionCountElement.textContent = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;
}
