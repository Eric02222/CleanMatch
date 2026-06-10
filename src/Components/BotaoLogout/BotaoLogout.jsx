import { useAuth } from "../../contexts/AuthContext";
import { HiLogout } from "react-icons/hi";

export function Botao_logout() {
    const { logout } = useAuth();

    return (
        <button 
            onClick={logout} 
            className="btn-warning !h-11 !px-6 shadow-orange-500/20 flex items-center gap-2"
        >
            <HiLogout className="text-xl" />
            <span>Sair</span>
        </button>
    );
}

export default Botao_logout;
