import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import SearchFilter from '../components/SearchFilter';
import CarCard from '../components/CarCard';
import { useCar } from '../context/CarContext';
import { useCategory } from '../context/CategoryContext';
import { FaChevronRight, FaCar } from 'react-icons/fa';

export default function Home() {
  const { cars, getAllCars, loading: carsLoading } = useCar();
  const { getAllCategories } = useCategory();
  const [filteredCars, setFilteredCars] = useState([]);
  const [limit, setLimit] = useState(9);
  const [isFiltered, setIsFiltered] = useState(false);
  
  useEffect(() => {
    getAllCars();
    getAllCategories();
  }, []);

  useEffect(() => {
    setFilteredCars(cars);
  }, [cars]);

  const handleSearch = (filters) => {
    const hasFilter = Object.values(filters).some(val => val !== '' && val !== null && val !== undefined);
    setIsFiltered(hasFilter);
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

    if (filters.priceRange) {
      result = result.filter(car => car.price <= Number(filters.priceRange));
    }

    if (filters.minPrice) {
      result = result.filter(car => car.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter(car => car.price <= Number(filters.maxPrice));
    }

    setFilteredCars(result);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Search Filter Section */}
      <SearchFilter onSearch={handleSearch} />
      


      <div className="bg-white md:bg-[#FBF7F7]">
        <div className="max-w-7xl mx-auto px-4 md:px-12 pt-[10px] pb-24 md:py-16">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-5xl font-black text-gray-900 tracking-tight">Browse Cars</h2>
            <Link to="/all-cars" className="text-gray-500 font-semibold flex items-center gap-2 hover:text-[#4B2DBD] transition-all">
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
                  className="bg-[#4B2DBD] rounded-2xl flex flex-col items-center justify-center text-white cursor-pointer hover:bg-[#3B2396] transition-all p-4 group min-h-[150px]"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FaChevronRight className="text-white" size={18} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Show More</span>
                  <span className="text-[9px] font-bold text-white/60 mt-1">{filteredCars.length - limit} more available</span>
                </Link>
              )}
            </div>
          )}

          {!carsLoading && filteredCars.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl mt-10">
              <FaCar size={64} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">No cars found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
