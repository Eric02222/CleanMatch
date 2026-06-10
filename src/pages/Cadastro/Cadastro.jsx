import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { HiUser, HiMail, HiLockClosed, HiBadgeCheck, HiArrowRight } from "react-icons/hi";

export function Cadastro() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [vaSenha, setVaSenha] = useState('')
    const [tipoConta, setTipoConta] = useState('CLIENTE')

    const [isPasswordMatch, SetIsPasswordMatch] = useState(true)
    const [isSaving, SetIsSaving] = useState(false)

    const navigate = useNavigate();

    const ispassordValid = () => senha.length >= 8 && senha === vaSenha

    const resetForm = () => {
        setNome('')
        setEmail('')
        setSenha('')
        setVaSenha('')
        setTipoConta('CLIENTE')
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
            await api.post('/auth/register', {
                nome: nome,
                email: email,
                senha: senha,
                tipo_conta: tipoConta
            })

            resetForm()
            toast.success('Conta criada! Agora você pode fazer login.', {
                autoClose: 3000,
                hideProgressBar: true,
                pauseOnHover: false
            })

            navigate('/login');
        } catch (error) {
            console.error("Erro ao criar usuário:", error)
            const message = error.response?.data?.error || 'Erro ao criar usuário';
            toast.error(message, {
                autoClose: 3000,
                hideProgressBar: true,
                pauseOnHover: false
            })
        } finally {
            SetIsSaving(false)
        }
    }


    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-32 pb-20">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-3xl" />
            </div>

            <main className="relative w-full max-w-[540px] animate-in fade-in zoom-in duration-500">
                <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 md:p-12">
                    <div className="text-center space-y-2 mb-10">
                        <div className="inline-flex p-4 bg-brand-primary/10 rounded-2xl mb-4 text-brand-primary">
                            <HiBadgeCheck className="text-3xl" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Cadastro</h1>
                        <p className="text-slate-500 font-medium">Junte-se a nós e aproveite o melhor da plataforma!</p>
                    </div>

                    <form onSubmit={cadastro} className="space-y-6">
                        {/* TIPO DE CONTA SELECTOR */}
                        <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                            <button
                                type="button"
                                onClick={() => setTipoConta('CLIENTE')}
                                className={`py-3 rounded-xl font-bold text-sm transition-all ${tipoConta === 'CLIENTE' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Sou Cliente
                            </button>
                            <button
                                type="button"
                                onClick={() => setTipoConta('PROFISSIONAL')}
                                className={`py-3 rounded-xl font-bold text-sm transition-all ${tipoConta === 'PROFISSIONAL' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Sou Profissional
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="label">Nome Completo</label>
                                <div className="relative group">
                                    <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-brand-primary transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Como devemos te chamar?"
                                        className="input-base pl-12"
                                        value={nome}
                                        onChange={(event) => setNome(event.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="label">E-mail</label>
                                <div className="relative group">
                                    <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-brand-primary transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="seu@email.com"
                                        className="input-base pl-12"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="label">Senha</label>
                                    <div className="relative group">
                                        <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-brand-primary transition-colors" />
                                        <input
                                            type="password"
                                            placeholder="Min. 8 carac."
                                            className="input-base pl-12"
                                            value={senha}
                                            onChange={(event) => setSenha(event.target.value)}
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="label">Confirmar</label>
                                    <div className="relative group">
                                        <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-brand-primary transition-colors" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="input-base pl-12"
                                            value={vaSenha}
                                            onChange={(event) => setVaSenha(event.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {!isPasswordMatch && (
                                <p className='text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-bounce'>
                                    As senhas não coincidem
                                </p>
                            )}
                        </div>

                        <div className="text-center text-sm">
                            <p className="text-slate-500 font-medium">
                                Já possui uma conta? {' '}
                                <Link to="/Login" className="text-brand-primary font-black hover:underline">
                                    Fazer Login
                                </Link>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="btn-primary w-full !h-12 !px-6 !rounded-xl !text-base shadow-brand-primary/20 flex items-center justify-center gap-3"
                        >
                            <span className="font-black">{isSaving ? 'Processando...' : 'Criar minha conta'}</span>
                            {!isSaving && <HiArrowRight className="text-2xl group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-slate-400 text-sm font-medium">
                    Ao se cadastrar, você concorda com nossos <a href="#" className="underline">Termos de Uso</a>.
                </p>
            </main>
        </div>
    )
}
