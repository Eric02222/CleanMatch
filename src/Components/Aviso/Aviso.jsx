import { HiOutlineExclamationCircle } from "react-icons/hi";

function Aviso() {
  return (
    <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-2xl p-4 gap-4 shadow-sm max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                <HiOutlineExclamationCircle className="text-2xl" />
            </div>
            <div>
                <h4 className="font-bold text-amber-900 text-sm">Perfil Incompleto</h4>
                <p className="text-amber-700 text-xs font-medium">
                    Algumas informações estão faltando. Preencha seu perfil para aparecer nas buscas!
                </p>
            </div>
        </div>
        <button 
            onClick={() => window.location.href='/Perfil'}
            className="btn-warning !h-10 !px-4 !text-[10px] !rounded-xl uppercase tracking-widest shrink-0"
        >
            <span>Completar agora</span>
        </button>
    </div>
  )
}

export default Aviso