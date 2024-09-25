import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { consultaPonto } from "../Funcoes/ConsultaPonto";

function RelDia() {
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [consulta, setConsulta] = useState([]); // Inicializa com array vazio
  const [resumoHoras, setResumoHoras] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [nome, setNome] = useState(null);
  const [ultimatp_reg, setUltimatp_reg] = useState(0);
  const [date, setDate] = useState("");

  // Função que formata a data no formato "YYYY-MM-DD"
  const getDataSelecionada = (data = startDate) => {
    const novaData = new Date(data);
    return `${novaData.getFullYear()}-${String(novaData.getMonth() + 1).padStart(2, '0')}-${String(novaData.getDate()).padStart(2, '0')}`;
  };

  // Efeito para carregar o userId e o nome do localStorage
  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    const nomeFromStorage = localStorage.getItem("nome");

    if (userIdFromStorage) setUserId(userIdFromStorage);
    if (nomeFromStorage) setNome(nomeFromStorage);

    setDate(getDataSelecionada()); // Atualiza a data ao montar o componente
  }, [startDate]);

  const dataConsulta = getDataSelecionada();

  // Função que realiza a consulta de ponto
  const handleConsultaPonto = async () => {
    setLoading(true);
    setError("");
    try {
      await consultaPonto(
        userId,
        dataConsulta,
        setUltimatp_reg, // Parâmetro para atualizar o último tipo de registro
        (result) => setConsulta(result || []), // Garante que será um array, mesmo que vazio
        setResumoHoras,
        setLoading,
        setError
      );
    } catch (error) {
      setError(`Erro ao realizar a consulta: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relatorios-form-wrap">
        <h2>Relatórios de Ponto Diários</h2>
        {nome && <h3>Bem-vindo, {nome}!</h3>}
      </div>

      <div className="calendar">
        <label>Selecione a Data:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            setDate(getDataSelecionada(date)); // Atualiza a data informada diretamente
          }}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div>
        <button className="btn-consultar" onClick={handleConsultaPonto} disabled={loading}>
          {loading ? "Consultando..." : "Consultar Ponto"}
        </button>
      </div>

      <h3>Registros:</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {Array.isArray(consulta) && consulta.length > 0 ? (
          consulta.map((registro, index) => (
            <p className="btn-app" key={index}>
              {registro.forma === 1 && <span> Registro Automático</span>} -
              {registro.tp_reg === 1 && <span> Entrada </span>}
              {registro.tp_reg === 2 && <span> Saída Almoço </span>}
              {registro.tp_reg === 3 && <span> Volta Almoço </span>}
              {registro.tp_reg === 4 && <span> Saída </span>}
              Ás {registro.hora}
            </p>
          ))
        ) : (
          <p>Nenhum registro encontrado.</p>
        )}
      </ul>

      {resumoHoras && (
        <div className="resumo-horas">
          <h3>Resumo de Horas:</h3>
          <p>{resumoHoras}</p>
        </div>
      )}

      <div>
        <Link to="https://chat.whatsapp.com/FuqRdxuKRfO74TsaOAHhLG">
          <button className="btn-grup">Grupo Sugestões e Melhorias</button>
        </Link>
      </div>
    </>
  );
}

export default RelDia;
