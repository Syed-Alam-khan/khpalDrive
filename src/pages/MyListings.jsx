import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useCar } from '../context/CarContext';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  Share2
} from 'lucide-react';

const ITEMS_PER_PAGE = 5;

export default function MyListings() {
  const { userCars, getUserCars, deleteCar, markAsSold, loading } = useCar();
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getUserCars();
        setListings(data.cars || data || []);
      } catch (err) {
        console.error('Error fetching listings', err);
        toast.error(err.response?.data?.message || 'Failed to sync your inventory');
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    setListings(userCars);
    setCurrentPage(1); // Reset to first page when data changes
  }, [userCars]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This vehicle will be removed from your inventory!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4B2DBD',
      cancelButtonColor: '#ff4d4d',
      confirmButtonText: 'Yes, remove it!',
      customClass: {
        container: 'rounded-[2rem]',
        popup: 'rounded-[1.5rem]'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteCar(id);
          Swal.fire({
            title: 'Removed!',
            text: response.message || 'Listing has been deleted.',
            icon: 'success',
            confirmButtonColor: '#4B2DBD'
          });
        } catch (err) {
          toast.error(err.response?.data?.message || 'Deletion failed');
        }
      }
    });
  };

  const handleMarkSold = async (id) => {
    try {
      const response = await markAsSold(id);
      toast.success(response.message || 'Vehicle marked as SOLD! 🏁');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleShare = async (id) => {
    const url = `${window.location.origin}/detail/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this car on KhpalDrive',
          url: url
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard! 🔗');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/cars/modern_vitz_car_1776686479016.png';
    if (typeof imagePath === 'string' && imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000/uploads/${imagePath}`;
  };

  const filteredListings = listings.filter(item => {
    const carTitle = item.model || '';
    const matchesSearch = carTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' || 
                        (filter === 'Active' && item.status !== 'sold') || 
                        (filter === 'Sold' && item.status === 'sold');
    return matchesSearch && matchesFilter;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentListings = filteredListings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-[#4B2DBD] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Syncing Inventory...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight">My listing</h1>
          <p className="hidden md:block text-gray-500 font-medium text-sm">Manage all your listings</p>
        </div>
        <Link 
          to="/sell" 
          className="bg-[#A3E635] hover:bg-[#8fd12a] text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-lime-100 text-xs md:text-sm"
        >
          <Plus size={18} strokeWidth={3} />
          Post <span className="hidden xs:inline">New Car</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
        <div className="w-full lg:w-auto overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
          <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-full border border-gray-100 w-max">
            {[
              { id: 'All', label: 'All' },
              { id: 'Active', label: 'Active' },
              { id: 'Sold', label: 'Sold' }
              ].map((tab) => {
                const count = tab.id === 'All' ? listings.length :
                            tab.id === 'Active' ? listings.filter(i => i.status !== 'sold').length :
                            listings.filter(i => i.status === 'sold').length;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => { setFilter(tab.id); setCurrentPage(1); }}
                  className={`relative px-5 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    filter === tab.id ? 'bg-[#4B2DBD] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md min-w-[18px] text-center ${
                    filter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative w-full max-w-none lg:max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search listings..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#4B2DBD]/20 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-10">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-white border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Vehicle Details</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Asking Price</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">Location</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right pr-6 md:pr-8">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentListings.length > 0 ? currentListings.map((item) => (
                <tr key={item._id} className="odd:bg-gray-50/80 even:bg-white hover:bg-gray-100/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-100 shadow-sm">
                          <img src={getImageUrl(item.images?.[0])} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="space-y-0.5">
                          <div className="text-gray-900 font-medium text-sm">{item.model}</div>
                          <div className="text-xs text-gray-500">
                            {item.model} · {item.fuelType} · {item.transmission}
                          </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium text-sm">PKR {item.price?.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Verified</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-gray-900 font-medium text-sm capitalize">{item.location || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.status === 'sold' ? 'bg-gray-100 text-gray-700' : 
                        item.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {item.status === 'sold' ? 'Sold' : item.status === 'pending' ? 'Pending' : 'Active'}
                      </div>
                      {item.status !== 'sold' && (
                        <button 
                          onClick={() => handleMarkSold(item._id)} 
                          className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight"
                          title="Mark as Sold"
                        >
                          <CheckCircle2 size={12} strokeWidth={3} />
                          Mark Sold
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right pr-6 md:pr-8">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleShare(item._id)}
                        className="text-[#4B2DBD] hover:text-[#3b2396] transition-colors p-2 rounded-lg hover:bg-indigo-50"
                        title="Share Listing"
                      >
                        <Share2 size={18} strokeWidth={2} />
                      </button>
                      <button 
                        onClick={() => navigate(`/sell?edit=${item._id}`)}
                        className="text-indigo-600 hover:text-indigo-700 transition-colors p-2 rounded-lg hover:bg-indigo-50"
                        title="Edit Listing"
                      >
                        <Edit2 size={18} strokeWidth={2} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)} 
                        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                        title="Delete Listing"
                      >
                        <Trash2 size={18} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-gray-400 font-medium text-lg bg-white">
                      No listings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Page <span className="text-gray-900">{currentPage}</span> of <span className="text-gray-900">{totalPages}</span>
            </p>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-gray-600 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-1 hidden sm:flex">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      currentPage === i + 1 
                        ? 'bg-[#4B2DBD] text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-gray-600 disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
