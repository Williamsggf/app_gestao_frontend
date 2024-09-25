import React, { useState, useEffect } from "react";
import axios from "axios";
import { consultaPonto } from "./Funcoes/ConsultaPonto";
import { Link } from "react-router-dom"; // Certifique-se de que o react-router-dom esteja instalado
import { getHoraAtual, getDataAtual, calcularDiferencaHoras } from './Funcoes/utils';
 // Certifique-se de importar essas funções

function RegistroPonto() {
  const [hora, setHora] = useState(getHoraAtual());
  const [userId, setUserId] = useState(null);
  const [nome, setNome] = useState("");
  const [registros, setRegistros] = useState([]);
  const [ctponto, setConsulta] = useState([]);
  const [tpPonto, setTpPonto] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [publicIP, setPublicIP] = useState(null);
  const [ultimatp_reg, setUltimatp_reg] = useState(0);
  const [localIPv4, setLocalIPv4] = useState(null);
  const [resumoHoras, setResumoHoras] = useState("");

  useEffect(() => {
    const userIdFromStorage = Number(localStorage.getItem("userId"));
    const nomeFromStorage = localStorage.getItem("nome");
    setUserId(userIdFromStorage);
    setNome(nomeFromStorage);

    const dataConsulta = getDataAtual();
    

    if (userIdFromStorage) {
      consultaPonto(userIdFromStorage, dataConsulta, setUltimatp_reg, setConsulta, setResumoHoras, setLoading, setError);
    }
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocalização não é suportada por este navegador.");
    }
  };

  const showPosition = async (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    setLatitude(lat);
    setLongitude(lng);

    const ip = await getPublicIP();
    setPublicIP(ip);
  };

  const getPublicIP = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      const ip = response.data.ip;
      return ip;
    } catch (error) {
      console.error("Erro ao obter endereço IP público:", error);
      return null;
    }
  };

  const getLocalIPv4 = () => {
    try {
      const { RTCPeerConnection } = window;
      if (RTCPeerConnection) {
        const connection = new RTCPeerConnection({ iceServers: [] });
        connection.createDataChannel("");
        connection.onicecandidate = async (event) => {
          try {
            const candidate = event.candidate;
            if (candidate) {
              const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
              const match = ipRegex.exec(candidate.candidate);
              if (match && match.length >= 2) {
                const localIPv4 = match[1];
                setLocalIPv4(localIPv4);
                connection.close();
              }
            }
          } catch (error) {
            console.error("Erro ao obter IPv4 local:", error);
          }
        };
        connection
          .createOffer()
          .then((offer) => connection.setLocalDescription(offer));
      } else {
        console.log("RTCPeerConnection não suportado.");
      }
    } catch (error) {
      console.error("Erro ao tentar obter IPv4 local:", error);
    }
  };

  const registrarPonto = async () => {
    const nvtp_reg = ultimatp_reg + 1;
    const novoRegistro = { data: getDataAtual(), hora: getHoraAtual(), tipo: nvtp_reg };
    setRegistros([...registros, novoRegistro]);
    setTpPonto(!tpPonto);
    setLoading(true);
    try {
      const response = await axios.post('https://app-gestao-backend.vercel.app/auth/RGPonto', {
        userId: userId,
        data: getDataAtual(),
        tp_reg: nvtp_reg,
        forma: parseInt('1'),
        hora: getHoraAtual(),
        latitude: latitude,
        longitude: longitude,
        ip: publicIP,
        ipv4: localIPv4
      });

      const { tp_reg, hora, forma, status } = response.data;
      localStorage.setItem('tp_reg', tp_reg);
      localStorage.setItem('hora', hora);
      localStorage.setItem('forma', forma);
      localStorage.setItem('status', status);

    } catch (error) {
      setError('Erro ao registrar ponto');
    } finally {
      consultaPonto(userId, dataConsulta, setUltimatp_reg, setConsulta, setResumoHoras, setLoading, setError);
      consultaPonto(userId, dataConsulta, setUltimatp_reg, setConsulta, setResumoHoras, setLoading, setError);
      setLoading(false);
    }
  };

  const desBotao = ultimatp_reg === 0
    ? 'Entrada'
    : ultimatp_reg === 1
      ? 'Saída'
      : ultimatp_reg === 2
        ? 'Entrada'
        : 'Saída';

  const descricaoBotao = ultimatp_reg === 0 ? 'Entrada'
    : ultimatp_reg === 1 ? 'Saída'
      : ultimatp_reg === 2 ? 'Entrada'
        : 'Saída';

  return (
    <>
      <div>
        <h2>Registro de ponto</h2>
        <p>Nome: {nome}</p>
        <h3>Registros:</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
          {ctponto.map((registro, index) => (
            <p className='btn-app' key={index}>
              {registro.forma === 1 && <span> Registro Automático</span>} -
              {registro.tp_reg === 1 && <span> Entrada </span>}
              {registro.tp_reg === 2 && <span> Saida Almoço </span>}
              {registro.tp_reg === 3 && <span> Volta Almoço </span>}
              {registro.tp_reg === 4 && <span> Saida </span>}
              Ás {registro.hora}
            </p>
          ))}
        </ul>

        {/* Não renderizar o botão se já houver 4 registros */}
        {ultimatp_reg < 4 && (
          <button className={`btn-app-${desBotao.toLowerCase()}`} onClick={registrarPonto} disabled={loading}>
            {loading ? 'Registrando...' : `Registrar ${descricaoBotao} às ${hora}`}
          </button>
        )}
        {/* Exibir resumo após o quarto registro */}
        {ultimatp_reg === 4 && resumoHoras && (
          <div>
            <h4>Resumo:</h4>
            <p>{resumoHoras}</p>
          </div>
        )}
      </div>
      <div>
        <Link to="https://chat.whatsapp.com/FuqRdxuKRfO74TsaOAHhLG">
          <button className="btn-grup">Grupo Sugestões e Melhorias</button>
        </Link>
      </div>
    </>
  );
}

export default RegistroPonto;
