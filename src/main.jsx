
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

//react router
import { RouterProvider } from 'react-router'
import { createBrowserRouter } from "react-router";
import Main from "../layout/Main/Main.jsx";
import { Home } from "../pages/Home/Home.jsx";
import { Login } from "../pages/Login/Login.jsx";
import { Cadastro } from "../pages/Cadastro/Cadastro.jsx";
import { Perfil } from "../pages/Perfil/Perfil.jsx";

const router = createBrowserRouter([
    {
        element: <Main/>,
        children: [
            {path: "/", element: <Home />},
            {path: "/Login", element: <Login />},
            {path: "/Cadastro", element: <Cadastro />},
            {path: "/Perfil", element: <Perfil />},
        ]
    }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
    <ToastContainer />
  </StrictMode>,
)
