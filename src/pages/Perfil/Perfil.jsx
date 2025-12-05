import { useEffect, useState, useCallback } from 'react';
import { useAuth } from "../../contexts/AuthContext"
import { formatPhoneNumber, formatCepNumber, validarEmail, formatCurrency } from '../../Components/Formarte/Formarte.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Foto_de_perfil from '../../Components/FotoPerfil/FotoPerfil.jsx';

function Perfil() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate();

  // Extrai o token com segurança
  const token = user?.token;

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [accountData, setAccountData] = useState({});
  const [originalAccountData, setOriginalAccountData] = useState({});

  const [displayContato, setDisplayContato] = useState('');
  const [displayCep, setDisplayCep] = useState('');

  // Carrega os dados do usuário nos estados locais
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setAccountData(user);
      setOriginalAccountData(user);
      setDisplayContato(formatPhoneNumber(user.contato || ''));
      setDisplayCep(formatCepNumber(user.cep || ''));
    }
  }, [user]);

  // Proteção: Se user for null (ainda carregando ou não logado)
  if (!user) {
    return (
      <div className="container-perfil" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Carregando perfil...</h2>
        <p>Se demorar muito, por favor faça login novamente.</p>
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
          setAccountData((prevData) => ({
            ...prevData,
            estado: '',
            cidade: '',
            rua: '',
          }));
        }
      } catch (error) {
        toast.error('Erro ao buscar CEP.');
        console.error(error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let finalValue = value;

    if (name === 'valor_min' || name === 'valor_max') {
      finalValue = value === '' ? 0 : Number(value);
    }

    setAccountData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleContactChange = (e) => {
    const rawValue = e.target.value;
    const cleanedValue = rawValue.replace(/\D/g, '');
    const formattedValue = formatPhoneNumber(rawValue);

    setAccountData((prevData) => ({
      ...prevData,
      contato: cleanedValue,
    }));

    setDisplayContato(formattedValue);
  };

  const handleCepChange = (e) => {
    const rawValue = e.target.value;
    const cleanedValue = rawValue.replace(/\D/g, '');
    const formattedValue = formatCepNumber(rawValue);

    setAccountData((prevData) => ({
      ...prevData,
      cep: cleanedValue,
    }));
    setDisplayCep(formattedValue);

    if (cleanedValue.length === 8) {
      fetchAddressByCep(cleanedValue);
    }
  };

  const handleMoneyChange = (e) => {
    const { name, value } = e.target;

    const onlyDigits = value.replace(/\D/g, '');
    const numericValue = Number(onlyDigits) / 100;

    setAccountData((prevData) => ({
      ...prevData,
      [name]: numericValue,
    }));
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

  const handleSaveClick = () => {
    setShowSaveModal(true);
  };

  const confirmSave = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

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

      console.log("Enviando:", dadosParaEnviar);

      await axios.put(`http://localhost:4000/usuarios/${user.id}`, dadosParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      });


      setUser({ ...dadosParaEnviar, token: token });
      localStorage.setItem("user", JSON.stringify({ ...dadosParaEnviar, token: token }));

      setIsEditing(false);
      setShowSaveModal(false);
      toast.success('Dados salvos com sucesso!');
      setOriginalAccountData(dadosParaEnviar);

    } catch (error) {
      toast.error('Erro ao salvar dados.');
      console.error('Erro ao salvar:', error);
    }
  };

  const cancelSave = () => {
    setShowSaveModal(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async (e) => {
    if (e) e.preventDefault();
    try {

      await axios.delete(`http://localhost:4000/usuarios/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(null);
      setShowDeleteModal(false);
      localStorage.removeItem("user");
      navigate('/');
      toast.success('Conta excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir conta.');
      console.error(error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setAccountData((prevData) => ({
      ...prevData,
      tipo_conta: newType,
      ...(newType === 'Cliente' && {
        cargaHoraria_inicio: "",
        cargaHoraria_fim: "",
        valor_max: "",
        valor_min: "",
        descricao: "",
      })
    }));
  };

  return (
    <div className="flex flex-col text-[rgb(248,241,241)] font-sans pt-[55px]">

      {/* SEÇÃO DO PERFIL */}
      <div className="
      flex flex-col md:flex-row 
      bg-[#20c997] 
      w-full 
      items-center md:items-start 
      justify-center md:justify-start 
      gap-6 md:gap-[90px] 
      pt-6 md:pt-[2vh] 
      px-6 md:pl-[7vw] 
      shadow-[0_2px_5px_rgba(0,0,0,0.1)]
      h-auto md:h-[55vh]
  ">

        {/* FOTO */}
        <div className="w-[150px] h-[150px] md:w-auto md:h-auto flex-shrink-0">
          <Foto_de_perfil />
        </div>

        {/* INFO DO USUÁRIO */}
        <div className="text-center md:text-left mt-12 pb-3  md:mt-5">
          <h2 className="font-bold text-[4vh] md:text-[6vh]">{accountData?.nome}</h2>
          <p className="text-[18px] md:text-[30px]">
            <span className="font-bold">Email:</span> {accountData?.email}
          </p>

          <p className="text-[18px] md:text-[30px]">
            <span className="font-bold">Contato:</span> {displayContato}
          </p>

          <p className="text-[18px] md:text-[30px]">
            <span className="font-bold">Estado:</span> {accountData?.estado}
          </p>

          <p className="text-[18px] md:text-[30px]">
            <span className="font-bold">Cidade:</span> {accountData?.cidade}
          </p>

          {accountData?.tipo_conta === 'Prestador/a de Serviço' && (
            <>
              <p className="text-[18px] md:text-[30px]"><span className="font-bold">Horario:</span> {accountData?.cargaHoraria_inicio} - {accountData?.cargaHoraria_fim}</p>
              <p className="text-[18px] md:text-[30px]"> <span className="font-bold">Faixa de Preço:</span> {formatCurrency(accountData?.valor_min)} - {formatCurrency(accountData?.valor_max)}</p>
            </>
          )}
        </div>
      </div>

      {/* FORMULÁRIO DE DETALHES */}
      <div className="
      grid 
      grid-cols-1 sm:grid-cols-2 
      mx-auto my-8 
      text-[#0d0d0d] 
      gap-y-6 gap-x-10 
      w-[90vw] sm:w-[85vw] md:w-[80vw] 
      p-6 
      bg-[#fefefe] 
      rounded-[8px] 
      shadow-[0_4px_10px_rgba(0,0,0,0.1)]
  ">

        <div className="col-span-full text-center mb-4">
          <h1 className="text-[28px] md:text-[40px]">Detalhes da Conta</h1>
        </div>

        {/* CAMPO - REAPROVEITADO POR TODOS OS INPUTS */}
        {[
          {
            id: "tipo_conta",
            label: "Tipo de Conta:",
            element: (
              <select
                id="tipo_conta"
                className="input-base"
                value={accountData?.tipo_conta || ''}
                onChange={handleTypeChange}
                disabled={!isEditing}
              >
                <option value="Cliente">Cliente</option>
                <option value="Prestador/a de Serviço">Prestador/a de Serviço</option>
              </select>
            )
          },
          {
            id: "nome",
            label: "Nome:",
            element: (
              <input
                type="text"
                name="nome"
                id="nome_detalhes"
                className="input-base"
                value={accountData?.nome || ''}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            )
          },
          {
            id: "email",
            label: "E-mail:",
            element: (
              <input
                type="email"
                name="email"
                id="email"
                className="input-base"
                value={accountData?.email || ''}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            )
          },
          {
            id: "contato",
            label: "Contato:",
            element: (
              <input
                type="text"
                name='contato'
                id="contato"
                className="input-base"
                value={displayContato || ''}
                onChange={handleContactChange}
                readOnly={!isEditing}
                maxLength="15"
              />
            )
          },
          {
            id: "cep",
            label: "CEP:",
            element: (
              <input
                id="cep"
                name='cep'
                className="input-base"
                value={displayCep || ''}
                onChange={handleCepChange}
                readOnly={!isEditing}
                maxLength="9"
              />
            )
          },
          {
            id: "estado",
            label: "Estado:",
            element: (
              <input
                id="estado"
                name='estado'
                className="input-base"
                value={accountData?.estado || ''}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            )
          },
          {
            id: "cidade",
            label: "Cidade:",
            element: (
              <input
                id="cidade"
                name='cidade'
                className="input-base"
                value={accountData?.cidade || ''}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            )
          },
          {
            id: "rua",
            label: "Rua:",
            element: (
              <input
                id="rua"
                name='rua'
                className="input-base"
                value={accountData?.rua || ''}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            )
          }
        ].map((field) => (
          <div key={field.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 pr-2">
            <label className="text-[16px] md:text-[18px] font-bold sm:mr-[10px] w-full sm:w-[250px]">
              {field.label}
            </label>
            {field.element}
          </div>
        ))}

        {/* CAMPOS EXTRAS PARA PRESTADOR */}
        {accountData?.tipo_conta === "Prestador/a de Serviço" && (
          <>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pr-2">
              <label className="label" id="cargaHoraria_inicio">Carga Horária Início:</label>
              <input type="time" name='cargaHoraria_inicio' id="cargaHoraria_inicio" className="input-base " value={accountData?.cargaHoraria_inicio || ''} onChange={handleInputChange} readOnly={!isEditing} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pr-2">
              <label className="label" id="cargaHoraria_fim">Carga Horária Fim:</label>
              <input type="time" name='cargaHoraria_fim' id="cargaHoraria_fim" className="input-base" value={accountData?.cargaHoraria_fim || ''} onChange={handleInputChange} readOnly={!isEditing} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pr-2">
              <label className="label" id='valor_min'>Valor Mínimo:</label>
              <input id="valor_min" name="valor_min" className="input-base" value={formatCurrency(accountData?.valor_min)} onChange={handleMoneyChange} readOnly={!isEditing} maxLength="18" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pr-2">
              <label className="label" id='valor_max'>Valor Máximo:</label>
              <input id="valor_max" name='valor_max' className="input-base" value={formatCurrency(accountData?.valor_max)} onChange={handleMoneyChange} readOnly={!isEditing} maxLength="18" />
            </div>

            <div className="flex flex-col sm:flex-row items-start justify-end gap-2 pr-2">
              <label className="label" id='descricao'>Descrição:</label>
              <textarea id="descricao" name='descricao' maxlength="500" className="input-base min-h-[80px]" value={accountData?.descricao || ''} onChange={handleInputChange} readOnly={!isEditing} />
            </div>
          </>
        )}

        {/* BOTÕES */}
        <div className="col-span-full flex flex-wrap items-center justify-center gap-6 py-4">

          {!isEditing ? (
            <>
              <button onClick={handleEditClick} className="btn-primary w-[120px]">Editar</button>
              <button onClick={handleDeleteClick} className="btn-danger px-5 py-2 min-w-[140px]">Excluir Conta</button>
            </>
          ) : (
            <>
              <button onClick={handleSaveClick} className="btn-primary w-[150px]">Salvar Edição</button>
              <button onClick={handleCancelEdit} className="btn-danger w-[180px]">Cancelar Edição</button>
            </>
          )}

        </div>

        {/* MODAIS */}
        {/* (não modifiquei—funcionam em todas telas automaticamente) */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Confirmar Exclusão</h3>
              <p>Tem certeza que deseja excluir sua conta?</p>
              <div className="flex gap-4 pt-4">
                <button onClick={confirmDelete} className="btn-primary">Sim, Deletar</button>
                <button onClick={cancelDelete} className="btn-danger">Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {showSaveModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Salvar Alterações</h3>
              <p>Deseja salvar as alterações?</p>
              <div className="flex gap-4 pt-4">
                <button onClick={confirmSave} className="btn-primary">Sim, Salvar</button>
                <button onClick={cancelSave} className="btn-danger">Continuar Editando</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>

  );
}

export default Perfil;