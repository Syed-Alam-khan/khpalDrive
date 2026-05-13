import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isDetailPage = location.pathname.startsWith('/detail/');
  const isSellPage = location.pathname === '/sell';

  return (
    <div className={`flex flex-col ${isLoginPage ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Header />
      <main className="flex-grow pt-[56px] md:pt-[72px]">
        {children}
      </main>
      {(!isHomePage && !isDetailPage && !isSellPage) && <Footer />}
    </div>
  );
};

export default MainLayout;
