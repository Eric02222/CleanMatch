import { useEffect, useState } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import axios from 'axios';
import { toast } from 'react-toastify';
import UserIcon from '../../assets/icons/user-icon.svg';


const defaultAvatar = UserIcon;

function Foto_de_perfil() {
    const { user, setUser } = useAuth();
    const token = user?.token;

    // Estado inicial tenta pegar a foto do usuário ou null
    const [fotoPreview, setFotoPreview] = useState(null);

    useEffect(() => {
        if (user?.foto_perfil && user.foto_perfil.length > 10) {
            setFotoPreview(user.foto_perfil);
        } else {
            setFotoPreview(null);
        }
    }, [user]);

    const enviar_foto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validação de tamanho (Ex: 2MB) - Recomendado descomentar
        if (file.size > 2 * 1024 * 1024) {
            return toast.error("A imagem deve ter no máximo 2MB.");
        }

        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64String = reader.result;

            // Atualiza o preview imediatamente para dar feedback visual
            setFotoPreview(base64String);

            try {
                // OTIMIZAÇÃO: Enviar apenas o campo que mudou para a API
                const payload = {
                    foto_perfil: base64String
                };

                const response = await axios.put(
                    `http://localhost:4000/usuarios/${user.id}`,
                    payload,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.status === 200 || response.status === 201) {
                    // Atualiza o contexto global e o LocalStorage
                    const usuarioAtualizado = { ...user, foto_perfil: base64String };

                    setUser(usuarioAtualizado);
                    localStorage.setItem("user", JSON.stringify(usuarioAtualizado));

                    toast.success("Foto de perfil atualizada!");
                }

            } catch (error) {
                console.error('Erro ao Enviar foto:', error);
                // Se der erro, volta a foto para o estado anterior (opcional)
                setFotoPreview(user?.foto_perfil || null);
                toast.error("Erro ao salvar a foto. Tente uma imagem menor.");
            }
        };

        reader.readAsDataURL(file);
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = UserIcon || BACKUP_AVATAR_URL;
    };

    return (
        <div className="flex flex-col justify-center items-center gap-3 py-10">

            {/* Área da Imagem */}
            <img
                id="img-perfil"
                src={fotoPreview || defaultAvatar}
                alt="Avatar do Perfil"
                onError={handleImageError}
                className="
        w-[150px] h-[150px]
        md:w-[220px] md:h-[220px]
        lg:w-[320px] lg:h-[320px]
        rounded-full object-cover border-2 border-[#ccc] bg-[#434343]"
            />

            {/* Botão/Input */}
            <div className="flex flex-col items-center text-center">
                <label
                    htmlFor="inputFoto"
                    className="font-bold text-[18px] mt-[-10px] md:text-[22px] cursor-pointer transition duration-300 hover:scale-110"
                >
                    Alterar Foto
                </label>

                <input
                    type="file"
                    id="inputFoto"
                    className="hidden"
                    accept="image/*"
                    onChange={enviar_foto}
                />
                
            </div>
        </div>

    )
}

export default Foto_de_perfil;