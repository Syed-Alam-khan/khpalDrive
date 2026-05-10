import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';

  return (
    <div className={`flex flex-col bg-white ${isLoginPage ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Header />
      <main className={`flex-grow pt-[56px] md:pt-[72px] ${isLoginPage ? 'bg-white' : ''}`}>
        {children}
      </main>
      {!isHomePage && <Footer />}
    </div>
  );
};

export default MainLayout;
