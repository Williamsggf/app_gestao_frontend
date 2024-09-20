import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Recurses() {
    const [nome, setNome] = useState('');
    const [userId, setUserId] = useState(0);

    // Definindo os estados para os recursos
    const [ponto, setPonto] = useState(false);
    const [cadastro, setCadastro] = useState(false);
    const [relatorio, setRelatorio] = useState(false);
    const [indicadores, setIndicadores] = useState(false);

    useEffect(() => {
        const userIdFromStorage = Number(localStorage.getItem('userId'));
        const nomeFromStorage = localStorage.getItem('nome');
        const pontoFromStorage = Number(localStorage.getItem('ponto')) === 1;
        const cadastroFromStorage = Number(localStorage.getItem('cadastro')) === 1;
        const relatorioFromStorage = Number(localStorage.getItem('relatorio')) === 1;
        const indicadoresFromStorage = Number(localStorage.getItem('indicadores')) === 1;

        setUserId(userIdFromStorage);
        setNome(nomeFromStorage || '');  // Garantindo que nome seja inicializado corretamente
        setPonto(pontoFromStorage);
        setCadastro(cadastroFromStorage);
        setRelatorio(relatorioFromStorage);
        setIndicadores(indicadoresFromStorage);
    }, []);

    return (
        <div>
            <h2>Bem-vindo à página de recursos</h2>
            <p>Olá {nome}, o que gostaria de fazer?</p>
            <ul>
                {ponto && 
                        <Link to="/Registropt">
                            <button className="btn-app">Registrar Ponto</button>
                        </Link>
                }
                {cadastro && 
                    <Link to="/Cadastro">
                            <button className="btn-app">Cadastrar Usuário</button>
                    </Link>
                    }
                {relatorio && 
                        <Link to="/Relatorios">
                            <button className="btn-app">Gerar Relatórios</button>
                        </Link>
                }
                {indicadores && 
                        <Link to="/Indicadores">
                            <button className="btn-app">Verificar Indicadores</button>
                        </Link>

                }
            </ul>
        </div>
    );
}

export default Recurses;
