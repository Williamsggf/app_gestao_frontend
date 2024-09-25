import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { consultaPonto } from "../Funcoes/ConsultaPonto";

function RelDia() {
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [consulta, setConsulta] = useState([]);
  const [resumoHoras, setResumoHoras] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [nome, setNome] = useState(null);
  const [ultimatp_reg, setUltimatp_reg] = useState(0);
  const [date, setDate] = useState("");

  const getDataSelecionada = () => {
    const data = new Date(startDate);
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    const nomeFromStorage = localStorage.getItem("nome");

    if (userIdFromStorage) setUserId(userIdFromStorage);
    if (nomeFromStorage) setNome(nomeFromStorage);
    
    setDate(getDataSelecionada());
  }, [startDate]);

  const handleConsultaPonto = async () => {
    setLoading(true);
    setError("");
    try {
      await consultaPonto(
        userId,
        setUltimatp_reg, // Adicione este parâmetro
        setConsulta,
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
          onChange={(date) => setStartDate(date)}
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
        {consulta.length > 0 ? (
          consulta.map((registro, index) => (
            <p className='btn-app' key={index}>
              {registro.forma === 1 && <span> Registro Automático</span>} -
              {registro.tp_reg === 1 && <span> Entrada </span>}
              {registro.tp_reg === 2 && <span> Saida Almoço </span>}
              {registro.tp_reg === 3 && <span> Volta Almoço </span>}
              {registro.tp_reg === 4 && <span> Saida </span>}
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
