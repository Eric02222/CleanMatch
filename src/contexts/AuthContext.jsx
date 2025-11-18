import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify';

const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState("");

    const [usuarioLogado, setUsuarioLogado] = useState(() => {
        const usuarioSalvo = localStorage.getItem('usuarioLogado')
        return usuarioSalvo ? JSON.parse(usuarioSalvo) : null
    })

    // se ja tiver no localstorage, mantem login

    useEffect(() => {
        const savedEmail = localStorage.getItem("email")
        if (savedEmail) {
            setUser({ email: savedEmail })
        }
    }, [])

    const login = (email, token) => {
        localStorage.setItem("email", email)
        localStorage.setItem("token", token)
        setUser({ email, token })
    }

    const logout = () => {
        toast.success("Voce saiu de sua conta", {
            autoClose: 3000,
            hideProgressBar: true,
            pauseOnHover: false
        })
        localStorage.removeItem("email")
        localStorage.removeItem("token")
        setUser("")
    }

    return (
        <AuthContext.Provider value={{usuarioLogado, setUsuarioLogado, user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)