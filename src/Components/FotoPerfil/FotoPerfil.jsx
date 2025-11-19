import { useEffect, useState } from 'react';
import { useAuth } from "../../contexts/AuthContext"
// import UserIcon from '../assets/icons/user-icon.svg';
import axios from 'axios';
import { toast } from 'react-toastify';

function Foto_de_perfil() {
    const { user, setUser } = useAuth();
    const token = user?.token;
    const [fotoPreview, setFotoPreview] = useState(user?.foto_perfil || null);

    // const defaultAvatar = UserIcon;

    useEffect(() => {
        if (user) {
            setFotoPreview(user.foto_perfil);
        }
    }, [user]);

    const enviar_foto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Limite de tamanho (opcional, ex: 2MB)
        // if (file.size > 2 * 1024 * 1024) {
        //     return toast.error("A imagem deve ter no máximo 2MB.");
        // }

        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64String = reader.result; 

            try {
                
                const dadosAtualizados = {
                    ...user, 
                    foto_perfil: base64String 
                };

                const response = await axios.put(`http://localhost:4000/usuarios/${user.id}`, dadosAtualizados, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200 || response.status === 201) {
                    setFotoPreview(base64String);
                    setUser({ ...dadosAtualizados, token: token });
                    
                    localStorage.setItem("user", JSON.stringify({ ...dadosAtualizados, token: token }));

                    toast.success("Foto de perfil atualizada!");
                }

            } catch (error) {
                console.error('Erro ao Enviar foto:', error);
                toast.error("Erro ao salvar a foto.");
            }
        };
        
        reader.readAsDataURL(file);
    };

   
    return (
        <div className='container_fotoPerfil'>
            <div>
                {/* <img id="img-perfil"  key={imagemKey} src={fotoPerfil ? fotoPerfil.foto : defaultAvatar} alt="Avatar do Perfil" /> */}

            </div>

            <div className='espaço_input'>
                <label htmlFor="inputFoto">Enviar Foto</label>
                <input type="file" id="inputFoto" className='inputFoto' accept="image/*" onChange={enviar_foto} />
            </div>

        </div>
    )
}

export default Foto_de_perfil