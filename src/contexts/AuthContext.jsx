import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify';

const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUserJson = localStorage.getItem("user");
        if (savedUserJson) {
            try {
                const savedUser = JSON.parse(savedUserJson);
                setUser(savedUser);
            } catch (e) {
                console.error("Erro ao analisar JSON do usuário:", e);
                localStorage.removeItem("user");
                setUser(null);
            }
        }
    }, [])

    const login = (userData, token) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token)
        setUser({ userData, token })
    }

    const logout = () => {
        toast.success("Voce saiu de sua conta", {
            autoClose: 3000,
            hideProgressBar: true,
            pauseOnHover: false
        })
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)