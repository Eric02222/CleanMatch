import { useNavigate } from 'react-router-dom';

function Botao_login() {
    const navigate = useNavigate()

    const irPgLogin = () => {
        navigate("/Login")

    };

    return (
        <div onClick={irPgLogin} className='bnt_login'>Login</div>
    )
}

export default Botao_login