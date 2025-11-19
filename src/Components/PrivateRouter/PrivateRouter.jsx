import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

const PrivateRoute = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return <div>Carregando...</div>; 
    }

    if(!user){
        return <Navigate to='/' replace />
    }

    return <Outlet />;
}

export default PrivateRoute