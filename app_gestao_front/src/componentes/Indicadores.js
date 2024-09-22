import { Link } from 'react-router-dom';

function Indicadores() {
  return (
    <>
      <div className="indicadores-form-wrap">
        <h2>Indicadores</h2>
      </div>
      <div>
        <Link to="https://chat.whatsapp.com/FuqRdxuKRfO74TsaOAHhLG">
          <button className="btn-grup">Grupo Sugestões e Melhorias</button>
        </Link>
      </div>
    </>
  );
}

export default Indicadores;
