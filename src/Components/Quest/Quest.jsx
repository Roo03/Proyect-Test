import React, { useState, useEffect, useRef } from "react";
import "./quest.css";
import { Link } from "react-router-dom";
import { CheckCircle, Cancel } from "@mui/icons-material";

const apiURL = "http://apiexamenes.somee.com/api/pregunta/random/1/10";

function Quest() {
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [puntuación, setPuntuación] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(15);
  const [areDisabled, setAreDisabled] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false); 
  const [selectedAnswer, setSelectedAnswer] = useState(null); 
  const answerElementsRef = useRef([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchQuestions();
    startTimer();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (tiempoRestante > 0 && !isFinished && !showNextButton) {
      startTimer();
    } else if (tiempoRestante <= 0) {
      handleTimeUp();
    }
  }, [tiempoRestante, isFinished, showNextButton]);

  const startTimer = () => {
    timeoutRef.current = setTimeout(() => {
      setTiempoRestante((prevTiempoRestante) => prevTiempoRestante - 1);
    }, 1000);
  };

  const pauseTimer = () => {
    clearTimeout(timeoutRef.current);
  };

  async function fetchQuestions() {
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      setPreguntas(data);
      setPreguntaActual(0);
      setPuntuación(0);
      setIsFinished(false);
      setTiempoRestante(15);
      setAreDisabled(false);
      setShowCorrectAnswer(false);
      setShowNextButton(false); 
      setSelectedAnswer(null); 
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
    }
  }

  function handleAnswerSubmit(isCorrect, index) {
    pauseTimer(); 
    
    if (isCorrect) {
      setPuntuación((puntuación) => puntuación + 1);
    } else {
      setShowCorrectAnswer(true);
    }
    setAreDisabled(true);
    setShowNextButton(true); // Mostrar el botón de siguiente pregunta
    setSelectedAnswer(index); // Establecer la respuesta seleccionada

    if (isCorrect) {
      answerElementsRef.current[index].classList.add("correct");
    } else {
      const correctAnswerIndex = preguntas[preguntaActual].respuestas.findIndex(
        (opcion) => opcion.esCorrecta
      );
      if (correctAnswerIndex !== -1) {
        answerElementsRef.current[correctAnswerIndex].classList.add("correct");
      }
    }
  }

  function handleNextQuestion() {
    if (preguntaActual === preguntas.length - 1) {
      setIsFinished(true);
      clearTimeout(timeoutRef.current);
    } else {
      setPreguntaActual((prev) => prev + 1);
      setTiempoRestante(15);
      setAreDisabled(false);
      setShowCorrectAnswer(false);
      setShowNextButton(false); 
      setSelectedAnswer(null); 
      answerElementsRef.current.forEach((respuesta) =>
        respuesta.classList.remove("correct", "incorrect")
      );
    }
  }

  function getFinalMessage() {
    if (puntuación >= 8) {
      return `¡Felicidades!🎉, Conseguiste ${puntuación}`;
    } else if (puntuación >= 5 && puntuación <= 7) {
      return `¡Qué bien!😎, Conseguiste ${puntuación}`;
    } else if (puntuación >= 1 && puntuación <= 4) {
      return `Hay que estudiar😅, conseguiste ${puntuación}`;
    } else {
      return `Lo siento😞, tu puntuación es de ${puntuación}`;
    }
  }

  function handleReset() {
    fetchQuestions();
  }

  function handleTimeUp() {
    setAreDisabled(true);
    setShowNextButton(true); 
  }

  return (
    <div className="overlay">
      <main className="preguntas">
        {preguntas.length > 0 && !isFinished ? (
          <>
            <div className="pregunta-container">
              <div className="pregunta-numero">
                <span>
                  Pregunta {preguntaActual + 1} de {preguntas.length}
                </span>
              </div>
              <div className="pregunta-titulo">
                {preguntas[preguntaActual]?.texto}
              </div>
              <div className="respuestas">
                {preguntas[preguntaActual]?.respuestas.map(
                  (respuesta, index) => (
                    <button
                      key={index}
                      ref={(element) =>
                        (answerElementsRef.current[index] = element)
                      }
                      className={`respuesta ${
                        showCorrectAnswer && respuesta.esCorrecta
                          ? "correct"
                          : ""
                      } ${
                        showCorrectAnswer && !respuesta.esCorrecta
                          ? "incorrect"
                          : ""
                      }`}
                      onClick={() =>
                        handleAnswerSubmit(respuesta.esCorrecta, index)
                      }
                      disabled={areDisabled}
                    >
                      <span className="respuesta-texto">{respuesta.texto}</span>
                      {selectedAnswer === index && respuesta.esCorrecta && (
                        <CheckCircle className="respuesta-icon" style={{ color: "green" }} />
                      )}
                      {selectedAnswer === index && !respuesta.esCorrecta && (
                        <Cancel className="respuesta-icon" style={{ color: "red" }} />
                      )}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${(tiempoRestante / 15) * 100}%` }}
              >
                {tiempoRestante}
              </div>
            </div>
            {showNextButton && (
              <div className="next-question-container">
                <button
                  className="next-question-btn"
                  onClick={handleNextQuestion}
                >
                  Siguiente pregunta
                </button>
              </div>
            )}
          </>
        ) : (
          isFinished && (
            <div className="juego-terminado">
              <span className="mensajeF">{getFinalMessage()}</span>
              <button className="volver-jugar-btn" onClick={handleReset}>
                Volver a jugar
              </button>
              <Link to="/">
                <button className="volver-jugar-btn">Volver al inicio</button>
              </Link>
            </div>
          )
        )}
      </main>
    </div>
  );
}

export default Quest;
