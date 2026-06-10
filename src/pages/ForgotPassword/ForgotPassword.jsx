import { useState } from 'react'
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { HiMail, HiArrowRight, HiChevronLeft } from "react-icons/hi";

export function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [sent, setSent] = useState(false)

    const handleForgot = async (e) => {
        e.preventDefault()
        setIsSending(true)

        try {
            const res = await api.post('/auth/forgot-password', { email })
            toast.success(res.data.message || 'E-mail enviado com sucesso!', {
                autoClose: 5000
            })
            setSent(true)
        }
        catch (error) {
            console.error('Erro ao solicitar recuperação:', error);
            const message = error.response?.data?.error || 'Erro ao conectar ao servidor';
            toast.error(message)
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-3xl" />
            </div>

            <main className="relative w-full max-w-[480px] animate-in fade-in zoom-in duration-500">
                <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 md:p-12">
                    <Link to="/Login" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-brand-primary transition-colors mb-8">
                        <HiChevronLeft className="text-xl" />
                        Voltar para o Login
                    </Link>

                    {!sent ? (
                        <>
                            <div className="text-center space-y-2 mb-10">
                                <div className="inline-flex p-4 bg-brand-primary/10 rounded-2xl mb-4 text-brand-primary">
                                    <HiMail className="text-3xl" />
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recuperar Senha</h1>
                                <p className="text-slate-500 font-medium">Informe seu e-mail para receber o link de redefinição.</p>
                            </div>

                            <form onSubmit={handleForgot} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="label">E-mail Cadastrado</label>
                                    <div className="relative group">
                                        <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-brand-primary transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="seu@email.com"
                                            className="input-base pl-12"
                                            value={email}
                                            required
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className="btn-primary w-full !h-12 !px-6 !rounded-xl !text-base shadow-brand-primary/20 flex items-center justify-center gap-3"
                                >
                                    <span className="font-black">{isSending ? 'Enviando...' : 'Enviar Link de Recuperação'}</span>
                                    {!isSending && <HiArrowRight className="text-2xl" />}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="inline-flex p-6 bg-green-50 rounded-full mb-6 text-green-500">
                                <HiMail className="text-5xl" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-4">E-mail Enviado!</h2>
                            <p className="text-slate-500 font-medium mb-8">
                                Se o e-mail informado estiver em nossa base, você receberá instruções para redefinir sua senha em instantes.
                            </p>
                            <p className="text-sm text-slate-400">
                                Não recebeu? Verifique sua caixa de spam ou tente novamente.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
