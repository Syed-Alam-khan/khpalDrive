import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import SearchFilter from '../components/SearchFilter';
import CarCard from '../components/CarCard';
import PartCard from '../components/PartCard';
import { useCar } from '../context/CarContext';
import { useCategory } from '../context/CategoryContext';
import { useAutoPart } from '../context/AutoPartContext';
import { FaChevronRight, FaCar, FaTools } from 'react-icons/fa';

export default function Home() {
  const { cars, getAllCars, loading: carsLoading } = useCar();
  const { parts, getAllParts, loading: partsLoading } = useAutoPart();
  const { getAllCategories } = useCategory();
  const [filteredCars, setFilteredCars] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [activeTab, setActiveTab] = useState('cars'); // 'cars' or 'parts'
  const [limit, setLimit] = useState(9);
  const [isFiltered, setIsFiltered] = useState(false);
  
  useEffect(() => {
    getAllCars();
    getAllParts();
    getAllCategories();
  }, []);

  useEffect(() => {
    setFilteredCars(cars);
  }, [cars]);

  useEffect(() => {
    setFilteredParts(parts);
  }, [parts]);

  const handleSearch = (filters) => {
    const hasFilter = Object.values(filters).some(val => val !== '' && val !== null && val !== undefined);
    setIsFiltered(hasFilter);
    
    if (activeTab === 'cars') {
      let result = cars;
      
      if (filters.marka) {
        result = result.filter(car => 
          car.category?.name?.toLowerCase() === filters.marka.toLowerCase() || 
          car.carName?.toLowerCase() === filters.marka.toLowerCase()
        );
      }

      if (filters.fuelType) {
        result = result.filter(car => car.fuelType?.toLowerCase() === filters.fuelType.toLowerCase());
      }

      if (filters.transmission) {
        result = result.filter(car => car.transmission?.toLowerCase() === filters.transmission.toLowerCase());
      }

      if (filters.condition) {
        result = result.filter(car => car.condition?.toLowerCase() === filters.condition.toLowerCase());
      }

      if (filters.type) {
        result = result.filter(car => car.type?.toLowerCase() === filters.type.toLowerCase());
      }

      if (filters.location) {
        result = result.filter(car => car.location?.toLowerCase().includes(filters.location.toLowerCase()));
      }

      if (filters.priceRange) {
        result = result.filter(car => car.price <= Number(filters.priceRange));
      }

      if (filters.minPrice) {
        result = result.filter(car => car.price >= Number(filters.minPrice));
      }

      if (filters.maxPrice) {
        result = result.filter(car => car.price <= Number(filters.maxPrice));
      }

      if (filters.search) {
        const query = filters.search.toLowerCase();
        result = result.filter(car => 
          car.carName?.toLowerCase().includes(query) || 
          car.category?.name?.toLowerCase().includes(query) ||
          car.description?.toLowerCase().includes(query) ||
          car.location?.toLowerCase().includes(query) ||
          car.model?.toString().toLowerCase().includes(query)
        );
      }

      setFilteredCars(result);
    } else {
      let result = parts;

      if (filters.marka) {
        result = result.filter(part => part.category?.toLowerCase() === filters.marka.toLowerCase());
      }

      if (filters.condition) {
        result = result.filter(part => part.condition?.toLowerCase() === filters.condition.toLowerCase());
      }

      if (filters.location) {
        result = result.filter(part => part.location?.toLowerCase().includes(filters.location.toLowerCase()));
      }

      if (filters.priceRange) {
        result = result.filter(part => part.price <= Number(filters.priceRange));
      }

      if (filters.minPrice) {
        result = result.filter(part => part.price >= Number(filters.minPrice));
      }

      if (filters.maxPrice) {
        result = result.filter(part => part.price <= Number(filters.maxPrice));
      }

      if (filters.search) {
        const query = filters.search.toLowerCase();
        result = result.filter(part => 
          part.title?.toLowerCase().includes(query) || 
          part.description?.toLowerCase().includes(query) ||
          part.manufacturer?.toLowerCase().includes(query) ||
          part.category?.toLowerCase().includes(query) ||
          part.location?.toLowerCase().includes(query)
        );
      }

      setFilteredParts(result);
    }
  };

  const uniqueCarLocations = [...new Set(cars.map(car => car.location).filter(Boolean))].sort();
  const uniquePartLocations = [...new Set(parts.map(part => part.location).filter(Boolean))].sort();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Search Filter Section */}
      <SearchFilter 
        key={activeTab}
        activeTab={activeTab}
        onSearch={handleSearch} 
        locations={activeTab === 'cars' ? uniqueCarLocations : uniquePartLocations} 
      />
      


      {/* Toggle Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 mt-3 mb-2">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('cars')}
            className={`flex-1 py-4 text-center font-black text-sm uppercase tracking-widest transition-all ${
              activeTab === 'cars' ? 'text-[#4B2DBD] border-b-2 border-[#4B2DBD]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Cars (Active)
          </button>
          <button
            onClick={() => setActiveTab('parts')}
            className={`flex-1 py-4 text-center font-black text-sm uppercase tracking-widest transition-all ${
              activeTab === 'parts' ? 'text-[#4B2DBD] border-b-2 border-[#4B2DBD]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Auto Parts
          </button>
        </div>
      </div>

      <div className="bg-white md:bg-[#FBF7F7]">
        <div className="max-w-7xl mx-auto px-4 md:px-12 pt-[10px] pb-24 md:py-16">
          {activeTab === 'cars' ? (
            <div key="cars-tab-content">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-5xl font-black text-gray-900 tracking-tight">Browse Cars</h2>
                <Link to="/all-cars" state={{ autoScroll: true }} className="text-gray-500 font-semibold flex items-center gap-2 hover:text-[#4B2DBD] transition-all">
                  View All
                  <FaChevronRight size={12} />
                </Link>
              </div>

              {carsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-gray-100 rounded-2xl aspect-[4/5] animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                  {filteredCars.slice(0, isFiltered ? filteredCars.length : limit).map(car => (
                    <CarCard key={car._id} car={car} />
                  ))}
                  
                  {!isFiltered && filteredCars.length > limit && (
                    <Link 
                      to="/all-cars"
                      state={{ autoScroll: true }}
                      className="bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-600 cursor-pointer hover:bg-gray-200 transition-all p-4 group min-h-[150px]"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <FaChevronRight className="text-gray-400" size={18} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">Show More</span>
                      <span className="text-[9px] font-bold text-gray-400 mt-1">{filteredCars.length - limit} more available</span>
                    </Link>
                  )}
                </div>
              )}

              {!carsLoading && filteredCars.length === 0 && (
                <div key="no-cars-message" className="text-center py-20 bg-gray-50 rounded-3xl mt-10">
                  <FaCar size={64} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold">No cars found matching your criteria.</p>
                </div>
              )}
            </div>
          ) : (
            <div key="parts-tab-content">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-5xl font-black text-gray-900 tracking-tight">Browse Parts</h2>
              </div>

              {partsLoading ? (
                 <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                 {[1, 2, 3, 4, 5, 6].map(i => (
                   <div key={i} className="bg-gray-100 rounded-2xl aspect-[4/5] animate-pulse"></div>
                 ))}
               </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                  {filteredParts.slice(0, 8).map(part => (
                    <PartCard key={part._id} part={part} />
                  ))}
                </div>
              )}

              {!partsLoading && filteredParts.length === 0 && (
                <div key="no-parts-message" className="text-center py-20 bg-gray-50 rounded-3xl mt-10">
                  <FaTools size={64} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold">No parts listed yet.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
