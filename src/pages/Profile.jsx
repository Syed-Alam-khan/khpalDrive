import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import { useCar } from '../context/CarContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, getProfile, loading: userLoading } = useUser();
  const { userCars, getUserCars, loading: carsLoading } = useCar();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch current user profile
        const profileData = await getProfile();
        
        // Fetch user's own listings
        const data = await getUserCars();
        setListings(data.cars || data || []);
      } catch (err) {
        console.error('Error fetching profile data', err);
        toast.error(err.response?.data?.message || 'Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const loading = userLoading || carsLoading;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/cars/modern_vitz_car_1776686479016.png';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('uploads/')) return `http://localhost:3000/${imagePath}`;
    return `http://localhost:3000/uploads/${imagePath}`;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Loading Profile Identity...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto w-full px-6 md:px-12 mt-6 md:mt-12 mb-20 animate-in fade-in duration-500">
      <div className="flex flex-col items-center mb-16">
         <div className="md:hidden w-full mb-10 flex justify-between items-center">
            <button onClick={() => window.history.back()} className="p-2 -ml-2 text-gray-800 active:scale-90 bg-white rounded-xl">
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="p-2 -mr-2 text-gray-800 active:scale-90 bg-white rounded-xl">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
         </div>
         
         <div className="relative mb-6">
            <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-black text-3xl border-4 border-white overflow-hidden">
              {user?.imageUrl ? (
                <img src={getImageUrl(user.imageUrl)} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                user?.name?.split(' ').map(n => n[0]).join('') || 'U'
              )}
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-blue-600 rounded-2xl border-4 border-white flex items-center justify-center text-white">
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </div>
         </div>
         
         <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">{user?.name}</h1>
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mt-1 opacity-60">{user?.email}</p>
            <p className="text-gray-500 font-bold text-xs tracking-widest uppercase mt-2 opacity-50">Phone: {user?.phoneNumber}</p>
            <p className="text-blue-600 font-black text-xs tracking-widest uppercase mt-2">Role: {user?.role === 'admin' ? 'ADMINISTRATOR' : 'BUYER'}</p>
            
            <button 
              onClick={() => navigate('/settings')} 
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
            >
              Edit Profile
            </button>
         </div>
      </div>

      <div className="space-y-8">
         <div className="flex items-center justify-between border-b border-gray-100 pb-5">
            <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-widest text-xs">My Featured Listings</h2>
            <span className="bg-gray-100 px-4 py-1 rounded-full text-[10px] font-black text-gray-400">{listings.length} Items</span>
         </div>
         
         <div className="space-y-5">
            {listings.map(item => (
               <div key={item._id} className="bg-white border border-gray-100 p-5 rounded-[2rem] flex items-center gap-5 hover:border-blue-100 transition-all group">
                  <div className="w-24 h-24 bg-gray-50 rounded-[1.5rem] overflow-hidden shrink-0 border border-gray-100">
                     <img src={getImageUrl(item.images?.[0])} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                     <h3 className="font-black text-gray-900 text-lg group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.carName}</h3>
                     <div className="text-blue-600 font-black text-sm mt-1">PKR {item.price?.toLocaleString()}</div>
                     
                     <div className="flex gap-2 mt-4">
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">Edit</button>
                        <button className="bg-red-50 hover:bg-red-100 text-red-500 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">Delete</button>
                     </div>
                  </div>
               </div>
            ))}
            {listings.length === 0 && (
              <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border-4 border-dashed border-gray-100">
                 <p className="text-gray-400 font-black text-xs uppercase tracking-widest">You haven't listed any cars yet.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
