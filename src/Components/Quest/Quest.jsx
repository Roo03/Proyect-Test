import React, { useState, useEffect, useRef } from "react";
import "./quest.css";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const apiURL = "http://apiexamenes.somee.com/api/pregunta/random/1/10";

function Quest() {
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [puntuación, setPuntuación] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(15);
  const [areDisabled, setAreDisabled] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const answerElementsRef = useRef([]);
  const startTimeRef = useRef(null);

  useEffect(() => {
    fetchQuestions();
    startTimeRef.current = performance.now();
    const timeout = setTimeout(() => {
      handleTick();
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (tiempoRestante <= 0) {
      handleTimeUp();
    }
  }, [tiempoRestante]);

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
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
    }
  }

  function handleTick() {
    const currentTime = performance.now();
    const elapsedTime = Math.floor((currentTime - startTimeRef.current) / 1000);
    setTiempoRestante((prevTiempoRestante) => {
      const newTiempoRestante = prevTiempoRestante - elapsedTime;
      return newTiempoRestante >= 0 ? newTiempoRestante : 0;
    });
    startTimeRef.current = currentTime;
    const timeout = setTimeout(() => {
      handleTick();
    }, 1000);
    return () => clearTimeout(timeout);
  }

  function handleAnswerSubmit(isCorrect, index) {
    if (isCorrect) {
      setPuntuación((puntuación) => puntuación + 1);
    } else {
      setShowCorrectAnswer(true);
    }
    setAreDisabled(true);

    // Aplicar clase correct si la respuesta es correcta
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

    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  }

  function handleNextQuestion() {
    if (preguntaActual === preguntas.length - 1) {
      setIsFinished(true);
    } else {
      setPreguntaActual((prev) => prev + 1);
      setTiempoRestante(15);
      setAreDisabled(false);
      setShowCorrectAnswer(false);

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
    setIsFinished(false); // No establecer isFinished automáticamente
    setShowCorrectAnswer(false);
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
                      {respuesta.texto}
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
            {tiempoRestante <= 0 && (
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
