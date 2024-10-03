import React, { useState } from "react";
import axios from "axios";
import md5 from "md5";
import { useNavigate } from "react-router-dom"; // Importa o useNavigate

function formatCPF(value) {
  value = value.replace(/\D/g, "");

  if (value.length > 9) {
    value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  } else if (value.length > 6) {
    value = value.replace(/^(\d{3})(\d{3})(\d{3})/, "$1.$2.$3");
  } else if (value.length > 3) {
    value = value.replace(/^(\d{3})(\d{3})/, "$1.$2");
  }

  return value;
}

function formatCelular(value) {
  value = value.replace(/\D/g, "");

  if (value.length > 4) {
    value = value.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (value.length > 3) {
    value = value.replace(/^(\d{2})(\d{5})/, "($1) $2");
  }

  return value;
}

// Função para validar CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

function Cadastro() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [cpf, setCPF] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfir, setPasswordConfir] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;

    // Expressão regular básica para validar o formato de e-mail
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    setEmail(value);

    // Validação do e-mail
    if (!emailPattern.test(value)) {
      setErrorMessage("Por favor, insira um e-mail válido.");
    } else {
      setErrorMessage(""); // Limpa a mensagem de erro se o e-mail for válido
    }
  };

  const navigate = useNavigate(); // Hook de navegação

  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validarCPF(cpf)) {
      setError("CPF inválido.");
      setLoading(false);
      return;
    }

    if (password !== passwordConfir) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    const hashedPassword = md5(password);

    try {
      const response = await axios.post(
        "https://app-gestao-backend.vercel.app/auth/Cadastro",
        {
          nome,
          sobrenome,
          password: hashedPassword,
          email,
          cpf,
          celular,
        }
      );

      console.log("Cadastro realizado com sucesso");
      const { id } = response.data;
      setUserId(id);

      navigate("/login"); // Corrige o caminho de navegação
    } catch (error) {
      console.error("Erro ao fazer cadastro:", error);
      setError(
        error.response?.data?.error ||
        "Erro ao fazer cadastro. Verifique suas informações."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCPFChange = (e) => {
    const formattedCPF = formatCPF(e.target.value);
    setCPF(formattedCPF);
  };

  const handleCelularChange = (e) => {
    const formattedCelular = formatCelular(e.target.value);
    setCelular(formattedCelular);
  };

  return (
    <div className="login-form-wrap">
      <h2>Cadastro</h2>
      <form className="login-form" onSubmit={handleCadastro}>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={25}
        />
        <input
          type="text"
          name="sobrenome"
          placeholder="Sobrenome"
          required
          value={sobrenome}
          onChange={(e) => setSobrenome(e.target.value)}
          maxLength={25}
        />
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          required
          value={cpf}
          onChange={handleCPFChange}
          maxLength={14}
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          required
          value={email}
          onChange={handleEmailChange}
          maxLength={30}
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <input
          type="text"
          name="celular"
          placeholder="Celular"
          required
          value={celular}
          onChange={handleCelularChange}
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          maxLength={20}
        />
        <input
          type="password"
          name="confirSenha"
          placeholder="Confirme a Senha"
          required
          value={passwordConfir}
          onChange={(e) => setPasswordConfir(e.target.value)}
          maxLength={20}
        />
        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "Carregando..." : "Cadastrar"}
        </button>
        {error && <p className="error">{error}</p>}
        {userId && <p>ID do usuário: {userId}</p>}
      </form>
    </div>
  );
}

export default Cadastro;
