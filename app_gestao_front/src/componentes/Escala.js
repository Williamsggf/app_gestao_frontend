import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Função para validar a possibilidade de criação da escala (validação com base em horas de trabalho e turnos)
function validarEscalaBasica(setor, numTurnos, numFuncionarios, duracaoTurno, interjornada, numFuncionariosPorTurno) {
    // Verifica se o nome do setor foi preenchido
    if (!setor || setor.trim() === '') {
        console.log('Erro: Nome do setor é obrigatório.');
        return false;
    }

    // Verifica se o número de turnos é válido
    if (numTurnos <= 0) {
        console.log('Erro: O número de turnos deve ser maior que zero.');
        return false;
    }

    // Verifica se a duração do turno é válida (entre 1 e 24 horas)
    if (duracaoTurno < 1 || duracaoTurno > 24) {
        console.log('Erro: A duração do turno deve estar entre 1 e 24 horas.');
        return false;
    }

    // Verifica se o intervalo entre jornadas é adequado (mínimo de 12 horas)
    if (interjornada < 12) {
        console.log('Erro: O intervalo entre jornadas deve ser de, no mínimo, 12 horas.');
        return false;
    }

    // Calcula a disponibilidade total de horas dos funcionários (funcionários * 24 horas)
    const horasDisponiveis = numFuncionarios * (24 - interjornada);

    // Calcula a quantidade total de horas necessárias para cobrir todos os turnos
    const horasNecessarias = numFuncionariosPorTurno.reduce((acc, numFuncTurno) => acc + (numFuncTurno * duracaoTurno), 0);

    // Verifica se as horas disponíveis são suficientes para cobrir as horas necessárias
    if (horasDisponiveis < horasNecessarias) {
        console.log(`Erro: Horas insuficientes. Horas Necessárias: ${horasNecessarias}, Horas Disponíveis: ${horasDisponiveis}.`);
        return false;
    }

    return true;
}


// Componente Escala
function Escala() {
    const [setor, setSetor] = useState('');
    const [numTurnos, setNumTurnos] = useState();
    const [numFuncionarios, setNumFuncionarios] = useState();
    const [duracaoTurno, setDuracaoTurno] = useState();
    const [interjornada, setInterJornada] = useState();
    const [diasOperacao, setDiasOperacao] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [numFuncionariosPorTurno, setNumFuncionariosPorTurno] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleValidarEscala = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validação básica dos dados de entrada
        const validacaoBasica = validarEscalaBasica(setor, numTurnos, numFuncionarios, duracaoTurno, interjornada, numFuncionariosPorTurno);

        if (!validacaoBasica) {
            setError('Erro na validação da escala. Veja o console para detalhes.');
            return;
        }

        setSuccess('Escala validada com sucesso! Deseja gerar o cronograma?');
    };

    const handleNumFuncionariosPorTurnoChange = (index, value) => {
        const newNumFuncionariosPorTurno = [...numFuncionariosPorTurno];
        newNumFuncionariosPorTurno[index] = parseInt(value, 10);
        setNumFuncionariosPorTurno(newNumFuncionariosPorTurno);
    };

    return (
        <>
            <div className='escala-form-wrap'>
                <h2>Validação de Escala</h2>
                <p>Vamos criar a escala de trabalho para sua empresa</p>
                <form onSubmit={handleValidarEscala}>
                    <input
                        type='text'
                        placeholder='Nome do Setor'
                        required
                        value={setor}
                        onChange={(e) => setSetor(e.target.value)}
                    />
                    <input
                        type='number'
                        placeholder='Número de Turnos'
                        min='1'
                        required
                        value={numTurnos}
                        onChange={(e) => setNumTurnos(parseInt(e.target.value))}
                    />
                    <input
                        type='number'
                        placeholder='Número de Funcionários'
                        min='1'
                        required
                        value={numFuncionarios}
                        onChange={(e) => setNumFuncionarios(parseInt(e.target.value))}
                    />
                    <input
                        type='number'
                        placeholder='Duração do Turno (em horas)'
                        min='1'
                        max='24'
                        required
                        value={duracaoTurno}
                        onChange={(e) => setDuracaoTurno(parseInt(e.target.value))}
                    />
                    <input
                        type='number'
                        placeholder='Intervalo entre jornadas (em horas)'
                        min='12'
                        required
                        value={interjornada}
                        onChange={(e) => setInterJornada(parseInt(e.target.value))}
                    />

                    <div>
                        <h3>Funcionários por Turno</h3>
                        {Array.from({ length: numTurnos }).map((_, index) => (
                            <div key={index}>
                                <input
                                    type='number'
                                    placeholder={`Número de Funcionários no Turno ${index + 1}`}
                                    min='1'
                                    value={numFuncionariosPorTurno[index] || ''}
                                    onChange={(e) => handleNumFuncionariosPorTurnoChange(index, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                    <button type='submit'>Validar Escala</button>
                    {error && <p className='error'>{error}</p>}
                    {success && <p className='success'>{success}</p>}
                </form>
            </div>
            <div>
                <Link to="https://chat.whatsapp.com/FuqRdxuKRfO74TsaOAHhLG">
                    <button className="btn-grup">Grupo Sugestões e Melhorias</button>
                </Link>
            </div>
        </>
    );
}

export default Escala;
