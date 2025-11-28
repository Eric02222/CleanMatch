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
        <div className="flex items-center justify-center flex-col gap-[20px] min-h-screen bg-[#20c997]">
            <main className="flex bg-white w-[50vh] h-[73vh] items-center justify-center rounded-[10px] drop-shadow-[25px_25px_4.5px_rgba(90,86,90,0.2)] flex-col">

            <div>
                <h1 className="text-[40px] font-bold">Cadastro</h1>
            </div>

            <form onSubmit={cadastro} className="flex flex-col items-center justify-center min-w-[250px] gap-[30px]">
                <div className="flex items-center justify-center flex-col w-[350px] gap-[10px]">

                    <label htmlFor="input-email" className="text-[20px] self-start pl-[5%]">Nome</label>
                    <input type="text" className="bg-transparent border-b-2 border-[#242424] pl-[2%] mb-[10px] h-[35px] w-full text-[18px] outline-none transition duration-300 focus:border-[#20c997]" value={nome} onChange={(event) => setNome(event.target.value)} required />

                    <label htmlFor="input-email" className="text-[20px] self-start pl-[5%]">Email</label>
                    <input type="text" className="bg-transparent border-b-2 border-[#242424] pl-[2%] mb-[10px] h-[35px] w-full text-[18px] outline-none transition duration-300 focus:border-[#20c997]" value={email} onChange={(event) => setEmail(event.target.value)} required />

                    <label htmlFor="input-senha" className="text-[20px] self-start pl-[5%]">Senha</label>
                    <input type="password" className="bg-transparent border-b-2 border-[#242424] pl-[2%] mb-[10px] h-[35px] w-full text-[18px] outline-none transition duration-300 focus:border-[#20c997]" value={senha} onChange={(event) => setSenha(event.target.value)} required minLength={8} />

                    <label htmlFor="input-coSenha" className="text-[20px] self-start pl-[5%]">Confirmar Senha</label>
                    <input type="password" className="bg-transparent border-b-2 border-[#242424] pl-[2%] mb-[10px] h-[35px] w-full text-[18px] outline-none transition duration-300 focus:border-[#20c997]" value={vaSenha} onChange={(event) => setVaSenha(event.target.value)} required minLength={8} />

                    {!isPasswordMatch && (
                        <p className='text-red-500 text-sm mt-1 text-center'>Senhas não correspodem</p>
                    )}

                </div>

                <div className="flex items-center justify-center gap-[50px]">
                    <div className='input-tipo-cliente flex items-center gap-2'>
                        <input type="radio" id='cliente' className='cliente' name='escolha' value='Cliente' onChange={(event) => setTipoConta(event.target.value)} checked={tipoConta === 'Cliente'} />
                        <label htmlFor="cliente">Cliente</label>
                    </div>

                    <div className='input-tipo-prestadorSe flex items-center gap-2'>
                        <input type="radio" id='prestador-servico' className='prestador-servico' value='Prestador/a de Serviço' onChange={(event) => setTipoConta(event.target.value)} name='escolha' checked={tipoConta === 'Prestador/a de Serviço'} />
                        <label htmlFor="prestador-servico">Prestador/a de Serviço</label>
                    </div>


                </div>


                <div className="flex flex-col justify-center items-center cursor-pointer">
                    <label type="submit" onClick={() => navigate('/Login')}>Já tem uma conta?</label>
                </div>

                <div className="flex items-center justify-center rounded-[3px] bg-[#20c997] text-white font-bold text-[25px] h-[45px] w-[220px] transition duration-300 hover:bg-[aliceblue] hover:text-black hover:border hover:border-[#20c997]">
                    <button type="submit" disabled={isSaving} className='botao-cadastro'>{isSaving ? 'Salvando' : 'Cadastrar'}</button>
                </div>
            </form>
            </main>

        </div>
    )
}

