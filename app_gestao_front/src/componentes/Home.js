import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
  <h1>Gestão WG Consultec</h1>
  <h3>Seu sistema de gestão:</h3>
  <ul>
    <li>🚩 Tempo</li>
    <li>🚩 Projetos</li>
    <li>🚩 Equipes</li>
  </ul>
      <div className="buttons-container">
        <Link to="/login">
          <button className="btn-app">Login</button>
        </Link>
        <Link to="/Cadastro">
          <button className="btn-app">Cadastro</button>
        </Link>
        <Link to="https://chat.whatsapp.com/FuqRdxuKRfO74TsaOAHhLG">
          <button className="btn-app">Grupo Sugestões e Melhorias</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
