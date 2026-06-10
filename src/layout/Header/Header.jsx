import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext.jsx"
import { HiOutlineHome, HiLogin } from "react-icons/hi"
import UserIcon from '../../assets/icons/user-icon.svg';
import Botao_logout from "../../Components/BotaoLogout/BotaoLogout.jsx"
import Botao_login from "../../Components/BotaoLogin/BotaoLogin.jsx"
import Botao_cadastro from "../../Components/BotaoCadastro/BotaoCadastro.jsx"

export function Header() {
  const { user } = useAuth()
  const fotoUsuario = user?.foto_perfil || UserIcon;

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = UserIcon;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto glass-card rounded-2xl px-6 py-3 flex justify-between items-center border border-white/40">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-brand-primary/10 rounded-lg group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
            <HiOutlineHome className="text-2xl" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-800">
            Clean<span className="text-brand-primary">Match</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {!user ? (
            <div className="flex items-center gap-1 sm:gap-3">
              <Botao_login />
              <Botao_cadastro />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Botao_logout />
              <Link 
                to="/Perfil" 
                className="flex items-center gap-3 pl-3 border-l-2 border-slate-200 group"
              >
                <div className="flex flex-col items-end hidden md:flex">
                  <span className="text-sm font-black text-slate-900 leading-none">{user.nome.split(' ')[0]}</span>
                  <span className="text-[10px] text-brand-primary uppercase font-black tracking-widest">Meu Perfil</span>
                </div>
                <div className="relative">
                  <img 
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200 group-hover:ring-brand-primary transition-all shadow-md" 
                    src={fotoUsuario} 
                    onError={handleImageError} 
                    alt="Perfil" 
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-primary border-2 border-white rounded-full"></div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
