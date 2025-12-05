import { Link } from "react-router-dom"
import Botao_logout from "../../Components/BotaoLogout/BotaoLogout.jsx"
import Botao_login from "../../Components/BotaoLogin/BotaoLogin.jsx"
import Botao_cadastro from "../../Components/BotaoCadastro/BotaoCadastro.jsx"
import { useAuth } from "../../contexts/AuthContext.jsx"
import HomeIcon from "../../assets/icons/house.svg"
import UserIcon from '../../assets/icons/user-icon.svg';


export function Header() {
  const { user } = useAuth()
  const fotoUsuario = user?.foto_perfil || UserIcon;

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = UserIcon;
  };

  return (
    <div className="container_navbar">
      <main className="flex items-center justify-center fixed top-0 left-0 w-full bg-[#20c997] h-[60px] z-[1]">
        <header className="flex justify-between items-center text-white w-full max-w-[1850px] px-[20px]">
          <div>
            <Link to="/" className="flex gap-3">
              <img src={HomeIcon} />
              <label className="hover:cursor-pointer font-bold text-lg">Home</label>
            </Link>
          </div>


          <div className="flex items-center gap-[20px]">
            {user ? (
              <Botao_logout />

            ) :
              (
                <>
                  <Botao_login />
                  <Botao_cadastro />
                </>
              )}
            {user ? (
              <div className="flex items-center justify-center gap-[10px]">
                <Link to="/Perfil"  className="flex gap-3">
                  <img className="w-[4vh] rounded-full object-cover bg-gray-500 shadow-[0_0_10px_rgba(255,255,255,0.5)]" src={fotoUsuario} onError={handleImageError} alt="Avatar do Perfil" />
                  <label className="hover:cursor-pointer  text-lg">Perfil</label>
                </Link>

              </div>
            ) : (
              <label htmlFor=""></label>
            )}
          </div>
        </header>
      </main>


    </div>
  )
}

