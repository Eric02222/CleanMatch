import { useAuth } from '../../contexts/AuthContext';


function bnt_Logout() {
    const { logout } = useAuth()

    return (
        <button onClick={logout} className="flex items-center justify-center rounded-[3px] bg-[#b41919] text-white h-[35px] w-[100px] font-bold text-[1em] cursor-pointer transition duration-400 hover:bg-white hover:text-[#b41919] hover:border hover:border-[#b41919]">Logout</button>
    )
}


export default bnt_Logout;