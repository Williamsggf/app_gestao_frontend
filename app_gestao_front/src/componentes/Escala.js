import React, { useState } from 'react';

// Função para validar a possibilidade de criação da escala
function validarEscala(funcionarios, numFuncionariosPorTurno, prefFuncionario, turnos) {
    let funcionariosIndices = {};
    funcionarios.forEach((func, idx) => funcionariosIndices[func] = idx);

    for (let i = 0; i < turnos.length; i++) {
        let turno = turnos[i];
        let funcionariosPreferidos = prefFuncionario.filter(pref => pref === turno).length;
        let funcionariosSemPreferencia = funcionarios.filter((_, idx) => prefFuncionario[idx] === null).length;

        if (funcionariosPreferidos < numFuncionariosPorTurno[i]) {
            let funcionariosNecessarios = numFuncionariosPorTurno[i] - funcionariosPreferidos;
            if (funcionariosSemPreferencia < funcionariosNecessarios) {
                console.log(`Erro: Funcionários insuficientes para o turno ${turno}. Preferidos: ${funcionariosPreferidos}, Necessários: ${numFuncionariosPorTurno[i]}`);
                return false;
            }
        }
    }
    return true;
}

function Escala() {
    const [setor, setSetor] = useState('');
    const [numTurnos, setNumTurnos] = useState(1);
    const [numFuncionarios, setNumFuncionarios] = useState(1);
    const [duracaoTurno, setDuracaoTurno] = useState(8);
    const [diasOperacao, setDiasOperacao] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]); // Lista de funcionários
    const [prefFuncionario, setPrefFuncionario] = useState([]); // Preferências dos funcionários
    const [numFuncionariosPorTurno, setNumFuncionariosPorTurno] = useState([]); // Funcionários por turno
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleValidarEscala = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const erro = validarEscala(funcionarios, numFuncionariosPorTurno, prefFuncionario, diasOperacao);
        if (erro) {
            setError('Escala não pode ser criada. Veja o console para detalhes.');
        } else {
            setSuccess('Escala validada com sucesso!');
        }
    };

    const handleDiasChange = (e) => {
        const { value, checked } = e.target;
        setDiasOperacao((prev) => 
            checked ? [...prev, value] : prev.filter((dia) => dia !== value)
        );
    };

    return (
        <div className='escala-form-wrap'>
            <h2>Validação de Escala</h2>
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
                <div>
                    <label>
                        <input type='checkbox' value='segunda' onChange={handleDiasChange} />
                        Segunda
                    </label>
                    <label>
                        <input type='checkbox' value='terça' onChange={handleDiasChange} />
                        Terça
                    </label>
                    <label>
                        <input type='checkbox' value='quarta' onChange={handleDiasChange} />
                        Quarta
                    </label>
                    <label>
                        <input type='checkbox' value='quinta' onChange={handleDiasChange} />
                        Quinta
                    </label>
                    <label>
                        <input type='checkbox' value='sexta' onChange={handleDiasChange} />
                        Sexta
                    </label>
                    <label>
                        <input type='checkbox' value='sábado' onChange={handleDiasChange} />
                        Sábado
                    </label>
                    <label>
                        <input type='checkbox' value='domingo' onChange={handleDiasChange} />
                        Domingo
                    </label>
                </div>
                <button type='submit'>Validar Escala</button>
                {error && <p className='error'>{error}</p>}
                {success && <p className='success'>{success}</p>}
            </form>
        </div>
    );
}

export default Escala;
