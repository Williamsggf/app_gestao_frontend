import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  // Estados para armazenar as contagens e os valores animados
  const [dadosFinais, setDadosFinais] = useState({
    usuarios: 0,
    pontos: 0,
    projetos: 0,
    atividades: 0,
  });

  const [dadosAtuais, setDadosAtuais] = useState({
    usuarios: 0,
    pontos: 0,
    projetos: 0,
    atividades: 0,
  });

  // Função para buscar os dados da API
  useEffect(() => {
    const fetchDados = async () => {
      try {
        // Exemplo de requisição para buscar as contagens (substitua pela sua API)
        const response = await axios.get('https://app-gestao-backend.vercel.app/auth/RGDados');
        const { usuarios, pontos, projetos, atividades } = response.data;
        
        // Armazena os números finais retornados pela API
        setDadosFinais({ usuarios, pontos, projetos, atividades });
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    };

    fetchDados();
  }, []);

  // Função para realizar a contagem gradual
  useEffect(() => {
    const intervalo = setInterval(() => {
      setDadosAtuais(prevDados => {
        const novosDados = { ...prevDados };
        
        // Incrementa gradualmente cada valor até o número final
        if (novosDados.usuarios < dadosFinais.usuarios) {
          novosDados.usuarios += 1;
        }
        if (novosDados.pontos < dadosFinais.pontos) {
          novosDados.pontos += 1;
        }
        if (novosDados.projetos < dadosFinais.projetos) {
          novosDados.projetos += 1;
        }
        if (novosDados.atividades < dadosFinais.atividades) {
          novosDados.atividades += 1;
        }

        // Se todos os valores atingiram seus números finais, para a contagem
        if (
          novosDados.usuarios >= dadosFinais.usuarios &&
          novosDados.pontos >= dadosFinais.pontos &&
          novosDados.projetos >= dadosFinais.projetos &&
          novosDados.atividades >= dadosFinais.atividades
        ) {
          clearInterval(intervalo);
        }

        return novosDados;
      });
    }, 50); // Incrementa a cada 50ms para um efeito mais fluido

    return () => clearInterval(intervalo);
  }, [dadosFinais]);

  return (
    <div>
      <h1>Gestão WG Consultec</h1>
      <div>
        <h3>Seu sistema de gestão:</h3>
        <ul>
          <li>Tempo</li>
          <li>Projetos</li>
          <li>Equipes</li>
        </ul>
      </div>

      {/* Exibindo as contagens com efeito de contagem gradual */}
      <div>
        <h3>Estatísticas:</h3>
        <ul>
          <li>Número de usuários: {dadosAtuais.usuarios}</li>
          <li>Número de pontos registrados: {dadosAtuais.pontos}</li>
          <li>Número de projetos criados: {dadosAtuais.projetos}</li>
          <li>Número de atividades registradas: {dadosAtuais.atividades}</li>
        </ul>
      </div>

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
