import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-[56px] md:pt-[72px]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
