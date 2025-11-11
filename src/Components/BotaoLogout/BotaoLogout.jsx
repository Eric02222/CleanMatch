import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';


function bnt_Logout() {
    const { logout } = useAuth

    const deslogar = () => {

        logout
        toast.success("Voce saiu de sua conta" , {
                autoClose: 3000,
                hideProgressBar: true,
                pauseOnHover: false
            })

    };

    return (
        <button onClick={deslogar()} className='bnt_logout'>Logout</button>
    )
}


export default bnt_Logout;