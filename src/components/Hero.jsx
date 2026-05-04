import React from 'react';

const Hero = () => {
  return (
    <section className="hidden md:block bg-white py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1a1a1a] leading-tight">
            Simple, fast, & <br />
            built for your <br />
            local market <br />
            <span className="text-[#4B2DBD]">NCP Cars.</span>
          </h1>
        </div>

        {/* Hero Image */}
        <div className="flex-1 flex justify-end">
          <img 
            src="/cars/hero.png" 
            alt="Hero Car" 
            className="w-full h-auto object-contain max-w-xl ml-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
