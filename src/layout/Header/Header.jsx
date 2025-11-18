import { Link } from "react-router-dom"
import Botao_logout from "../../Components/BotaoLogout/BotaoLogout.jsx"
import Botao_login from "../../Components/BotaoLogin/BotaoLogin.jsx"
import Botao_cadastro from "../../Components/BotaoCadastro/BotaoCadastro.jsx"
import { useState, useEffect } from 'react'
import { useAuth } from "../../contexts/AuthContext.jsx"
import axios from 'axios';
// import UserIcon from '../assets/icons/user-icon.svg';


export function Header() {
  const { user } = useAuth()
  const [fotoPerfil, setfotoPerfil] = useState(null)

  // const defaultAvatar = UserIcon;

  const fetchfotosPerfil = async () => {
    if (!user || !user.email) return;

    try {
      const response = await axios.get('http://localhost:4000/usuario', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const todasAsFotos = response.data.foto_perfil;
      const fotoDoUsuario = todasAsFotos.find(foto => foto.id === user.id);

      if (fotoDoUsuario) {
        setfotoPerfil(fotoDoUsuario);

      } else {
        setfotoPerfil(null);
      }

    } catch (error) {
      console.error('Erro ao buscar Foto:', error);
    }
  };

  useEffect(() => {
    fetchfotosPerfil();
  }, []);

  return (
    <div className="container_navbar">
      <main>
        <header className="navbar">
          <div>
            <Link to="/">Home</Link>
          </div>


          <div className="opcoes_perfil">
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
              <div className="container_perfil">
                <img className="inconePerfil"  alt="Avatar do Perfil" />
                {/* src={fotoPerfil ? fotoPerfil.foto : defaultAvatar}    src da img acima */}
                <Link to="/Perfil">Perfil</Link>
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

