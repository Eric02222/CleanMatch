import { useNavigate } from 'react-router-dom';

function Botao_cadastro() {
  const navigate = useNavigate()
  
      const irPgCadastro = () => {
          navigate("/Cadastro")
  
      };
  
      return (
          <div onClick={irPgCadastro} className='bnt_cadastro'>Cadastro</div>
      )
}

export default Botao_cadastro