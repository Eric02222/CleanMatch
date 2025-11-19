import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify';

const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        const carregarUsuarioArmazenado = () => {
            const storedUser = localStorage.getItem("user");
            
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                } catch (error) {
                    console.error("Erro ao ler dados do usuário:", error);
                    localStorage.removeItem("user"); 
                }
            }
            setLoading(false); // Terminou de carregar
        };

        carregarUsuarioArmazenado();
    }, []);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser( userData )
    }

    const logout = () => {
        toast.success("Voce saiu de sua conta", {
            autoClose: 3000,
            hideProgressBar: true,
            pauseOnHover: false
        })
        localStorage.removeItem("user")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)