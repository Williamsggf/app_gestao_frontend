import React, { useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

function RelDia() {
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [consulta, setConsulta] = useState([]);
  const [ultimatp_reg, setUltimatp_reg] = useState(null);
  const [error, setError] = useState("");

  // Função para pegar a data selecionada no formato YYYY-MM-DD
  const getDataSelecionada = () => {
    const data = new Date(startDate);
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
  };

  const consultaPonto = async (idUsuario) => {
    const consultapt = { userId: idUsuario, data: getDataSelecionada() };
    setLoading(true);

    try {
      const response = await axios.post(
        "https://app-gestao-backend.vercel.app/auth/CTPonto",
        consultapt
      );

      const registrosConsultados = response.data.registros.map((registro) => ({
        id: registro.id,
        dt_ponto: registro.dt_ponto,
        tp_reg: registro.tp_reg,
        forma: registro.forma,
        hora: registro.hora,
      }));

      if (registrosConsultados.length === 0) {
        setUltimatp_reg(1);
      } else {
        let maiortp_reg = 0;
        registrosConsultados.forEach((registro) => {
          if (registro.tp_reg >= maiortp_reg) {
            maiortp_reg = registro.tp_reg;
          }
        });
        setUltimatp_reg(maiortp_reg);
      }

      setConsulta(registrosConsultados);
    } catch (error) {
      setError("Não há pontos registrados para a data selecionada.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relatorios-form-wrap">
        <h2>Relatórios de Ponto Diários</h2>
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
        <button
          className="btn-consultar"
          onClick={() => consultaPonto(123)} // Aqui deve ser passado o idUsuario real
          disabled={loading}
        >
          {loading ? "Consultando..." : "Consultar Ponto"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div>
        <Link to="https://chat.whatsapp.com/FuqRdxuKRfO74TsaOAHhLG">
          <button className="btn-grup">Grupo Sugestões e Melhorias</button>
        </Link>
      </div>

      {consulta.length > 0 && (
        <div className="resultado-consulta">
          <h3>Registros Consultados:</h3>
          <ul>
            {consulta.map((registro) => (
              <li key={registro.id}>
                {registro.dt_ponto} - {registro.tp_reg} - {registro.hora} - {registro.forma}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default RelDia;
