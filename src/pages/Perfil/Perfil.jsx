import { useEffect, useState, useCallback } from 'react';
import { useAuth } from "../../contexts/AuthContext"
import { formatPhoneNumber, formatCepNumber, validarEmail, formatCurrency } from '../../Components/Formarte/Formarte.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Foto_de_perfil from '../../Components/FotoPerfil/FotoPerfil.jsx';
import { HiPencilAlt, HiTrash, HiSave, HiX, HiLocationMarker, HiClock, HiCurrencyDollar, HiIdentification } from "react-icons/hi";

function Perfil() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [accountData, setAccountData] = useState({});
  const [originalAccountData, setOriginalAccountData] = useState({});

  const [displayContato, setDisplayContato] = useState('');
  const [displayCep, setDisplayCep] = useState('');

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setAccountData(user);
      setOriginalAccountData(user);
      setDisplayContato(formatPhoneNumber(user.contato || ''));
      setDisplayCep(formatCepNumber(user.cep || ''));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-slate-500">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }

  const fetchAddressByCep = useCallback(async (cep) => {
    const cleanedCep = cep.replace(/\D/g, '');

    if (cleanedCep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cleanedCep}/json/`);
        const data = response.data;

        if (!data.erro) {
          setAccountData((prevData) => ({
            ...prevData,
            estado: data.uf,
            cidade: data.localidade,
            rua: data.logradouro
          }));
        } else {
          toast.error('CEP não encontrado.', { autoClose: 3000 });
        }
      } catch (error) {
        toast.error('Erro ao buscar CEP.');
        console.error(error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleContactChange = (e) => {
    const rawValue = e.target.value;
    const cleanedValue = rawValue.replace(/\D/g, '');
    const formattedValue = formatPhoneNumber(rawValue);
    setAccountData((prevData) => ({ ...prevData, contato: cleanedValue }));
    setDisplayContato(formattedValue);
  };

  const handleCepChange = (e) => {
    const rawValue = e.target.value;
    const cleanedValue = rawValue.replace(/\D/g, '');
    const formattedValue = formatCepNumber(rawValue);
    setAccountData((prevData) => ({ ...prevData, cep: cleanedValue }));
    setDisplayCep(formattedValue);
    if (cleanedValue.length === 8) fetchAddressByCep(cleanedValue);
  };

  const handleMoneyChange = (e) => {
    const { name, value } = e.target;
    const onlyDigits = value.replace(/\D/g, '');
    const numericValue = Number(onlyDigits) / 100;
    setAccountData((prevData) => ({ ...prevData, [name]: numericValue }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setOriginalAccountData(accountData);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setAccountData(originalAccountData);
    setDisplayContato(formatPhoneNumber(originalAccountData.contato || ''));
    setDisplayCep(formatCepNumber(originalAccountData.cep || ''));
  };

  const confirmSave = async (e) => {
    if (e) e.preventDefault();
    try {
      if (!accountData.email || !validarEmail(accountData.email)) {
        toast.error('Email inválido');
        setShowSaveModal(false);
        return;
      }

      const dadosParaEnviar = {
        ...accountData,
        valor_min: Number(accountData.valor_min || 0).toFixed(2),
        valor_max: Number(accountData.valor_max || 0).toFixed(2),
        contato: accountData.contato?.toString().replace(/\D/g, '') || "",
        cep: accountData.cep?.toString().replace(/\D/g, '') || "",
      };

      await api.put(`/usuarios/${user.id}`, dadosParaEnviar);

      const updatedUser = { ...dadosParaEnviar, token: user.token };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsEditing(false);
      setShowSaveModal(false);
      toast.success('Perfil atualizado com sucesso!');
      setOriginalAccountData(dadosParaEnviar);
    } catch (error) {
      toast.error('Erro ao salvar dados.');
    }
  };

  const confirmDelete = async (e) => {
    if (e) e.preventDefault();
    try {
      await api.delete(`/usuarios/${user.id}`);
      setUser(null);
      setShowDeleteModal(false);
      localStorage.removeItem("user");
      navigate('/');
      toast.success('Conta excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir conta.');
    }
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setAccountData((prevData) => ({
      ...prevData,
      tipo_conta: newType,
      ...(newType === 'CLIENTE' && {
        cargaHoraria_inicio: "",
        cargaHoraria_fim: "",
        valor_max: "",
        valor_min: "",
        descricao: "",
      })
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER PROFILE CARD */}
        <div className="bg-brand-primary rounded-[40px] p-8 md:p-12 text-white shadow-2xl shadow-brand-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="relative group">
                    <Foto_de_perfil />
                    <div className="absolute inset-0 rounded-full border-4 border-white/20 scale-110"></div>
                </div>

                <div className="text-center md:text-left space-y-4">
                    <div className="space-y-1">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest">
                            {accountData?.tipo_conta}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">{accountData?.nome}</h1>
                    </div>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 text-white/80 font-medium">
                        <div className="flex items-center gap-2">
                            <HiLocationMarker className="text-white" />
                            <span>{accountData?.cidade || 'Localização não definida'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HiIdentification className="text-white" />
                            <span>{accountData?.email}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                        {!isEditing ? (
                            <button onClick={handleEditClick} className="btn-info px-8 !shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2">
                                <HiPencilAlt className="text-xl" /> Editar Perfil
                            </button>
                        ) : (
                            <>
                                <button onClick={() => setShowSaveModal(true)} className="btn-success px-8 !shadow-green-500/20 hover:scale-105 transition-all flex items-center gap-2">
                                    <HiSave className="text-xl" /> Salvar Alterações
                                </button>
                                <button onClick={handleCancelEdit} className="btn-secondary px-8 hover:scale-105 transition-all flex items-center gap-2">
                                    <HiX className="text-xl" /> Cancelar
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: ABOUT */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black text-slate-900">Informações Pessoais</h2>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><HiIdentification className="text-xl" /></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="label">Nome Completo</label>
                            <input name="nome" className="input-base" value={accountData?.nome || ''} onChange={handleInputChange} readOnly={!isEditing} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="label">E-mail de Contato</label>
                            <input name="email" className="input-base" value={accountData?.email || ''} onChange={handleInputChange} readOnly={!isEditing} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="label">Telefone / WhatsApp</label>
                            <input className="input-base" value={displayContato || ''} onChange={handleContactChange} readOnly={!isEditing} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="label">Tipo de Conta</label>
                            <select className="input-base" value={accountData?.tipo_conta || ''} onChange={handleTypeChange} disabled={!isEditing}>
                                <option value="CLIENTE">Cliente</option>
                                <option value="PROFISSIONAL">Profissional</option>
                            </select>
                        </div>
                    </div>
                </div>

                {accountData?.tipo_conta === "PROFISSIONAL" && (
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-slate-900">Detalhes do Serviço</h2>
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><HiClock className="text-xl" /></div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="label">Disponibilidade (Início)</label>
                                    <input type="time" name="cargaHoraria_inicio" className="input-base" value={accountData?.cargaHoraria_inicio || ''} onChange={handleInputChange} readOnly={!isEditing} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="label">Disponibilidade (Fim)</label>
                                    <input type="time" name="cargaHoraria_fim" className="input-base" value={accountData?.cargaHoraria_fim || ''} onChange={handleInputChange} readOnly={!isEditing} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="label">Preço Mínimo /h</label>
                                    <input className="input-base" value={formatCurrency(accountData?.valor_min)} onChange={handleMoneyChange} name="valor_min" readOnly={!isEditing} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="label">Preço Máximo /h</label>
                                    <input className="input-base" value={formatCurrency(accountData?.valor_max)} onChange={handleMoneyChange} name="valor_max" readOnly={!isEditing} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="label">Descrição Profissional</label>
                                <textarea name="descricao" className="input-base min-h-[120px] resize-none" placeholder="Conte um pouco sobre sua experiência e serviços..." value={accountData?.descricao || ''} onChange={handleInputChange} readOnly={!isEditing} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN: LOCATION & ACTIONS */}
            <div className="space-y-8">
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black text-slate-900">Localização</h2>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><HiLocationMarker className="text-xl" /></div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="label">CEP</label>
                            <input className="input-base" value={displayCep || ''} onChange={handleCepChange} readOnly={!isEditing} maxLength="9" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="label">Estado</label>
                            <input name="estado" className="input-base" value={accountData?.estado || ''} onChange={handleInputChange} readOnly={!isEditing} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="label">Cidade</label>
                            <input name="cidade" className="input-base" value={accountData?.cidade || ''} onChange={handleInputChange} readOnly={!isEditing} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="label">Rua / Bairro</label>
                            <input name="rua" className="input-base" value={accountData?.rua || ''} onChange={handleInputChange} readOnly={!isEditing} />
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 rounded-[32px] p-8 border border-red-100">
                    <h3 className="text-lg font-black text-red-900 mb-2">Zona de Perigo</h3>
                    <p className="text-red-700 text-sm font-medium mb-6">Ao excluir sua conta, todos os seus dados serão removidos permanentemente.</p>
                    <button onClick={() => setShowDeleteModal(true)} className="w-full py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                        <HiTrash /> Excluir Conta
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* MODALS */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box !max-w-md">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiTrash className="text-3xl" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Confirmar Exclusão</h3>
            <p className="text-slate-500 font-medium mb-8">Esta ação não pode ser desfeita. Tem certeza que deseja deletar sua conta permanentemente?</p>
            <div className="flex gap-4 w-full">
              <button onClick={confirmDelete} className="flex-1 btn-danger">Sim, Deletar</button>
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 btn-secondary border-slate-200 text-slate-600">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className="modal-overlay">
          <div className="modal-box !max-w-md">
            <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <HiSave className="text-3xl" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Salvar Alterações?</h3>
            <p className="text-slate-500 font-medium mb-8">Deseja atualizar seu perfil com as novas informações fornecidas?</p>
            <div className="flex gap-4 w-full">
              <button onClick={confirmSave} className="flex-1 btn-primary">Sim, Salvar</button>
              <button onClick={() => setShowSaveModal(false)} className="flex-1 btn-secondary border-slate-200 text-slate-600">Continuar Editando</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;
