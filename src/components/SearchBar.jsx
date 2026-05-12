export default function SearchBar({ searchQuery, onSearchChange, onOpenFilter }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 px-6 md:px-12 mt-6 md:mt-12 max-w-7xl mx-auto w-full">
      <div className="relative flex-1 group">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        
        <input 
          type="text" 
          placeholder="Search for your car..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-gray-100 border-2 border-transparent rounded-2xl py-4 md:py-5 pl-14 md:pl-16 pr-14 text-gray-800 font-bold focus:bg-white focus:border-blue-200 transition-all outline-none text-sm md:text-lg"
        />
        
        {/* Clear Search Button if active */}
        {searchQuery && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-14 flex items-center text-gray-300 hover:text-red-500 transition-colors"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}

        {/* Voice Search Icon */}
        <button className="absolute inset-y-0 right-6 flex items-center text-gray-400 hover:text-blue-600 transition-colors active:scale-90">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </button>
      </div>
      
      <button 
        onClick={onOpenFilter}
        className="md:flex bg-blue-50 hover:bg-blue-100 text-blue-600 border-2 border-white px-10 py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>
        Advanced Filter
      </button>
    </div>
  );
}
