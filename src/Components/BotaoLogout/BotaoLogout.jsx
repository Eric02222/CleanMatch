import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';




function bnt_Logout() {
    const {logout} = useAuth
   
    const navigate = useNavigate()

    const deslogar = () => {
            logout
            setUsuarioLogado(null)
            toast.success("Voce saiu de sua conta");
       
    };

    return (
        <div onClick={deslogar()} className='bnt_logout'>Logout</div>
    )
}


export default bnt_Logout;