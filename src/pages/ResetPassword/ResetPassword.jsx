import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { HiLockClosed, HiArrowRight, HiCheckCircle } from "react-icons/hi";

export function ResetPassword() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const navigate = useNavigate()

    const [novaSenha, setNovaSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!token) {
            toast.error('Token de recuperação ausente.')
            navigate('/Login')
        }
    }, [token, navigate])

    const handleReset = async (e) => {
        e.preventDefault()
        
        if (novaSenha !== confirmarSenha) {
            return toast.error('As senhas não coincidem.')
        }

        if (novaSenha.length < 8) {
            return toast.error('A senha deve ter pelo menos 8 caracteres.')
        }

        setIsSaving(true)

        try {
            const res = await api.post('/auth/reset-password', {
                token,
                novaSenha
            })
            toast.success(res.data.message || 'Senha alterada com sucesso!')
            setSuccess(true)
            setTimeout(() => navigate('/Login'), 3000)
        }
        catch (error) {
            console.error('Erro ao redefinir senha:', error);
            const message = error.response?.data?.error || 'Token inválido ou expirado';
            toast.error(message)
        } finally {
            setIsSaving(false)
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
                    {!success ? (
                        <>
                            <div className="text-center space-y-2 mb-10">
                                <div className="inline-flex p-4 bg-brand-primary/10 rounded-2xl mb-4 text-brand-primary">
                                    <HiLockClosed className="text-3xl" />
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nova Senha</h1>
                                <p className="text-slate-500 font-medium">Crie uma senha forte e segura para sua conta.</p>
                            </div>

                            <form onSubmit={handleReset} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="label">Nova Senha</label>
                                        <div className="relative group">
                                            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-brand-primary transition-colors" />
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="input-base pl-12"
                                                value={novaSenha}
                                                required
                                                minLength={8}
                                                onChange={(e) => setNovaSenha(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="label">Confirmar Senha</label>
                                        <div className="relative group">
                                            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-brand-primary transition-colors" />
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="input-base pl-12"
                                                value={confirmarSenha}
                                                required
                                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="btn-primary w-full !h-12 !px-6 !rounded-xl !text-base shadow-brand-primary/20 flex items-center justify-center gap-3"
                                >
                                    <span className="font-black">{isSaving ? 'Salvando...' : 'Redefinir Senha'}</span>
                                    {!isSaving && <HiArrowRight className="text-2xl" />}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="inline-flex p-6 bg-green-50 rounded-full mb-6 text-green-500">
                                <HiCheckCircle className="text-5xl" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-4">Sucesso!</h2>
                            <p className="text-slate-500 font-medium mb-8">
                                Sua senha foi alterada com sucesso. Você será redirecionado para o login em instantes.
                            </p>
                            <Link to="/Login" className="btn-primary w-full">
                                <span className="font-black">Ir para Login</span>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
