import { formatTime } from '../Formarte/Formarte.js';
import UserIcon from '../../assets/icons/user-icon.svg';
const defaultAvatar = UserIcon;

export const Card = ({ data, onClick, isSelected, fotoUrl }) => {

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = defaultAvatar || BACKUP_AVATAR_URL;
    };

    return (
        <div className={`card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
            <div className='elementos-card'>
                <img className="fotoUserHome" onError={handleImageError} src={fotoUrl} alt="Avatar do Perfil" />
                
                <div className='basic_info'>
                    <h2>{data.nome}</h2>
                    <p><strong>Email:</strong> {data.email}</p>
                    <p><strong>Localização:</strong> {data.cidade} | {data.estado}</p>
                    <p><strong>Horário:</strong> {formatTime(data.cargaHoraria_inicio)} - {formatTime(data.cargaHoraria_fim)}</p>
                    <div className='contianer-valorServico'>
                        <p className="price-button"><strong>R$ {data.valor_min} - R$ {data.valor_max}</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};