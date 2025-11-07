import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'

function Login() {
    const { login, user } = useAuth()
    const [emailLogin, setEmailLogin] = useState('')
    const [senhaLogin, setSenhaLogin] = useState('')
    const navigate = useNavigate()


    useEffect(() => {
        if (user) {
            navigate('/DashBoard')
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const data = {
                email: emailLogin,
                senha: senhaLogin
            }

            const res = await axios.post(' http://localhost:3000/auth/login', data)
            const token = res.data.accessToken
            console.log(res)

            if (res.data.length === 0) {
                return toast.error('Usuario não encontrado', {
                    autoClose: 3000,
                    hideProgressBar: true,
                    pauseOnHover: false
                })
            }

            login(emailLogin, token)
            toast.success('Login realizado com sucesso!', {
                autoClose: 3000,
                hideProgressBar: true,
                pauseOnHover: false
            })
            navigate('/')
            // setTimeout(() => , 2000)

        }
        catch (error) {
            console.log('Erro ao de conexão:', error);
            toast.error('Erro ao conectar ao servidor', {
                autoClose: 3000,
                hideProgressBar: true,
                pauseOnHover: false
            })
        }


    }

}

return (
    <div>
        <form onSubmit={handleLogin} >

            <div>
                <h1 className='titulo_login'>Login</h1>
            </div>

            <div className='container_conteudos_login'>

                <div className='inputs-login'>
                    <label htmlFor="input-emailLo" className='label-emailLo'>Email</label>
                    <input type="text" className='input-emailLo' value={emailLogin} required onChange={(event) => setEmailLogin(event.target.value)} />

                    <label htmlFor="input-senhaLo" className='label-senhaLo'>Senha</label>
                    <input type="password" className='input-senhaLo' value={senhaLogin} required onChange={(event) => setSenhaLogin(event.target.value)} />
                </div>

                <div className='irPg_cadastro'>
                    <label onClick={() => navigate('/Cadastro')}>Não tem uma conta?</label>
                </div>

                <div className='container_bnt_login'>

                    <button className='botao-login' type="submit" >Logar</button>
                </div>


            </div>


        </form>
    </div>

)

export default Login