import { Link } from 'react-router-dom';

function Relatorios() {

    return (
        <>
            <div className="relatorios-form-wrap">
                <h2>Relatorios</h2>
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