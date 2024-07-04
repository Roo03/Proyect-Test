import React from 'react';
import { Link } from 'react-router-dom';
import "./inicio.css";
import { Button, Typography } from '@mui/material';

function Inicio() {
  return (
    <main className="Container">
      <div className="Left">
        <div className="Inicio">
          <h1 className="Titulo">
            Bienvenido al examen
          </h1>
          <Typography className="Subtitulo">
            A continuación, explora preguntas acerca de los videojuegos y prueba qué tanto sabes de ellos y su cultura en general
          </Typography>
          <Link to="/Quest">
            <Button className='Iniciar'>Continuar</Button>
          </Link>
        </div>
      </div>

    </main>
  );
}

export default Inicio;
