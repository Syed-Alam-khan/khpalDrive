import { useState } from 'react';

export default function CategoryBar({ categories, activeCategory, onSelectCategory }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Combine static options with real backend categories
  // We extract only the 'name' property from the category objects
  const categoryNames = categories.map(cat => typeof cat === 'string' ? cat : cat.name);
  const allCategories = ["All", ...categoryNames];
  
  // Logic to show "More" if there are many categories
  const displayedCategories = isExpanded ? allCategories : allCategories.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto w-full px-6 md:px-12 mt-6 md:mt-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 md:flex-wrap">
        {displayedCategories.map((cat) => (
          <button 
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`${activeCategory === cat ? 'bg-blue-600 text-white scale-105' : 'bg-white text-gray-500 hover:text-blue-600 border border-gray-100'} px-6 md:px-8 py-3 rounded-full md:rounded-2xl font-black whitespace-nowrap transition-all text-xs md:text-sm active:scale-95`}
          >
            {cat}
          </button>
        ))}
        
        {allCategories.length > 8 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200 px-6 md:px-8 py-3 rounded-full md:rounded-2xl font-black whitespace-nowrap flex items-center gap-2 transition-all group active:scale-95 text-xs md:text-sm"
          >
            <span className="group-hover:text-blue-600 transition-colors">{isExpanded ? 'Show Less' : 'More Categories'}</span>
            <svg 
              className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} group-hover:text-blue-600`} 
              xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
