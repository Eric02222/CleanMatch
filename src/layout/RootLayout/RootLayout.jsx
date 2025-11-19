// src/layout/RootLayout.jsx
import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header.jsx' 
import { AuthProvider } from "../../contexts/AuthContext";

export const RootLayout = () => {
  return (
    <AuthProvider>
      <Header />
      <main>
        <Outlet />
      </main>
    </AuthProvider>
  );
};