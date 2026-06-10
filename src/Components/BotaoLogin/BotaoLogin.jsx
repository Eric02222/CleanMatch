import { useNavigate } from "react-router-dom";
import { HiLogin } from "react-icons/hi";

export function Botao_login() {
    const navigate = useNavigate();

    const irPgLogin = () => {
        navigate("/Login");
    };

    return (
        <button 
            onClick={irPgLogin} 
            className="flex items-center gap-2 px-3 sm:px-5 py-2.5 text-slate-700 font-black hover:text-brand-primary transition-colors cursor-pointer"
        >
            <HiLogin className="text-2xl" />
            <span className="hidden sm:inline">Login</span>
        </button>
    );
}

export default Botao_login;
