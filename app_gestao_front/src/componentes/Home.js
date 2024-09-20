import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Meu Ponto</h1>
      <h3>Seu sistema de ponto</h3>
      <div className="buttons-container">
        <Link to="/login">
          <button className="btn-app">Login</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
