import WarningIcon from '../../assets/icons/warning.svg';

function Aviso() {
  return (
<div className="
    flex items-center justify-center
    bg-[rgb(245,255,245)]
    shadow-[0_2px_5px_rgba(0,0,0,0.1)]
    border-2 border-[#d6da10]
    rounded-[8px]

    w-[90%]          /* MOBILE: ocupa 90% da largura da tela */
    max-w-[550px]    /* DESKTOP: não passa de 550px */
    h-auto           /* altura automática para textos maiores */
    min-h-[45px]     /* altura mínima igual à antiga */

    px-4 py-2        /* padding responsivo */
    gap-3
">
    <img className="w-[22px] h-[22px]" src={WarningIcon} alt="icone-aviso" />

    <p className="text-[17px] sm:text-[16px] md:text-[18px] font-bold text-center">
        Por favor, preencha todas as suas informações de perfil
    </p>
</div>
  )
}

export default Aviso