import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>App Gestçao WG Consultec</h1>
      <h3>Seu sistema de gestão de RH</h3>
      <div className="buttons-container">
        <Link to="/login">
          <button className="btn-app">Login</button>
        </Link>
        <Link to="/Cadastro">
          <button className="btn-app">Cadastro</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
