import React, { useState, useEffect } from 'react'
import './Cadastro.css'
import Navbar from "../components/Navbar"
import axios from 'axios';
import { validarEmail } from '../components/Formarter';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Cadastro() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [vaSenha, setVaSenha] = useState('')
    const [tipoConta, setTipoConta] = useState('Cliente')

    const [isPasswordMatch, SetIsPasswordMatch] = useState(true)
    const [isSaving, SetIsSaving] = useState(false)

    const navigate = useNavigate();

    const ispassordValid = () => senha.length >= 8 && senha === vaSenha



    const cadastro = async (e) => {
        e.preventDefault()

        if (!ispassordValid()) {
            SetIsPasswordMatch(false)
            return
        }

        SetIsSaving(true)

        try {

            await axios.post('http://localhost:3000/auth/register', {
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

            fetchUsuarios();
            limparForm();
            setTimeout(() => {
                navigate('/Login');
            }, 800);

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

    function limparForm() {
        setEmail('')
        setSenha('')
        setVaSenha('')
        setNome('')
    }

    return (
        <div className='container-cadastro'>
            <Navbar />

            <div>
                <h1 className='titulo_cadastro'>Cadastro</h1>
            </div>

            <form onSubmit={cadastro} className='container_conteudos_cadastro'>
                <div className='inputs-cadastro'>

                    <label htmlFor="input-email" className='label-emailCad'>Nome</label>
                    <input type="text" className='input-email' value={nome} onChange={(event) => setNome(event.target.value)} required />

                    <label htmlFor="input-email" className='label-emailCad'>Email</label>
                    <input type="text" className='input-email' value={email} onChange={(event) => setEmail(event.target.value)} required />

                    <label htmlFor="input-senha" className='label-senhaCad'>Senha</label>
                    <input type="password" className='input-senha' value={senha} onChange={(event) => setSenha(event.target.value)} required minLength={8}/>

                    <label htmlFor="input-coSenha" className='label-coSenhaCad'>Confirmar Senha</label>
                    <input type="password" className='input-coSenha' value={vaSenha} onChange={(event) => setVaSenha(event.target.value)} required minLength={8}/>

                    {!isPasswordMatch && (
                        <p className='text-red-500 text-sm mt-1 text-center'>Senhas não correspodem</p>
                    )}

                </div>

                <div className='inputs-tipo-conta'>
                    <div className='input-tipo-cliente'>
                        <input type="radio" id='cliente' className='cliente' name='escolha' value='Cliente' onChange={(event) => setTipoConta(event.target.value)} checked={tipoConta === 'Cliente'} />
                        <label htmlFor="cliente">Cliente</label>
                    </div>

                    <div className='input-tipo-prestadorSe'>
                        <input type="radio" id='prestador-servico' className='prestador-servico' value='Prestador/a de Serviço' onChange={(event) => setTipoConta(event.target.value)} name='escolha' checked={tipoConta === 'Prestador/a de Serviço'} />
                        <label htmlFor="prestador-servico">Prestador/a de Serviço</label>
                    </div>


                </div>


                <div className='irPg_Login'>
                    <label type="submit" onClick={() => navigate('/Login')}>Já tem uma conta?</label>
                </div>

                <div className='container_bnt_cadastro'>
                    <button type="submit" disabled={isSaving} className='botao-cadastro'>{isSaving ? 'Salvando' : 'Cadastrar'}</button>
                </div>
            </form>

        </div>
    )
}

export default Cadastro