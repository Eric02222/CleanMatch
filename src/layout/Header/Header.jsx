import { Link } from "react-router-dom"
import Botao_logout from "../../Components/BotaoLogout/BotaoLogout.jsx"
import Botao_login from "../../Components/BotaoLogin/BotaoLogin.jsx"
import Botao_cadastro from "../../Components/BotaoCadastro/BotaoCadastro.jsx"
import { useState, useEffect } from 'react'
import { useAuth } from "../../contexts/AuthContext.jsx"
import axios from 'axios';
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
                <img className="fotoUserdetalhes" src={fotoUsuario} onError={handleImageError} alt="Avatar do Perfil" />
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

