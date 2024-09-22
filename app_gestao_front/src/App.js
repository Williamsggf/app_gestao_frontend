import './App.css';
import Login from './componentes/Login';
import Cadastro from './componentes/Cadastro';
import Home from './componentes/Home';
import Recurses from './componentes/recurses';
import Registropt from './componentes/Registropt';
import Escala from './componentes/Escala';
import Indicadores from './componentes/Indicadores';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recurses" element={<Recurses />}/>
          <Route path="/registropt" element={<Registropt />}/>
          <Route path="/escala" element={<Escala />}/>
          <Route path="/indicadores" element={<Indicadores />}/>
        </Routes>
      </header>
    </div>
  );
}

export default App;
