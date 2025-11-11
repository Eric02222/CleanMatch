import { useNavigate } from 'react-router-dom';

function Botao_login() {
    const navigate = useNavigate()

    const irPgLogin = () => {
        navigate("/Login")

    };

    return (
        <button onClick={irPgLogin} className='bnt_login'>Login</button>
    )
}

export default Botao_login