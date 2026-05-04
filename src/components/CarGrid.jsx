import { useState } from 'react';
import CarCard from './CarCard';

export default function CarGrid({ cars }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const displayedCars = isExpanded ? cars : cars.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-12 mt-12 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {displayedCars.map(car => (
          <div key={car.id} className="animate-in fade-in zoom-in-95 duration-500">
            <CarCard car={car} />
          </div>
        ))}
      </div>
      <div className="mt-20 flex justify-center">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-16 py-5 rounded-3xl font-black transition-all active:scale-95 shadow-2xl shadow-blue-200 text-lg flex items-center gap-3"
        >
          {isExpanded ? 'Show less' : 'Show all'}
          <svg 
            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
