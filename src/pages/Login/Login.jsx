import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function Login() {
    const { login, user } = useAuth()
    const [emailLogin, setEmailLogin] = useState('')
    const [senhaLogin, setSenhaLogin] = useState('')
    const [isSaving, SetIsSaving] = useState(false)
    const navigate = useNavigate()


    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault()
        SetIsSaving(true)

        try {
            const data = {
                email: emailLogin,
                senha: senhaLogin
            }

            const res = await axios.post(' http://localhost:4000/auth/login', data)
            const token = res.data.accessToken
            console.log(res)

            if (res.data.length === 0) {
                SetIsSaving(false)
                return toast.error('Usuario não encontrado', {
                    autoClose: 3000,
                    hideProgressBar: true,
                    pauseOnHover: false
                })
            }

            const userRes = await axios.get('http://localhost:4000/usuarios/byemail', {
                params: {
                    email: data.email
                },
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })

            const userDataArray = userRes.data;
            const userData = Array.isArray(userDataArray) ? userDataArray[0] : userDataArray;

            if (!userData) {
                SetIsSaving(false)
                return toast.error('Dados do usuário não encontrados após login', { /* ... */ })
            }

            const fullUserData = {
                ...userData, // Espalha todos os dados do usuário (id, nome, email, etc.)
                token,       // Adiciona o token no objeto
            };

            SetIsSaving(false)
            login(fullUserData)
            toast.success('Login realizado com sucesso!', {
                autoClose: 3000,
                hideProgressBar: true,
                pauseOnHover: false
            })
            navigate('/')
            // setTimeout(() => , 2000)

        }
        catch (error) {
            SetIsSaving(false)
            console.log('Erro ao de conexão:', error);
            toast.error('Erro ao conectar ao servidor', {
                autoClose: 3000,
                hideProgressBar: true,
                pauseOnHover: false
            })
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
                        <input type="password" className='input-senhaLo' value={senhaLogin} required onChange={(event) => setSenhaLogin(event.target.value)} minLength={8} />
                    </div>

                    <div className='irPg_cadastro'>
                        <label onClick={() => navigate('/Cadastro')}>Não tem uma conta?</label>
                    </div>

                    <div className='container_bnt_login'>

                        <button type="submit" className='botao-login' >{isSaving ? 'Logando' : 'Logar'}</button>
                    </div>


                </div>


            </form>
        </div>

    )



}

