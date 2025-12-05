
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

//react router
import { RouterProvider } from 'react-router'
import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home/Home.jsx";
import { Login } from "./pages/Login/Login.jsx";
import { Cadastro } from "./pages/Cadastro/Cadastro.jsx";
import PrivateRoute from './Components/PrivateRouter/PrivateRouter.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Perfil from './pages/Perfil/Perfil.jsx'
import { RootLayout } from './layout/RootLayout/RootLayout.jsx';
import { ToastContainer } from 'react-toastify';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,

    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "Login",
        element: <Login />,
      },
      {
        path: "Cadastro",
        element: <Cadastro />,
      },
      {
        element: (
          <PrivateRoute />
        ),
        children: [
          { path: 'perfil', element: <Perfil /> },
        ]

      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false} />
    </AuthProvider>
  </StrictMode>,
)
