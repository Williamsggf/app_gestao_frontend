import React from 'react';
import RelDia from './CompRelatorios/RelDia';
import { Link, Router } from 'react-router-dom';

function Relatorios() {

    return (
        <>
        <Router>
            <RelDia />
        </Router>
            <div className="relatorios-form-wrap">
                <h2>Relatorios de pontos por:</h2>
            </div>
            <div>
                <Link to="./CompRelatorios/RelDia">
                    <button className="btn-grup">Diario</button>
                </Link>
            </div>
            <div>
                <Link to="https://chat.whatsapp.com/FuqRdxuKRfO74TsaOAHhLG">
                    <button className="btn-grup">Grupo Sugestões e Melhorias</button>
                </Link>
            </div>
        </>
    );
}

export default Relatorios;