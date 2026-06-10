import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem("user");
        setUser(null);
    }, []);

    useEffect(() => {
        const carregarUsuarioArmazenado = () => {
            const storedUser = localStorage.getItem("user");
            
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    // Optionally verify token validity here
                } catch (error) {
                    console.error("Erro ao ler dados do usuário:", error);
                    localStorage.removeItem("user"); 
                }
            }
            setLoading(false);
        };

        carregarUsuarioArmazenado();
    }, []);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const handleLogout = () => {
        logout();
        toast.success("Você saiu de sua conta", {
            autoClose: 3000,
            hideProgressBar: true,
            pauseOnHover: false
        });
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout: handleLogout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)