import { useNavigate } from 'react-router-dom';

function Botao_cadastro() {
  const navigate = useNavigate()
  
      const irPgCadastro = () => {
          navigate("/Cadastro")
  
      };
  
      return (
          <button onClick={irPgCadastro} className="bg-[rgba(255,255,255,0.3)] border border-white text-black px-[15px] py-[8px] rounded-[5px] cursor-pointer text-[1em] font-bold transition-all duration-300 hover:bg-white hover:text-black hover:border-white">Cadastro</button>
      )
}

export default Botao_cadastro