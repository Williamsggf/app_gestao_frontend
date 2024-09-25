import axios from "axios";
import { calcularDiferencaHoras } from "./utils"; // Ajuste o caminho de acordo com a localização do utils

export const consultaPonto = async (idUsuario, dataConsulta ,setUltimatp_reg, setConsulta, setResumoHoras, setLoading, setError) => {
  const consultapt = { userId: idUsuario, data: dataConsulta };
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

      if (maiortp_reg === 4) {
        const horaEntrada = registrosConsultados.find((r) => r.tp_reg === 1)?.hora;
        const horaSaida = registrosConsultados.find((r) => r.tp_reg === 4)?.hora;
        const horaSaidaAlmoco = registrosConsultados.find((r) => r.tp_reg === 2)?.hora;
        const horaVoltaAlmoco = registrosConsultados.find((r) => r.tp_reg === 3)?.hora;

        if (horaEntrada && horaSaida && horaSaidaAlmoco && horaVoltaAlmoco) {
          const turno1 = calcularDiferencaHoras(horaEntrada, horaSaidaAlmoco);
          const turno2 = calcularDiferencaHoras(horaVoltaAlmoco, horaSaida);
          const intervaloAlmoco = calcularDiferencaHoras(horaSaidaAlmoco, horaVoltaAlmoco);

          const horasTotais = `${parseInt(turno1.split('h')[0]) + parseInt(turno2.split('h')[0])}h ${parseInt(turno1.split('h')[1]) + parseInt(turno2.split('h')[1])}min`;

          setResumoHoras(`Total de horas trabalhadas: ${horasTotais}\nIntervalo de almoço: ${intervaloAlmoco}`);
        } else {
          setResumoHoras("Faltam registros para calcular o total de horas.");
        }
      }
    }

    setConsulta(registrosConsultados);
  } catch (error) {
    setError(`Erro ao consultar o ponto: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
