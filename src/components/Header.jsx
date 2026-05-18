import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import Swal from 'sweetalert2';
import { FaBars, FaTimes } from 'react-icons/fa';
import { CircleFadingPlus } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSellSheetOpen, setIsSellSheetOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Remove the useEffect that loads userInfo from localStorage manually

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSellClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/register');
    } else {
      setIsSellSheetOpen(true);
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    Swal.fire({
      title: 'Sign Out?',
      text: 'Are you sure you want to log out of your account?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await logout();
          setIsProfileDropdownOpen(false);
          setIsMenuOpen(false);
          navigate('/login');
        } catch (err) {
          console.error('Logout failed', err);
          localStorage.removeItem('userInfo');
          window.location.href = '/login';
        }
      }
    });
  };

  const getProfileImage = () => {
    if (user?.imageUrl) {
      if (user.imageUrl.startsWith('http')) return user.imageUrl;
      const base = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : 'https://khpaldrivebackend-production.up.railway.app';
      return `${base}/uploads/${user.imageUrl}`;
    }
    return null;
  };

  const activeClass = ({ isActive }) => 
    `transition-all duration-300 ${isActive ? 'border-b-2 border-[#94D227]' : 'border-b-2 border-transparent hover:border-white/30'}`;

  return (
    <header className="bg-[#4B2DBD] text-white py-4 fixed top-0 left-0 w-full z-50 border-b border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src="/kd_logo.png" alt="KhpalDrive" className="h-6 md:h-8 w-auto object-contain" />
        </Link>

        {/* Right Side Navigation & Actions */}
        <div className="hidden md:flex items-center gap-10">
          <nav className="flex items-center gap-10 font-bold text-[15px] uppercase tracking-wide">
            <NavLink to="/" className={activeClass}>
              Home
            </NavLink>
            <NavLink to="/all-cars" className={activeClass}>
              All Cars
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            {user && (
              <NavLink 
                to="/listings" 
                className="bg-white/10 text-white px-5 py-2 rounded-full font-bold text-[12px] uppercase tracking-wider hover:bg-white/20 transition-all border border-white/20"
              >
                My Listing
              </NavLink>
            )}
            {!user && (
              <Link 
                to="/login" 
                className="text-white font-bold text-[12px] uppercase tracking-wider hover:text-[#94D227] transition-colors"
              >
                Login
              </Link>
            )}
            <button 
              onClick={handleSellClick}
              className="bg-[#94D227] text-white px-5 py-2 rounded-full font-bold text-[12px] uppercase tracking-wider hover:bg-[#85bd23] transition-all border border-[#94D227] flex items-center gap-1.5"
            >
              <CircleFadingPlus size={16} /> Sell
            </button>
            
            {user && (
              <div className="relative ml-2" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/30 overflow-hidden hover:border-white transition-all"
                >
                  {getProfileImage() ? (
                    <img src={getProfileImage()} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-sm">{user?.name?.charAt(0)}</span>
                  )}
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white text-gray-900 rounded-2xl border border-gray-100 py-3 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="px-5 py-2 border-b mb-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logged in as</p>
                      <p className="text-sm font-black text-[#4B2DBD]">{user?.name}</p>
                    </div>
                    <Link 
                      to="/settings" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-[#4B2DBD] transition-colors"
                    >
                      Account Settings
                    </Link>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button onClick={handleLogout} className="w-full text-left px-5 py-2.5 text-xs font-black text-red-500 hover:bg-red-50 transition-colors uppercase tracking-widest">Sign Out</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Profile & Toggle */}
        <div className="md:hidden flex items-center gap-4">
          {user ? (
            <button 
              onClick={() => { navigate('/settings'); setIsMenuOpen(false); }}
              className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/30 overflow-hidden active:scale-95 transition-all"
            >
              {getProfileImage() ? (
                <img src={getProfileImage()} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-sm">{user?.name?.charAt(0)}</span>
              )}
            </button>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsMenuOpen(false)}
              className="bg-[#94D227] text-white px-4 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider border border-[#94D227] active:bg-[#85bd23] transition-all"
            >
              Login
            </Link>
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#4B2DBD] border-t border-white/10 py-6 px-6 flex flex-col gap-3 rounded-b-3xl">
          <NavLink 
            to="/" 
            className={({ isActive }) => `block w-full px-5 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all ${isActive ? 'bg-[#94D227] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/all-cars" 
            className={({ isActive }) => `block w-full px-5 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all ${isActive ? 'bg-[#94D227] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            All Cars
          </NavLink>
          
          {user && (
            <NavLink 
              to="/listings" 
              className={({ isActive }) => `block w-full px-5 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all ${isActive ? 'bg-[#94D227] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              My Listing
            </NavLink>
          )}
          {user && (
             <button 
               onClick={handleLogout} 
               className="block w-full text-left px-5 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all bg-red-500/20 text-red-100 hover:bg-red-500/30"
             >
               Logout
             </button>
          )}
        </div>
      )}

      {/* Fixed Bottom Sell Button for Mobile */}
      {isHomePage && (
        <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-white p-4 pb-4 border-t border-gray-100">
          <button 
            onClick={handleSellClick}
            className="w-full bg-[#4B2DBD] text-white py-3 rounded-lg font-black text-base uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <CircleFadingPlus size={18} /> Sell
          </button>
        </div>
      )}

      {/* Sell Bottom Sheet */}
      {isSellSheetOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 flex items-end justify-center">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom-full duration-500 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900 font-black text-xl tracking-tight">What would you like to sell?</h2>
              <button 
                onClick={() => setIsSellSheetOpen(false)}
                className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <FaTimes size={14} />
              </button>
            </div>
            
            <div className="space-y-4 pb-4">
              <Link 
                to="/sell" 
                onClick={() => setIsSellSheetOpen(false)}
                className="block w-full border-2 border-gray-100 rounded-2xl p-4 hover:border-[#4B2DBD] hover:bg-gray-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#4B2DBD]/10 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🚗
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">Sell a Car</h3>
                    <p className="text-sm font-bold text-gray-400">List your vehicle for sale</p>
                  </div>
                </div>
              </Link>
              
              <Link 
                to="/sell-part" 
                onClick={() => setIsSellSheetOpen(false)}
                className="block w-full border-2 border-gray-100 rounded-2xl p-4 hover:border-[#4B2DBD] hover:bg-gray-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#4B2DBD]/20 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    ⚙️
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">Sell Auto Parts / Acc.</h3>
                    <p className="text-sm font-bold text-gray-400">List engines, rims, accessories</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
