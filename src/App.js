import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Quest from './Components/Quest/Quest';
import Inicio from './Components/Inicio/Inicio';

function App() {
  return (
    <Routes>
      <Route path='/Quest' element={<Quest />} />
      <Route path='/' element={<Inicio />} />
    </Routes>
  );
}


export default App;
