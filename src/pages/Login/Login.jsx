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

            const res = await axios.post('http://localhost:4000/auth/login', data)
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
        <div className="flex items-center justify-center flex-col min-h-screen text-black bg-[#20c997] p-4">

            {/* CAIXA BRANCA ALTA / RESPONSIVA */}
            <main
                className="
                    flex flex-col
                    bg-white
                    w-full
                    max-w-[400px]            /* largura proporcional */
                    min-h-[50vh]             /* altura mais alta como no exemplo */
                    rounded-[12px]
                    p-10
                    drop-shadow-[25px_25px_4.5px_rgba(90,86,90,0.2)]
                "
            >

                <form onSubmit={handleLogin} className="flex flex-col items-center gap-8 w-full">

                    {/* TÍTULO */}
                    <h1 className="text-[36px] font-bold text-center">
                        Login
                    </h1>

                    {/* CAMPOS */}
                    <div className="flex flex-col w-full max-w-[360px] gap-6">

                        <div className="flex flex-col w-full gap-3">
                            <label className="text-[20px]">Email</label>
                            <input
                                type="text"
                                className="
                                    bg-transparent border-b-2 border-[#242424]
                                    h-[35px] text-[18px]
                                    outline-none
                                    focus:border-[#20c997]
                                    transition
                                "
                                value={emailLogin}
                                required
                                onChange={(e) => setEmailLogin(e.target.value)}
                            />

                            <label className="text-[20px]">Senha</label>
                            <input
                                type="password"
                                className="
                                    bg-transparent border-b-2 border-[#242424]
                                    h-[35px] text-[18px]
                                    outline-none
                                    focus:border-[#20c997]
                                    transition
                                "
                                value={senhaLogin}
                                required
                                minLength={8}
                                onChange={(e) => setSenhaLogin(e.target.value)}
                            />
                        </div>

                        {/* LINK PARA CADASTRAR */}
                        <p
                            onClick={() => navigate('/Cadastro')}
                            className="text-center cursor-pointer text-[16px]"
                        >
                            Não tem uma conta?
                        </p>

                    </div>

                    {/* BOTÃO */}
                    <button
                        type="submit"
                        className="
                            rounded-[6px]
                            bg-[#20c997]
                            text-white font-bold
                            text-[22px]
                            h-[48px]
                            w-[230px]
                            transition
                            hover:bg-[aliceblue]
                            hover:text-black
                            hover:border-[#20c997]
                            border
                        "
                    >
                        {isSaving ? 'Logando...' : 'Logar'}
                    </button>

                </form>
            </main>

        </div>
    )

}

