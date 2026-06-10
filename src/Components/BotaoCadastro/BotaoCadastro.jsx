import { useNavigate } from "react-router-dom";
import { HiUserAdd } from "react-icons/hi";

export function Botao_cadastro() {
    const navigate = useNavigate();

    const irPgCadastro = () => {
        navigate("/Cadastro");
    };

    return (
        <button 
            onClick={irPgCadastro} 
            className="btn-primary !h-11 px-4 sm:!px-6 !rounded-xl !text-sm shadow-brand-primary/20 flex items-center gap-2"
        >
            <HiUserAdd className="text-2xl" />
            <span className="font-black hidden sm:inline">Cadastrar</span>
        </button>
    );
}

export default Botao_cadastro;
