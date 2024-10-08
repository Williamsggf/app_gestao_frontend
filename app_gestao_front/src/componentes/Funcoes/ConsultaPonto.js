import axios from "axios";
import { calcularDiferencaHoras } from "./utils"; // Ajuste o caminho de acordo com a localização do utils

export const consultaPonto = async (idUsuario, dataConsulta, setUltimatp_reg, setConsulta, setResumoHoras, setLoading, setError) => {
  const consultapt = { userId: idUsuario, data: dataConsulta };
  setLoading(true);

  try {
    const response = await axios.post(
      "https://app-gestao-backend.vercel.app/auth/CTPonto",
      consultapt
    );

    // Verifica se response.data e response.data.registros estão definidos
    if (!response.data || !Array.isArray(response.data.registros)) {
      throw new Error("Não há registros de ponto para esta data.");
    }

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

          // Somando corretamente as horas e minutos
          const [horasTurno1, minutosTurno1] = turno1.split('h').map((item) => parseInt(item.trim().replace('min', '')));
          const [horasTurno2, minutosTurno2] = turno2.split('h').map((item) => parseInt(item.trim().replace('min', '')));

          let totalHoras = horasTurno1 + horasTurno2;
          let totalMinutos = minutosTurno1 + minutosTurno2;

          // Se o total de minutos for maior que 60, converte em horas
          if (totalMinutos >= 60) {
            totalHoras += Math.floor(totalMinutos / 60);
            totalMinutos = totalMinutos % 60;
          }

          const horasTotais = `${totalHoras}h ${totalMinutos}min`;

          setResumoHoras(`Total de horas trabalhadas: ${horasTotais}\nIntervalo de almoço: ${intervaloAlmoco}`);
        } else {
          setResumoHoras("Faltam registros para calcular o total de horas.");
        }
      }
    }

    setConsulta(registrosConsultados);
  } catch (error) {
    setError(`${error.message}`);
  } finally {
    setLoading(false);
  }
};
