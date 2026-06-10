import { useState, useEffect } from 'react';
import { formatPhoneNumber, formatCepNumber, formatTime } from '../../Components/Formarte/Formarte.js';
import { useAuth } from "../../contexts/AuthContext.jsx";
import Aviso from '../../Components/Aviso/Aviso.jsx';
import UserIcon from '../../assets/icons/user-icon.svg';
import { Card } from '../../Components/CardUserHome/CardUserHome.jsx'
import api from '../../services/api';
import { HiSearch, HiX, HiChevronLeft, HiChevronRight, HiAdjustments } from "react-icons/hi";

export function Home() {
    const [usuarios, setUsuarios] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const [mostrarAviso, setMostrarAviso] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const defaultAvatar = UserIcon;


    const fetchUsuarios = async () => {
        try {
            const response = await api.get('/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    useEffect(() => {
        if (user && user.tipo_conta === 'PROFISSIONAL') {
            const { cargaHoraria_inicio, cargaHoraria_fim, valor_min, valor_max, cep, estado, cidade, rua, contato } = user;

            const informacoesIncompletas =
                !cargaHoraria_inicio ||
                !cargaHoraria_fim ||
                !valor_min ||
                !valor_max ||
                !cep ||
                estado == '' ||
                cidade == '' ||
                rua == '' ||
                !contato;

            setMostrarAviso(informacoesIncompletas);
        } else if (!user) {
            setMostrarAviso(false);
        }
    }, [user]);


    useEffect(() => {
        setSelectedCard(null);
    }, [searchTerm, paginaAtual]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [searchTerm, itensPorPagina]);

    const usuariosVisiveis = usuarios.filter(userVi => {
        if (userVi.tipo_conta !== 'PROFISSIONAL') return false;

        const informacoesCompletas =
            userVi.cargaHoraria_inicio &&
            userVi.cargaHoraria_fim &&
            userVi.valor_min &&
            userVi.valor_max &&
            userVi.cep &&
            userVi.estado &&
            userVi.cidade &&
            userVi.rua &&
            userVi.contato;
        if (!informacoesCompletas) {
            return false;
        }

        const termo = searchTerm.toLowerCase();
        if (termo === '') return true;

        return (
            userVi.nome?.toLowerCase().includes(termo) ||
            userVi.cidade?.toLowerCase().includes(termo) ||
            userVi.estado?.toLowerCase().includes(termo) ||
            userVi.rua?.toLowerCase().includes(termo)
        );
    });

    const handleCardClick = (user) => {
        setSelectedCard(user);
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = defaultAvatar;
    };

    const totalDePaginas = Math.ceil(usuariosVisiveis.length / itensPorPagina);
    const ultimoItemIndex = paginaAtual * itensPorPagina;
    const primeiroItemIndex = ultimoItemIndex - itensPorPagina;
    const usuariosDaPagina = usuariosVisiveis.slice(primeiroItemIndex, ultimoItemIndex);


    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* AVISO */}
                {user && mostrarAviso && (
                    <div className="mb-8 animate-in slide-in-from-top duration-500">
                        <Aviso />
                    </div>
                )}

                {/* HEADER SECTION */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Encontre <span className="text-brand-primary">Profissionais</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Os melhores especialistas para o seu serviço, em um só lugar.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <div className="relative flex-grow min-w-[300px]">
                            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                            <input
                                type="text"
                                placeholder="Nome, cidade ou estado..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all outline-none font-medium text-slate-700"
                            />
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <HiX className="text-slate-400" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
                            <div className="px-3 py-2 text-slate-500 flex items-center gap-2 shrink-0">
                                <HiAdjustments />
                                <span className="text-[10px] font-black uppercase tracking-widest">Exibir:</span>
                            </div>
                            {[10, 20, 30].map(qnt => (
                                <button
                                    key={qnt}
                                    onClick={() => setItensPorPagina(qnt)}
                                    className={`px-5 py-2 rounded-xl text-sm font-black transition-all shrink-0 ${
                                        itensPorPagina === qnt 
                                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {qnt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LISTING SECTION */}
                    <div className={`${selectedCard ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4 transition-all duration-500`}>
                        {usuariosDaPagina.length > 0 ? (
                            usuariosDaPagina.map((u) => (
                                <Card
                                    key={u.id}
                                    data={u}
                                    onClick={() => handleCardClick(u)}
                                    isSelected={selectedCard?.id === u.id}
                                    onError={handleImageError}
                                    fotoUrl={u.foto_perfil || defaultAvatar}
                                />
                            ))
                        ) : (
                            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 space-y-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                    <HiSearch className="text-3xl text-slate-300" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Nenhum profissional encontrado</h3>
                                    <p className="text-slate-500">Tente ajustar sua busca para encontrar o que precisa.</p>
                                </div>
                            </div>
                        )}

                        {/* PAGINATION */}
                        {totalDePaginas > 1 && (
                            <div className="flex items-center justify-center gap-3 pt-12">
                                <button
                                    onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                                    disabled={paginaAtual === 1}
                                    className="btn-secondary !p-3 !rounded-2xl"
                                >
                                    <HiChevronLeft className="text-2xl" />
                                </button>
                                
                                <div className="flex items-center gap-1 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm font-black text-slate-700">
                                    <span className="text-brand-primary">{paginaAtual}</span>
                                    <span className="text-slate-300 mx-1">de</span>
                                    <span>{totalDePaginas}</span>
                                </div>

                                <button
                                    onClick={() => setPaginaAtual(p => Math.min(totalDePaginas, p + 1))}
                                    disabled={paginaAtual === totalDePaginas}
                                    className="btn-secondary !p-3 !rounded-2xl"
                                >
                                    <HiChevronRight className="text-2xl" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* DETAILS PANEL (DESKTOP) */}
                    {selectedCard && (
                        <div className="hidden lg:block lg:col-span-5 sticky top-28 animate-in slide-in-from-right duration-500">
                            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                                <div className="relative h-64 bg-slate-100">
                                    <img 
                                        src={selectedCard.foto_perfil || defaultAvatar} 
                                        className="w-full h-full object-cover" 
                                        onError={handleImageError} 
                                        alt={selectedCard.nome} 
                                    />
                                    <button 
                                        onClick={() => setSelectedCard(null)}
                                        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full text-slate-500 hover:text-red-500 hover:scale-110 transition-all shadow-lg"
                                    >
                                        <HiX className="text-xl" />
                                    </button>
                                    <div className="absolute bottom-4 left-4">
                                        <span className="px-4 py-1.5 bg-brand-primary text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                                            {selectedCard.tipo_conta}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 space-y-6">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2">{selectedCard.nome}</h2>
                                        <p className="text-slate-500 font-medium flex items-center gap-2">
                                            <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></span>
                                            {selectedCard.cidade}, {selectedCard.estado}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Valor/h</p>
                                            <p className="text-lg font-bold text-brand-primary">R$ {selectedCard.valor_min} - {selectedCard.valor_max}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Horário</p>
                                            <p className="text-lg font-bold text-slate-700">{formatTime(selectedCard.cargaHoraria_inicio)} às {formatTime(selectedCard.cargaHoraria_fim)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400 font-bold">Email</span>
                                            <span className="text-slate-700 font-medium">{selectedCard.email}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400 font-bold">Contato</span>
                                            <span className="text-slate-700 font-medium">{formatPhoneNumber(selectedCard.contato)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400 font-bold">Endereço</span>
                                            <span className="text-slate-700 font-medium text-right">{selectedCard.rua}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-3">Sobre o Profissional</p>
                                        <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl italic">
                                            "{selectedCard.descricao || 'Este profissional ainda não adicionou uma descrição.'}"
                                        </p>
                                    </div>

                                    <button className="btn-primary w-full shadow-slate-900/10 active:scale-95">
                                        <span>Entrar em Contato</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* MODAL MOBILE */}
                {selectedCard && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden p-4 sm:p-6">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedCard(null)} />
                        <div className="relative bg-white rounded-t-3xl w-full max-w-lg overflow-y-auto max-h-[90vh] animate-in slide-in-from-bottom duration-500 shadow-2xl">
                             <div className="sticky top-0 right-0 p-4 flex justify-end z-10">
                                <button onClick={() => setSelectedCard(null)} className="p-2 bg-white/90 backdrop-blur rounded-full shadow-lg text-slate-400">
                                    <HiX className="text-2xl" />
                                </button>
                             </div>
                             <div className="px-6 pb-12 -mt-12 space-y-6">
                                <img src={selectedCard.foto_perfil || defaultAvatar} className="w-full h-64 object-cover rounded-2xl shadow-xl" onError={handleImageError} alt="" />
                                <div>
                                    <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-lg mb-2 inline-block">
                                        {selectedCard.tipo_conta}
                                    </span>
                                    <h2 className="text-3xl font-black text-slate-900">{selectedCard.nome}</h2>
                                    <p className="text-slate-500 font-medium">{selectedCard.cidade}, {selectedCard.estado}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor/h</p>
                                        <p className="font-bold text-brand-primary">R$ {selectedCard.valor_min} - {selectedCard.valor_max}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horário</p>
                                        <p className="font-bold text-slate-700">{formatTime(selectedCard.cargaHoraria_inicio)} às {formatTime(selectedCard.cargaHoraria_fim)}</p>
                                    </div>
                                </div>
                                <div className="space-y-4 text-sm font-medium">
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span className="text-slate-400">Email</span>
                                        <span className="text-slate-700">{selectedCard.email}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span className="text-slate-400">Contato</span>
                                        <span className="text-slate-700">{formatPhoneNumber(selectedCard.contato)}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                     <p className="text-slate-600 italic">"{selectedCard.descricao || 'Sem descrição.'}"</p>
                                </div>
                                <button className="btn-primary w-full shadow-brand-primary/20">
                                    <span>Solicitar Orçamento</span>
                                </button>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
