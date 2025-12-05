import { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Cadastro() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [vaSenha, setVaSenha] = useState('')
    const [tipoConta, setTipoConta] = useState('Cliente')

    const [isPasswordMatch, SetIsPasswordMatch] = useState(true)
    const [isSaving, SetIsSaving] = useState(false)

    const navigate = useNavigate();

    const ispassordValid = () => senha.length >= 8 && senha === vaSenha

    const resetForm = () => {
        setNome('')
        setEmail('')
        setSenha('')
        setVaSenha('')
        setTipoConta('Cliente')
        SetIsPasswordMatch(true)
    }

    const cadastro = async (e) => {
        e.preventDefault()

        if (!ispassordValid()) {
            SetIsPasswordMatch(false)
            return
        }

        SetIsSaving(true)

        try {

            await axios.post('http://localhost:4000/auth/register', {
                nome: nome,
                email: email,
                senha: senha,
                tipo_conta: tipoConta
            })

            resetForm()
            SetIsSaving(false)
            toast.success('Usuario criado com sucesso!', {
                autoClose: 3000,
                hideProgressBar: true,
                pauseOnHover: false
            })


            navigate('/login');


        } catch (error) {
            console.error("Erro ao criar usuario", error)
            SetIsSaving(false)
            toast.error('Erro ao criar usuario', {
                autoClose: 3000,
                hideProgressBar: true,
                pauseOnHover: false
            })
        }
    }


    return (
        <div className="flex items-center justify-center flex-col gap-6 min-h-screen bg-[#20c997] p-4">

            <main
                className="
                    flex bg-white w-full 
                    max-w-[380px]       base pequena 
                    sm:max-w-[420px]    tablets 
                    md:max-w-[460px]    notebooks 
                    lg:max-w-[430px]    monitores 
                    
                    min-h-[55vh] items-center justify-center rounded-[10px] drop-shadow-[20px_20px_4px_rgba(90,86,90,0.2)] flex-col p-6">

                <h1 className="text-[26px] sm:text-[40px] font-bold mb-4">
                    Cadastro
                </h1>

                {/* FORMULÁRIO */}
                <form onSubmit={cadastro} className="flex flex-col items-center justify-center w-full gap-[20px]">

                    {/* CAMPOS */}
                    <div className="
                        flex flex-col 
                        w-full 
                        max-w-[320px]
                        sm:max-w-[360px]
                        gap-[8px]
                    ">

                        <label className="text-[17px]">Nome</label>
                        <input
                            type="text"
                            className="
                                bg-transparent border-b-2 border-[#242424]
                                h-[28px]
                                w-full
                                text-[15px]
                                outline-none
                                transition
                                duration-300
                                focus:border-[#20c997]
                            "
                            value={nome}
                            onChange={(event) => setNome(event.target.value)}
                            required
                        />

                        <label className="text-[17px]">Email</label>
                        <input
                            type="email"
                            className="
                                bg-transparent border-b-2 border-[#242424]
                                h-[28px]
                                w-full 
                                text-[15px]
                                outline-none
                                transition
                                duration-300
                                focus:border-[#20c997]
                            "
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />

                        <label className="text-[17px]">Senha</label>
                        <input
                            type="password"
                            className="
                                bg-transparent border-b-2 border-[#242424]
                                h-[28px]
                                w-full 
                                text-[15px]
                                outline-none
                                transition
                                duration-300
                                focus:border-[#20c997]
                            "
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                            required
                            minLength={8}
                        />

                        <label className="text-[17px]">Confirmar Senha</label>
                        <input
                            type="password"
                            className="
                                bg-transparent border-b-2 border-[#242424]
                                h-[28px]
                                w-full 
                                text-[15px]
                                outline-none
                                transition
                                duration-300
                                focus:border-[#20c997]
                            "
                            value={vaSenha}
                            onChange={(event) => setVaSenha(event.target.value)}
                            required
                            minLength={8}
                        />

                        {!isPasswordMatch && (
                            <p className='text-red-500 text-sm mt-1 text-center'>
                                Senhas não correspondem
                            </p>
                        )}

                    </div>

                    {/* TIPO DE CONTA */}
                    <div className="flex items-center justify-center gap-6 text-[14px] sm:text-[15px] mt-2">
                        <label className="flex gap-2 items-center">
                            <input
                                type="radio"
                                id='cliente'
                                name='escolha'
                                value='Cliente'
                                onChange={(event) => setTipoConta(event.target.value)}
                                checked={tipoConta === 'Cliente'}
                            />
                            Cliente
                        </label>

                        <label className="flex gap-2 items-center">
                            <input
                                type="radio"
                                id='prestador-servico'
                                value='Prestador/a de Serviço'
                                name='escolha'
                                onChange={(event) => setTipoConta(event.target.value)}
                                checked={tipoConta === 'Prestador/a de Serviço'}
                            />
                            Prestador/a
                        </label>
                    </div>

                    {/* LINK LOGIN */}
                    <p
                        className="cursor-pointer text-[14px]"
                        onClick={() => navigate('/Login')}
                    >
                        Já tem uma conta?
                    </p>

                    {/* BOTÃO */}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="
                            w-[160px] h-[38px]
                            sm:w-[180px] sm:h-[42px]
                            bg-[#20c997] 
                            text-white 
                            font-bold 
                            text-[16px] sm:text-[18px]
                            rounded-[3px]
                            transition 
                            duration-300 
                            hover:bg-white 
                            hover:text-black 
                            hover:border 
                            hover:border-[#20c997]
                        "
                    >
                        {isSaving ? 'Salvando...' : 'Cadastrar'}
                    </button>

                </form>

            </main>
        </div>
    )
}

