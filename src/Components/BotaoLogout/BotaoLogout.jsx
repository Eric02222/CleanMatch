import { useAuth } from '../../contexts/AuthContext';


function bnt_Logout() {
    const { logout } = useAuth()

    return (
        <button onClick={logout} className='bnt_logout'>Logout</button>
    )
}


export default bnt_Logout;