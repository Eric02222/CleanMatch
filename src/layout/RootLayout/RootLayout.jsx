// src/layout/RootLayout.jsx
import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header.jsx' 

export const RootLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};