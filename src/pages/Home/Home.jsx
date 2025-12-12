import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatPhoneNumber, formatCepNumber, formatTime } from '../../Components/Formarte/Formarte.js';
import { useAuth } from "../../contexts/AuthContext.jsx";
import Aviso from '../../Components/Aviso/Aviso.jsx';
import UserIcon from '../../assets/icons/user-icon.svg';
import { Card } from '../../Components/CardUserHome/CardUserHome.jsx'

export function Home() {
    const [usuarios, setUsuarios] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const [mostrarAviso, setMostrarAviso] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const token = user?.token;
    const defaultAvatar = UserIcon;


    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:4000/usuarios', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    useEffect(() => {
        if (user && user.tipo_conta === 'Prestador/a de Serviço') {
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
        if (userVi.tipo_conta !== 'Prestador/a de Serviço') return false;

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
        <div className="flex flex-col min-h-screen">

            {/* AVISO */}
            {user && mostrarAviso && (
                <div className="
            flex items-center justify-center mx-auto
            md:mt-[90px] md:mb-[-60px]   /* DESKTOP */
            mt-20 mb-[-55px] w-full      /* MOBILE */
        ">
                    <Aviso />
                </div>
            )}

            {/* CONTAINER PRINCIPAL */}
            <div className="flex flex-col items-center p-4 lg:p-[30px] flex-grow w-full overflow-hidden">

                {/* WRAPPER CENTRAL — SEMPRE IGUAL EM QUALQUER TELA */}
                <div className="flex flex-col justify-center w-full max-w-[1200px]">

                    {/* INPUT DE BUSCA */}
                    <div className="
        flex gap-[10px] mb-[20px] 
        mt-13  
        md:mt-13 md:mb-4 
        mx-auto w-full max-w-full lg:max-w-[1100px] {/* Adicionado max-w-full */}
        bg-white p-[10px] rounded-[8px]
        shadow-[0_2px_5px_rgba(0,0,0,0.1)]
        box-border {/* Garante que o padding não aumente a largura total */}
    ">
                        <input
                            type="text"
                            placeholder="Buscar por nome, cidade ou estado"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-none outline-none p-[5px] text-[1em] w-full placeholder:text-[#999]"
                        />
                    </div>

                    {/* EXIBIR POR */}
                    <div className="flex items-center flex-wrap font-bold gap-[5px] pb-[10px] pl-[10px]">

                        <label className="pb-[5px] text-[18px]">Exibir por:</label>

                        {[10, 15, 20, 25, 30].map(qnt => (
                            <button
                                key={qnt}
                                className={`
                        p-2 border rounded-[5px] font-medium transition duration-300
                        ${itensPorPagina === qnt
                                        ? "bg-[#1a9c78] text-white border-[#168d69]"
                                        : "bg-transparent border-black hover:bg-[#1a9c78] hover:text-white hover:border-[#20c997] hover:scale-110"
                                    }
                    `}
                                onClick={() => setItensPorPagina(qnt)}
                            >
                                {qnt}
                            </button>
                        ))}

                    </div>
                </div>

                {/* LISTA + PAINEL DE DETALHES */}
                <div className="
        flex flex-col lg:flex-row
        gap-5
        w-full max-w-[1200px]
    ">

                    {/* LISTA */}
                    <div className="flex flex-col gap-[10px] flex-grow w-full overflow-hidden">
                        {usuariosDaPagina.map((user) => {
                            const fotoUsuario = user.foto_perfil || defaultAvatar;
                            return (
                                <Card
                                    key={user.id}
                                    data={user}
                                    onClick={() => handleCardClick(user)}
                                    isSelected={selectedCard === user}
                                    onError={handleImageError}
                                    onClose={() => setSelectedCard(null)}
                                    fotoUrl={fotoUsuario}
                                />
                            );
                        })}
                    </div>

                    {/* PAINEL DE DETALHES (RESPONSIVO) */}
                    {selectedCard && (() => {
                        const fotoUrl = selectedCard.foto_perfil || defaultAvatar;

                        return (
                            <div className="
                            hidden lg:flex
                            
                    bg-white shadow-[0_2px_5px_rgba(0,0,0,0.1)]
                    rounded-[8px] p-5
                    flex-col gap-3
                    min-h-[300px]

                    /* --- RESPONSIVO --- */
                    w-full lg:w-[600px]
                    lg:max-h-[500px]   /* <<< impede de descer até o rodapé */
                    lg:sticky lg:top-[80px]
                    ">
                                <button
                                    className="absolute top-2 right-2 text-[#333] text-xl font-bold hover:scale-110 hover:text-[#ef0707] transition"
                                    onClick={() => setSelectedCard(null)}
                                >
                                    X
                                </button>

                                <div className="flex gap-[10px] mb-[15px]">
                                    <img className="w-[150px] h-[150px] rounded-[5px] object-cover bg-[#434343]" onError={handleImageError} src={fotoUrl} alt="Avatar" />

                                    <div>
                                        <p className="text-[30px] lg:text-[40px] text-black">
                                            <strong className="text-[#333]">{selectedCard.nome}</strong>
                                        </p>
                                        <p><strong>Email:</strong> {selectedCard.email}</p>
                                        <p><strong>Contato:</strong> {formatPhoneNumber(selectedCard.contato)}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-400 pt-3">
                                    <p><strong>CEP:</strong> {formatCepNumber(selectedCard.cep)}</p>
                                    <p><strong>Localização:</strong> {selectedCard.cidade}, {selectedCard.estado}</p>
                                    <p><strong>Rua:</strong> {selectedCard.rua}</p>
                                    <p><strong>Horário:</strong> {formatTime(selectedCard.cargaHoraria_inicio)} - {formatTime(selectedCard.cargaHoraria_fim)}</p>
                                    <p><strong>Faixa de Preço:</strong> R$ {selectedCard.valor_min} - R$ {selectedCard.valor_max}</p>
                                    <p><strong>Descrição:</strong> {selectedCard.descricao}</p>
                                </div>
                            </div>
                        );
                    })()}
                </div>

                {/* MODAL MOBILE */}
                {selectedCard && (
                    <div className="fixed inset-0 z-5 flex items-center justify-center lg:hidden overflow-y-auto
    break-words">

                        {/* OVERLAY */}
                        <div
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setSelectedCard(null)}
                        />

                        {/* MODAL */}
                        <div
                            className=" 
                relative bg-white rounded-2xl p-6 w-[90%] max-w-[380px]
                animate-[fadeIn_0.25s_ease]
            "
                        >
                            {/* BOTÃO FECHAR */}
                            <button
                                onClick={() => setSelectedCard(null)}
                                className="absolute top-3 right-3 z-10
        w-9 h-9 flex items-center justify-center
        bg-white rounded-full shadow-md
        hover:scale-110 text-red-500 font-bold text-xl transition-all"
                            >
                                ×
                            </button>

                            {/* CONTEÚDO */}
                            <div className="flex flex-col gap-4">

                                <img
                                    src={selectedCard.foto_perfil || defaultAvatar}
                                    onError={handleImageError}
                                    className="w-full h-[200px] object-cover rounded-lg bg-[#434343]"
                                />

                                <h2 className="text-2xl font-bold">{selectedCard.nome}</h2>

                                <p><strong>Email:</strong> {selectedCard.email}</p>
                                <p><strong>Contato:</strong> {formatPhoneNumber(selectedCard.contato)}</p>
                                <p><strong>CEP:</strong> {formatCepNumber(selectedCard.cep)}</p>
                                <p><strong>Endereço:</strong> {selectedCard.rua}, {selectedCard.cidade} - {selectedCard.estado}</p>
                                <p><strong>Horário:</strong> {formatTime(selectedCard.cargaHoraria_inicio)}h - {formatTime(selectedCard.cargaHoraria_fim)}h</p>
                                <p><strong>Preço:</strong> R$ {selectedCard.valor_min} - R$ {selectedCard.valor_max}</p>
                                <p><strong>Descrição:</strong> {selectedCard.descricao}</p>

                            </div>
                        </div>
                    </div>
                )}

                {/* ANIMAÇÃO TAILWIND */}
                <style>
                    {
                        `@keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }}`
                    }
                </style>


                {/* PAGINAÇÃO */}
                <div className="pt-[15px] flex justify-center">
                    <div className="flex flex-row gap-[5px] flex-wrap">
                        <button
                            className="px-[10px] py-[10px] bg-transparent border border-black rounded-[5px] transition duration-300 hover:bg-[#1a9c78] hover:text-white hover:border-[#20c997] hover:scale-110"
                            onClick={() => setPaginaAtual(paginaAtual - 1)}
                            disabled={paginaAtual === 1}
                        >
                            Anterior
                        </button>

                        {Array.from({ length: totalDePaginas }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => setPaginaAtual(index + 1)}
                                className={`
                        px-[10px] py-[10px] rounded-[5px] border transition duration-300
                        ${paginaAtual === index + 1
                                        ? "bg-[#1a9c78] text-white border-[#168d69]"
                                        : "bg-transparent border-black hover:bg-[#1a9c78] hover:text-white hover:border-[#20c997] hover:scale-110"
                                    }
                    `}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            className="px-[10px] py-[10px] bg-transparent border border-black rounded-[5px] transition duration-300 hover:bg-[#1a9c78] hover:text-white hover:border-[#20c997] hover:scale-110"
                            onClick={() => setPaginaAtual(paginaAtual + 1)}
                            disabled={paginaAtual === totalDePaginas}
                        >
                            Próxima
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );

}

