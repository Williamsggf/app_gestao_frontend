import React from 'react';
import { Link } from 'react-router-dom'; // Removi o Router

function Relatorios() {

    return (
        <>
            <div className="relatorios-form-wrap">
                <h2>Relatórios de pontos por:</h2>
            </div>
            <div>
                <Link to="/Relatorios/RelDia">
                    <button className="btn-grup">Diário</button>
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
