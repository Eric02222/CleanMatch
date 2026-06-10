import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { HiMail, HiLockClosed, HiArrowRight } from "react-icons/hi";

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
            const loginData = {
                email: emailLogin,
                senha: senhaLogin
            }

            const res = await api.post('/auth/login', loginData)
            const { accessToken, usuario } = res.data

            const fullUserData = {
                ...usuario,
                token: accessToken,
            };

            login(fullUserData)
            toast.success('Bem-vindo de volta!', {
                autoClose: 3000,
                hideProgressBar: true,
                pauseOnHover: false
            })
            navigate('/')

        }
        catch (error) {
            console.error('Erro no login:', error);
            const message = error.response?.data?.error || 'Erro ao conectar ao servidor';
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-3xl" />
            </div>

            <main className="relative w-full max-w-[480px] animate-in fade-in zoom-in duration-500">
                <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 md:p-12">
                    <div className="text-center space-y-2 mb-10">
                        <div className="inline-flex p-4 bg-brand-primary/10 rounded-2xl mb-4 text-brand-primary">
                            <HiLockClosed className="text-3xl" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Login</h1>
                        <p className="text-slate-500 font-medium">Que bom ver você por aqui novamente!</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="label">E-mail</label>
                                <div className="relative group">
                                    <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-brand-primary transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="seu@email.com"
                                        className="input-base pl-12"
                                        value={emailLogin}
                                        required
                                        onChange={(e) => setEmailLogin(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="label">Senha</label>
                                <div className="relative group">
                                    <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-brand-primary transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="input-base pl-12"
                                        value={senhaLogin}
                                        required
                                        minLength={8}
                                        onChange={(e) => setSenhaLogin(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <Link to="/Cadastro" className="text-slate-500 font-bold hover:text-brand-primary transition-colors">
                                Criar nova conta
                            </Link>
                            <Link to="/forgot-password" size="sm" className="text-brand-primary font-bold hover:underline">Esqueceu a senha?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="btn-primary w-full !h-12 !px-6 !rounded-xl !text-base shadow-brand-primary/20 flex items-center justify-center gap-3"
                        >
                            <span className="font-black">{isSaving ? 'Verificando...' : 'Entrar na Conta'}</span>
                            {!isSaving && <HiArrowRight className="text-2xl group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-slate-400 text-sm font-medium">
                    CleanMatch &bull; Sua plataforma de serviços profissionais
                </p>
            </main>
        </div>
    )
}
