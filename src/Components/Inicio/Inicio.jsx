import React from 'react';
import { Link } from 'react-router-dom';
import "./inicio.css";

function Inicio() {
  return (
    <main className="Container">
      <div className="Left">
        <div className="Inicio">
          <h1 className="Titulo">
            Bienvenido al examen
          </h1>
          <span className="Subtitulo">
            A continuación, explora preguntas acerca de los videojuegos y prueba qué tanto sabes de ellos y su cultura en general
          </span>
          <Link to="/Quest">
            <button className='Iniciar'>Continuar</button>
          </Link>
        </div>
      </div>

    </main>
  );
}

export default Inicio;
