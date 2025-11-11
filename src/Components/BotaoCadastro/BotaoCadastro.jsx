import { useNavigate } from 'react-router-dom';

function Botao_cadastro() {
  const navigate = useNavigate()
  
      const irPgCadastro = () => {
          navigate("/Cadastro")
  
      };
  
      return (
          <button onClick={irPgCadastro} className='bnt_cadastro'>Cadastro</button>
      )
}

export default Botao_cadastro