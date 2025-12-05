import { formatTime } from '../Formarte/Formarte.js';
import UserIcon from '../../assets/icons/user-icon.svg';
const defaultAvatar = UserIcon;

export const Card = ({ data, onClick, isSelected, fotoUrl }) => {

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = defaultAvatar || BACKUP_AVATAR_URL;
    };

    return (
        <div   className={`
            ${isSelected ? 'border-2 border-[#20c997]' : 'border border-transparent'}
            flex flex-col items-start bg-white rounded-[8px] shadow-[0_2px_5px_rgba(0,0,0,0.1)]
            text-[18px] gap-[3px] cursor-pointer p-[2px]
            transition-transform duration-200 ease-in-out
            hover:-translate-y-[3px] hover:scale-[1.01] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)]
          `} onClick={onClick}>
            <div className="flex gap-[20px] w-full">
                <img className="w-[150px] rounded-l-[5px] object-cover" onError={handleImageError} src={fotoUrl} alt="Avatar do Perfil" />
                
                <div className="w-full">
                    <h2>{data.nome}</h2>
                    <p className="my-[5px] text-[#555] leading-[1.5]"><strong className="text-[#333]">Email:</strong> {data.email}</p>
                    <p className="my-[5px] text-[#555] leading-[1.5]"><strong className="text-[#333]">Localização:</strong> {data.cidade} | {data.estado}</p>
                    <p className="my-[5px] text-[#555] leading-[1.5]"><strong className="text-[#333]">Horário:</strong> {formatTime(data.cargaHoraria_inicio)} - {formatTime(data.cargaHoraria_fim)}</p>
                    <div className="flex justify-end">
                        <p className="flex items-center justify-center bg-[#20c997] text-white rounded-[20px] w-[200px] px-[15px] py-[8px] mt-[10px] mr-[5px] mb-[5px] text-[0.85em] font-bold cursor-pointer transition-colors duration-300 hover:bg-[#1a9c78]"><strong>R$ {data.valor_min} - R$ {data.valor_max}</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};