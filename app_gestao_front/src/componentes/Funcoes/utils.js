export const getDataAtual = () => {
    const hoje = new Date();
    return hoje.toLocaleDateString();
};

export const getHoraAtual = () => {
    const hoje = new Date();
    return hoje.toLocaleTimeString(); // Retorna a hora atual no formato HH:mm:ss
};

export const calcularDiferencaHoras = (horaInicio, horaFim) => {
    const [h1, m1, s1] = horaInicio.split(":").map(Number);
    const [h2, m2, s2] = horaFim.split(":").map(Number);

    const inicio = new Date(0, 0, 0, h1, m1, s1);
    const fim = new Date(0, 0, 0, h2, m2, s2);
    const diferenca = (fim - inicio) / 1000; // Diferença em segundos

    const horas = Math.floor(diferenca / 3600);
    const minutos = Math.floor((diferenca % 3600) / 60);

    return `${horas}h ${minutos}min`;
};
