import { useState, useEffect } from 'react';
import SearchFilter from '../components/SearchFilter';
import CarCard from '../components/CarCard';
import { useCar } from '../context/CarContext';
import { useCategory } from '../context/CategoryContext';
import { FaCar } from 'react-icons/fa';

export default function AllCars() {
  const { cars, getAllCars, loading: carsLoading } = useCar();
  const { getAllCategories } = useCategory();
  const [filteredCars, setFilteredCars] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  
  useEffect(() => {
    getAllCars();
    getAllCategories();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setFilteredCars(cars);
  }, [cars]);

  const handleSearch = (filters) => {
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
    setVisibleCount(12); // Reset pagination on new search
  };

  const showMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Search Filter Section - Padded top for contrast */}
      <div className="pt-0 md:pt-24 bg-gray-50/30">
        <SearchFilter onSearch={handleSearch} />
      </div>

      {/* Browse Cars Section */}
      <div className="bg-white md:bg-[#FBF7F7]">
        <div className="max-w-7xl mx-auto px-4 md:px-12 pt-[10px] pb-16 md:py-16 ">
          <div className="mb-3 ">
            <h1 className="text-sm md:text-3xl font-bold text-gray-900">Browse Cars</h1>
          </div>

          {carsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-gray-100 rounded-2xl aspect-[4/5] animate-pulse border"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCars.slice(0, visibleCount).map(car => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
              
              {visibleCount < filteredCars.length && (
                <div className="mt-20 pb-20 flex justify-center">
                  <button 
                    onClick={showMore}
                    className="bg-[#94D227] text-white px-16 py-5 rounded-[40px] font-bold text-2xl hover:opacity-90 transition-all shadow-sm"
                  >
                    Show more
                  </button>
                </div>
              )}
            </>
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
