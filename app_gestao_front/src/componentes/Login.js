import React, { useState } from 'react';
import axios from 'axios';
import md5 from 'md5';
import { useNavigate } from 'react-router-dom';

function formatCPF(value) {
  const cpf = value.replace(/\D/g, '');
  if (cpf.length > 9) return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  if (cpf.length > 6) return cpf.replace(/^(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
  if (cpf.length > 3) return cpf.replace(/^(\d{3})(\d{3})/, '$1.$2');
  return cpf;
}

function Login() {
  const [cpf, setCPF] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const hashedPassword = md5(password);

    try {
      const response = await axios.post('https://app-gestao-backend.vercel.app/auth/login', {
        cpf,
        password: hashedPassword
      });

      const { id, nome, perfil, ponto, cadastro, relatorio, indicadores, escala } = response.data;
      localStorage.setItem('userId', id);
      localStorage.setItem('nome', nome);
      localStorage.setItem('perfil', perfil);
      localStorage.setItem('ponto', ponto);
      localStorage.setItem('cadastro', cadastro);
      localStorage.setItem('relatorio', relatorio );
      localStorage.setItem('indicadores', indicadores);
      localStorage.setItem('escala', 'escala');

      navigate('/recurses');

    } catch (error) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleCPFChange = (e) => {
    setCPF(formatCPF(e.target.value));
  };

  return (
    <div className="login-form-wrap">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          required
          value={cpf}
          onChange={handleCPFChange}
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? 'Carregando...' : 'Login'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
