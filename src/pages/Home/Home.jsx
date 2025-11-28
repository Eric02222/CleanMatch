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


    const totalDePaginas = Math.ceil(usuariosVisiveis.length / itensPorPagina);
    const ultimoItemIndex = paginaAtual * itensPorPagina;
    const primeiroItemIndex = ultimoItemIndex - itensPorPagina;
    const usuariosDaPagina = usuariosVisiveis.slice(primeiroItemIndex, ultimoItemIndex);


    return (
        <div className="flex flex-col min-h-screen">

            {user && mostrarAviso && (
                <div className="flex items-center justify-center mt-[90px] mx-auto mb-[-60px]">
                    <Aviso />
                </div>
            )}

            <div className="flex flex-col items-center p-[80px] flex-grow">
                <div className="flex flex-col justify-center w-full max-w-[1200px]">
                    <div className="flex gap-[10px] mb-[20px] mx-auto w-full max-w-[1100px] bg-white p-[10px] rounded-[8px] shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
                        <input
                            type="text"
                            placeholder="Buscar por nome, cidade ou estado"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-none outline-none p-[5px] text-[1em] w-full placeholder:text-[#999]"
                        />
                    </div>

                    <div className='qnt_itensPaginacao'>
                        <label className='msgIdicativa'>Exibir por:</label>

                        {[10, 15, 20, 25, 30].map(qnt => (
                            <button
                                key={qnt}
                                className={`bnt_qntItensPagina ${itensPorPagina === qnt ? 'active' : ''}`}
                                onClick={() => setItensPorPagina(qnt)}
                            >
                                {qnt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="main-content">

                    <div className="card-list">
                        {usuariosDaPagina.map((user) => {
                            const fotoUsuario = user.foto_perfil || defaultAvatar;
                            return (<Card
                                key={user.id}
                                data={user}
                                onClick={() => handleCardClick(user)}
                                isSelected={selectedCard === user}
                                onClose={() => setSelectedCard(null)}
                                fotoUrl={fotoUsuario}
                            />)
                        })}
                    </div>

                    {selectedCard && (() => {
                        const fotoUrl = selectedCard.foto_perfil || defaultAvatar;

                        return (


                            <div className='detalhe_usuarios'>
                                <div className="fechar-container" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>

                                    <div className="card-details">
                                        <button
                                            onClick={() => setSelectedCard(null)}
                                            title="Fechar detalhes"
                                        >
                                            X
                                        </button>
                                    </div>

                                    <div className='detalhes-topo'>
                                        <img className="fotoUserdetalhes" src={fotoUrl} alt="Avatar do Perfil" />
                                        <div className='infos-topo'>
                                            <p className='nome-detalhes'><strong>{selectedCard.nome}</strong></p>
                                            <p><strong>Email:</strong> {selectedCard.email}</p>
                                            <p><strong>Contato:</strong> {formatPhoneNumber(selectedCard.contato)}</p>

                                        </div>
                                    </div>

                                    <div className='detalhes-bottom'>

                                        <p><strong>CEP:</strong> {formatCepNumber(selectedCard.cep)}</p>
                                        <p><strong>Localização:</strong> {selectedCard.cidade}, {selectedCard.estado}</p>
                                        <p><strong>Rua:</strong> {selectedCard.rua}</p>
                                        <p><strong>Horário:</strong>{formatTime(selectedCard.cargaHoraria_inicio)} - {formatTime(selectedCard.cargaHoraria_fim)}</p>
                                        <p><strong>Faixa de Preço:</strong> R$ {selectedCard.valor_min} - R$ {selectedCard.valor_max}</p>
                                        <p><strong>Descrição:</strong> {selectedCard.descricao}</p>
                                    </div>
                                </div>


                            </div>

                        )
                    })()}

                </div>

                <div className='conteudo_bottom'>
                    <div className="controle_paginacao">
                        <button
                            onClick={() => setPaginaAtual(paginaAtual - 1)}
                            disabled={paginaAtual === 1}
                        >
                            Anterior
                        </button>
                        {Array.from({ length: totalDePaginas }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => setPaginaAtual(index + 1)}
                                className={paginaAtual === index + 1 ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
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

