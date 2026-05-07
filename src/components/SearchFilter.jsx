import React, { useState, useEffect } from 'react';
import { useCategory } from '../context/CategoryContext';
import { FaSearch, FaChevronDown, FaTimes, FaFilter, FaRedo } from 'react-icons/fa';
import { X, RotateCcw } from 'lucide-react';

const SearchFilter = ({ onSearch }) => {
  const { categories } = useCategory();
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    marka: '',
    fuelType: '',
    transmission: '',
    condition: '',
    priceRange: '',
    minPrice: '',
    maxPrice: '',
    type: ''
  });

  const handleChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    const cleared = {
      marka: '',
      fuelType: '',
      transmission: '',
      condition: '',
      priceRange: '',
      minPrice: '',
      maxPrice: '',
      type: ''
    };
    setFilters(cleared);
    if (!isMobileModalOpen) onSearch(cleared);
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  const handleApplyMobile = () => {
    onSearch(filters);
    setIsMobileModalOpen(false);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isMobileModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileModalOpen]);

  return (
    <div className={`max-w-7xl mx-auto mt-8 mb-[5px] md:-mt-12 md:mb-0 relative px-4 md:px-12 ${isMobileModalOpen ? 'z-[100]' : 'z-10'}`}>
      {/* Desktop Filter (Hidden on Mobile) */}
      <div className="hidden md:flex flex-row items-stretch gap-4 mb-4">
        <div className="flex-1 bg-white rounded-xl border-2 border-gray-200 flex flex-row items-center overflow-hidden shadow-sm">
          {/* Marka Filter */}
          <div className="flex-1 w-full p-2 border-r-2 border-gray-200 last:border-r-0 relative group">
            <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 ml-1">Marka</label>
            <div className="relative">
              <select 
                className="w-full bg-transparent font-black text-sm outline-none cursor-pointer appearance-none pr-8 text-gray-800"
                value={filters.marka}
                onChange={(e) => handleChange('marka', e.target.value)}
              >
                <option value="">All Brands</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <FaChevronDown size={12} />
              </div>
            </div>
          </div>

          {/* Fuel Type Filter */}
          <div className="flex-1 w-full p-2 border-r-2 border-gray-200 last:border-r-0 relative group">
            <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 ml-1">Fuel Type</label>
            <div className="relative">
              <select 
                className="w-full bg-transparent font-black text-sm outline-none cursor-pointer appearance-none pr-8 text-gray-800"
                value={filters.fuelType}
                onChange={(e) => handleChange('fuelType', e.target.value)}
              >
                <option value="">All Fuel</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <FaChevronDown size={12} />
              </div>
            </div>
          </div>

          {/* Transmission Filter */}
          <div className="flex-1 w-full p-2 border-r-2 border-gray-200 last:border-r-0 relative group">
            <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 ml-1">Trans.</label>
            <div className="relative">
              <select 
                className="w-full bg-transparent font-black text-sm outline-none cursor-pointer appearance-none pr-8 text-gray-800"
                value={filters.transmission}
                onChange={(e) => handleChange('transmission', e.target.value)}
              >
                <option value="">All Gear</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <FaChevronDown size={12} />
              </div>
            </div>
          </div>

          {/* Condition Filter */}
          <div className="flex-1 w-full p-2 border-r-2 border-gray-200 last:border-r-0 relative group">
            <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 ml-1">Condition</label>
            <div className="relative">
              <select 
                className="w-full bg-transparent font-black text-sm outline-none cursor-pointer appearance-none pr-8 text-gray-800"
                value={filters.condition}
                onChange={(e) => handleChange('condition', e.target.value)}
              >
                <option value="">All Cond.</option>
                <option value="Used">Used</option>
                <option value="New">New</option>
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <FaChevronDown size={12} />
              </div>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="flex-1 w-full p-2 relative group">
            <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 ml-1">Max Price</label>
            <div className="relative">
              <select 
                className="w-full bg-transparent font-black text-sm outline-none cursor-pointer appearance-none pr-8 text-[#4B2DBD]"
                value={filters.priceRange}
                onChange={(e) => handleChange('priceRange', e.target.value)}
              >
                <option value="">No Limit</option>
                <option value="1000000">Under 10 Lac</option>
                <option value="2000000">Under 20 Lac</option>
                <option value="5000000">Under 50 Lac</option>
                <option value="10000000">Under 1 Crore</option>
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <FaChevronDown size={12} />
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex gap-2">
          <button 
            onClick={() => onSearch(filters)}
            className="bg-[#4B2DBD] text-white px-8 py-2 rounded-xl flex items-center justify-center gap-3 hover:bg-[#3B2396] transition-all font-black shadow-lg shadow-purple-100 min-w-[140px]"
          >
            <FaSearch size={14} />
            <span className="text-sm uppercase tracking-widest">Search</span>
          </button>
          
          {activeFiltersCount > 0 && (
            <button 
              onClick={handleClear}
              className="bg-gray-100 text-gray-400 w-12 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all group"
            >
              <RotateCcw size={18} className="group-hover:rotate-[-45deg] transition-transform" />
            </button>
          )}
        </div>
      </div>

      <div className="md:hidden flex gap-1.5">
        <button 
          onClick={() => setIsMobileModalOpen(true)}
          className="flex-1 bg-white border-2 border-gray-100 rounded-xl py-2.5 px-3 flex items-center justify-between font-black text-gray-800 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <FaFilter className="text-[#4B2DBD]" size={12} />
            <span className="text-[12px] uppercase tracking-widest">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-[#4B2DBD] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <FaChevronDown size={10} className="text-gray-300" />
        </button>
        {activeFiltersCount > 0 ? (
          <button 
            onClick={handleClear}
            className="bg-red-500 text-white w-12 rounded-xl flex items-center justify-center shadow-lg shadow-red-100 animate-in zoom-in duration-300"
            title="Clear Filters"
          >
            <RotateCcw size={16} />
          </button>
        ) : (
          <button 
            onClick={() => onSearch(filters)}
            className="bg-[#4B2DBD] text-white w-12 rounded-xl flex items-center justify-center shadow-lg shadow-purple-100 animate-in zoom-in duration-300"
            title="Search"
          >
            <FaSearch size={16} />
          </button>
        )}
      </div>

      {/* Mobile Filter Modal (Full Screen Overlay) */}
      {isMobileModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-full duration-500 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-white z-10 pb-2">
              <button 
                onClick={handleClear}
                className="text-red-500 font-black text-xs uppercase tracking-widest"
              >
                Reset
              </button>
              <h2 className="text-gray-900 font-black text-base uppercase tracking-[0.2em]">Filters</h2>
              <button 
                onClick={() => setIsMobileModalOpen(false)}
                className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-8 pb-48">
              {/* Price Range */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                    <input 
                      type="number" 
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) => handleChange('minPrice', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-8 pr-4 text-sm font-bold focus:bg-white focus:border-[#4B2DBD] outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                    <input 
                      type="number" 
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) => handleChange('maxPrice', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-8 pr-4 text-sm font-bold focus:bg-white focus:border-[#4B2DBD] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Category Dropdown (Real API Data) */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Car Category</h3>
                <div className="relative">
                  <select 
                    value={filters.marka}
                    onChange={(e) => handleChange('marka', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-bold focus:bg-white focus:border-[#4B2DBD] outline-none appearance-none transition-all text-gray-800"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <FaChevronDown size={12} />
                  </div>
                </div>
              </div>

              {/* Car Type / Status */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Car Type</h3>
                <div className="flex flex-wrap gap-2">
                  {['Non Cut', 'Cut', 'Import', 'Local'].map(t => (
                    <button 
                      key={t}
                      onClick={() => handleChange('type', t)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black border transition-all ${
                        filters.type === t ? 'bg-[#4B2DBD] text-white border-[#4B2DBD]' : 'bg-white text-gray-500 border-gray-100'
                      }`}
                    >
                      {t} {filters.type === t && '✓'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fuel Type</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['Petrol', 'Diesel', 'CNG', 'Hybrid'].map(f => (
                    <button 
                      key={f}
                      onClick={() => handleChange('fuelType', f)}
                      className={`py-2 rounded-xl text-[10px] font-black border transition-all ${
                        filters.fuelType === f ? 'bg-[#4B2DBD] text-white border-[#4B2DBD]' : 'bg-white text-gray-500 border-gray-100'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-50 space-y-2 z-20">
              <button 
                onClick={handleClear}
                className="w-full bg-white text-gray-900 border-2 border-gray-100 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
              >
                Clear all
              </button>
              <button 
                onClick={handleApplyMobile}
                className="w-full bg-[#4B2DBD] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-100 active:scale-[0.98] transition-all"
              >
                Apply ({activeFiltersCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
