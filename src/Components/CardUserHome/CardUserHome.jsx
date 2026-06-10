import { formatTime } from '../Formarte/Formarte.js';
import { HiLocationMarker, HiClock, HiCurrencyDollar } from "react-icons/hi";

export const Card = ({ data, onClick, isSelected, fotoUrl, onError }) => {

    return (
        <div 
            onClick={onClick}
            className={`
                group relative flex bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-300
                ${isSelected 
                    ? 'ring-4 ring-brand-primary shadow-2xl translate-x-2' 
                    : 'border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-brand-primary/20'
                }
            `}
        >
            <div className="relative w-32 md:w-48 flex-shrink-0 overflow-hidden">
                <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    onError={onError} 
                    src={fotoUrl} 
                    alt={data.nome} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="flex-grow p-5 md:p-6 flex flex-col justify-between min-w-0">
                <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 truncate group-hover:text-brand-primary transition-colors">
                            {data.nome}
                        </h2>
                        <span className="hidden md:inline-block px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
                            {data.tipo_conta}
                        </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-1">
                            <HiLocationMarker className="text-brand-primary" />
                            <span className="truncate">{data.cidade}, {data.estado}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <HiClock className="text-brand-primary" />
                            <span>{formatTime(data.cargaHoraria_inicio)} - {formatTime(data.cargaHoraria_fim)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-brand-primary">
                        <HiCurrencyDollar className="text-xl" />
                        <span className="text-lg font-black tracking-tight">
                            R$ {data.valor_min} - {data.valor_max}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">/ hora</span>
                    </div>
                    
                    <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                        ${isSelected ? 'bg-brand-primary text-white rotate-0' : 'bg-slate-50 text-slate-300 group-hover:bg-brand-primary/10 group-hover:text-brand-primary -rotate-45 group-hover:rotate-0'}
                    `}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};
