import { formatTime } from '../Formarte/Formarte.js';

export const Card = ({ data, onClick, isSelected, fotoUrl, onError }) => {

    return (
        <div   className={`
            /* --- Lógica de Borda (Selecionado vs Hover) --- */
            ${isSelected 
                ? 'border-2 border-[#20c997] bg-green-50/10' // Se selecionado
                : 'border border-transparent hover:border-[#20c997]/30' // Se não selecionado (Borda suave no hover)
            }
            
            /* --- Layout Base --- */
            group  /* <--- Importante para o efeito da imagem */
            relative flex flex-col items-start bg-white rounded-[12px] 
            text-[18px] gap-[3px] cursor-pointer p-[2px] w-full overflow-hidden
            
            /* --- Animações do Card --- */
            transition-all duration-300 ease-out
            hover:-translate-y-1 
            shadow-[0_2px_8px_rgba(0,0,0,0.08)] 
            hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] /* Sombra mais elegante */
          `} onClick={onClick}>
            <div className="flex gap-[20px] w-full">
                <img className=" transition-transform duration-500 ease-out
                            group-hover:scale-110 w-[100px] h-[140px] md:w-[150px] md:h-[200px] rounded-l-[5px] object-cover bg-[#434343] flex-shrink-0" onError={onError} src={fotoUrl} alt="Avatar do Perfil" />
                
                <div className="w-full min-w-0 flex flex-col justify-between py-2 pr-2">
                    <h2 className="text-[1.1em] md:text-[1.5em] font-bold truncate leading-tight group-hover:text-[#20c997] transition-colors duration-300">{data.nome}</h2>
                    <p className="my-[3px] text-[#555] leading-[1.3] text-[0.85em] md:text-[1em]"><strong className="text-[#333]">Email:</strong> {data.email}</p>
                    <p className="my-[3px] text-[#555] leading-[1.3] text-[0.85em] md:text-[1em]"><strong className="text-[#333]">Localização:</strong> {data.cidade} | {data.estado}</p>
                    <p className="my-[3px] text-[#555] leading-[1.3] text-[0.85em] md:text-[1em]"><strong className="text-[#333]">Horário:</strong> {formatTime(data.cargaHoraria_inicio)} - {formatTime(data.cargaHoraria_fim)}</p>
                    <div className="flex justify-end mt-2">
                        <p className="bg-[#20c997] text-white rounded-[20px] 
                            px-[10px] py-[6px] md:px-[15px] md:py-[8px]
                            text-[0.75em] md:text-[0.85em] font-bold 
                            text-center break-words w-fit max-w-full
                            cursor-pointer hover:bg-[#1a9c78]
                            shadow-sm transition-all duration-300 
                            group-hover:bg-[#168d69] group-hover:shadow-md group-hover:scale-105
                        "><strong>R$ {data.valor_min} - R$ {data.valor_max}</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};