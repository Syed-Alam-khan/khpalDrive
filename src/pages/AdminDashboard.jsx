import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useCar } from '../context/CarContext';
import { useUser } from '../context/UserContext';
import { useCategory } from '../context/CategoryContext';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { cars: allCars, deleteCar, loading: carsLoading, getAllCars } = useCar();
  const { getAllUsers, deleteUser, updateUser, loading: usersLoading } = useUser();
  const { categories, addCategory, updateCategory, deleteCategory, loading: catsLoading, getAllCategories } = useCategory();
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Pagination States
  const [userPage, setUserPage] = useState(1);
  const [carPage, setCarPage] = useState(1);
  const [catPage, setCatPage] = useState(1);
  const itemsPerPage = 5;

  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [submittingCategory, setSubmittingCategory] = useState(false);

  // Edit User State
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '', phoneNumber: '' });

  // Edit Category State
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  const loading = carsLoading || usersLoading || catsLoading;

  const fetchData = async () => {
    try {
      const carsData = await getAllCars();
      setCars(carsData.cars || carsData || []);
      
      const usersData = await getAllUsers();
      const userList = usersData.users || usersData.data || (Array.isArray(usersData) ? usersData : []);
      setUsers(userList);
      
      await getAllCategories();
    } catch (err) {
      console.error('Admin sync failure', err);
      toast.error('Sync Denied');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      setSubmittingCategory(true);
      const response = await addCategory(newCategoryName);
      toast.success(response.message || 'Category Added');
      setNewCategoryName('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category');
    } finally {
      setSubmittingCategory(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this user deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteUser(userId);
          Swal.fire(
            'Deleted!',
            response.message || 'User has been removed.',
            'success'
          );
          fetchData();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to delete user');
        }
      }
    });
  };

  const handleDeleteCategory = async (catId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will remove the category permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteCategory(catId);
          Swal.fire(
            'Deleted!',
            response.message || 'Category has been removed.',
            'success'
          );
          fetchData();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to delete category');
        }
      }
    });
  };

  const handleDeleteCar = async (carId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This listing will be removed from the marketplace!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteCar(carId);
          Swal.fire(
            'Removed!',
            response.message || 'Listing has been removed.',
            'success'
          );
          fetchData();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to delete car');
        }
      }
    });
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({ name: user.name, email: user.email, role: user.role, phoneNumber: user.phoneNumber || '' });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(editingUser._id, editFormData);
      toast.success(response.message || 'User updated successfully');
      setEditingUser(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCategoryName.trim()) return;
    try {
      const response = await updateCategory(editingCategory._id, editCategoryName);
      toast.success(response.message || 'Category updated');
      setEditingCategory(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update category');
    }
  };

  // Pagination Helper
  const paginate = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const PaginationControls = ({ current, total, onPageChange }) => {
    const totalPages = Math.ceil(total / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-50 flex justify-between items-center">
         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Page {current} of {totalPages}</span>
         <div className="flex gap-2">
            <button 
              disabled={current === 1} 
              onClick={() => onPageChange(current - 1)}
              className="p-2 bg-white border border-gray-100 rounded-lg disabled:opacity-30 active:scale-95 transition-all"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button 
              disabled={current === totalPages} 
              onClick={() => onPageChange(current + 1)}
              className="p-2 bg-white border border-gray-100 rounded-lg disabled:opacity-30 active:scale-95 transition-all"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
            </button>
         </div>
      </div>
    );
  };

  const totalValue = cars.reduce((sum, car) => sum + (car.price || 0), 0);
  const formattedValue = totalValue > 10000000 ? `${(totalValue / 10000000).toFixed(1)} Cr` : `${(totalValue / 100000).toFixed(1)} L`;

  const stats = [
    { label: 'Listings', value: cars.length, color: 'text-blue-600' },
    { label: 'Unsold', value: cars.filter(c => c.status !== 'sold').length, color: 'text-amber-600' },
    { label: 'Users', value: users.length, color: 'text-purple-600' },
    { label: 'Value', value: formattedValue, color: 'text-emerald-600' }
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8f9fa] font-sans text-gray-800">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
         <div className="font-black text-xl tracking-tighter">NCP <span className="text-blue-500">ADMIN</span></div>
         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={isSidebarOpen ? "M18 6 6 18M6 6l12 12" : "M3 12h18M3 6h18M3 18h18"}/></svg>
         </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-64 bg-gray-900 text-white flex flex-col p-6 lg:sticky top-0 h-screen z-40 transition-all fixed lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="hidden lg:block text-2xl font-black tracking-tighter text-blue-500 mb-12 px-2">NCP ADMIN</div>
        <nav className="space-y-1 flex-1">
          {['Overview', 'Manage Cars', 'Manage Users', 'Categories'].map(tab => (
            <button 
              key={tab}
              onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <button onClick={() => { localStorage.removeItem('userInfo'); window.location.href='/login'; }} className="w-full text-red-500 py-4 font-black text-[10px] uppercase tracking-widest border-t border-gray-800 mt-6 hover:text-white transition-colors">
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
             <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{activeTab}</h1>
             <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                {loading ? 'Updating System...' : 'Database Connected'}
             </p>
          </div>
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-gray-100">
             <div className="text-right">
                <div className="font-black text-gray-900 text-xs uppercase">{(() => { const u = JSON.parse(localStorage.getItem('userInfo') || '{}'); return u.user?.name || u.name || 'Admin Console'; })()}</div>
                <div className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Active</div>
             </div>
             <div className="w-8 h-8 bg-blue-100 overflow-hidden rounded-lg flex items-center justify-center text-blue-600 font-black text-xs">
                {(() => {
                  const u = JSON.parse(localStorage.getItem('userInfo') || '{}');
                  const imageSrc = u.user?.imageUrl || u.imageUrl;
                  if (imageSrc) return <img src={imageSrc.startsWith('http') ? imageSrc : `http://localhost:3000/uploads/${imageSrc.replace('uploads/', '')}`} className="w-full h-full object-cover" alt="" />;
                  return (u.user?.name || u.name || 'A')[0].toUpperCase();
                })()}
             </div>
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map(s => (
            <div key={s.label} className="bg-white p-6 rounded-2xl border border-gray-100">
              <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {activeTab === 'Overview' && (
           <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                 <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                    <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest">Recent Activity</h2>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                       <tbody className="divide-y divide-gray-50">
                         {paginate(cars, 1).map(car => (
                           <tr key={car._id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4">
                                 <div className="text-gray-900 font-black uppercase">{car.carName}</div>
                                 <div className="text-[9px] text-gray-400 uppercase font-bold">{car.location} • PKR {car.price?.toLocaleString()}</div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase ${car.status === 'sold' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {car.status === 'sold' ? 'Sold' : 'Live'}
                                 </span>
                              </td>
                           </tr>
                         ))}
                       </tbody>
                    </table>
                 </div>
              </div>
              <div className="bg-gray-900 rounded-2xl p-6 text-white h-fit">
                 <h2 className="text-xs font-black uppercase tracking-widest mb-4">Node Health</h2>
                 <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div className="font-black text-[9px] uppercase tracking-widest text-emerald-500">Live Sync</div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'Manage Users' && (
           <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                 <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest">User Registry</h2>
                 <div className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-md">{users.length} Records</div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-xs min-w-[700px]">
                    <thead className="bg-gray-50/20 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                       <tr>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Contact</th>
                          <th className="px-6 py-4 text-right">Operations</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-bold">
                       {paginate(users, userPage).map(user => (
                         <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-3 flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                  <img src={user.imageUrl ? (user.imageUrl.startsWith('http') ? user.imageUrl : `http://localhost:3000/uploads/${user.imageUrl}`) : `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} className="w-full h-full object-cover" alt="" />
                               </div>
                               <div>
                                  <div className="text-gray-900 font-black uppercase text-[11px]">{user.name}</div>
                                  <div className="text-[9px] text-gray-400 uppercase font-bold">{user.email}</div>
                               </div>
                            </td>
                            <td className="px-6 py-3">
                               <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${user.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                  {user.role}
                               </span>
                            </td>
                            <td className="px-6 py-3 text-gray-400 text-[9px] uppercase">{user.phoneNumber || '--'}</td>
                            <td className="px-6 py-3 text-right space-x-2">
                               <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:underline text-[9px] font-black uppercase tracking-widest">Edit</button>
                               <button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:underline text-[9px] font-black uppercase tracking-widest">Delete</button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
                 <PaginationControls current={userPage} total={users.length} onPageChange={setUserPage} />
              </div>
           </div>
        )}

        {activeTab === 'Manage Cars' && (
           <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                 <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest">Market Inventory</h2>
                 <div className="text-[9px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-md">{cars.length} Items</div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-xs min-w-[800px]">
                    <thead className="bg-gray-50/20 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                       <tr>
                          <th className="px-6 py-4">Vehicle</th>
                          <th className="px-6 py-4">Price</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-bold">
                       {paginate(cars, carPage).map(car => (
                         <tr key={car._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-3 flex items-center gap-3">
                               <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                  <img src={car.images?.[0] ? (car.images[0].startsWith('http') ? car.images[0] : `http://localhost:3000/uploads/${car.images[0]}`) : 'https://via.placeholder.com/40'} className="w-full h-full object-cover" alt="" />
                               </div>
                               <div>
                                  <div className="text-gray-900 font-black uppercase text-[11px]">{car.carName}</div>
                                  <div className="text-[9px] text-gray-400 uppercase font-bold">Model {car.model}</div>
                               </div>
                            </td>
                            <td className="px-6 py-3 text-blue-600 font-black">PKR {car.price?.toLocaleString()}</td>
                            <td className="px-6 py-3 uppercase text-[9px]">
                               <span className={car.status === 'sold' ? 'text-red-500' : 'text-emerald-500'}>{car.status}</span>
                            </td>
                            <td className="px-6 py-3 text-right">
                               <button onClick={() => handleDeleteCar(car._id)} className="text-red-500 hover:underline text-[9px] font-black uppercase tracking-widest">Delete</button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
                 <PaginationControls current={carPage} total={cars.length} onPageChange={setCarPage} />
              </div>
           </div>
        )}

        {activeTab === 'Categories' && (
           <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                 <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Add Taxonomy</h2>
                 <form onSubmit={handleCreateCategory} className="flex gap-4">
                    <input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="NEW CATEGORY..." className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-[11px] font-black uppercase outline-none focus:border-blue-500 transition-colors" />
                    <button type="submit" disabled={submittingCategory} className="bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors">
                       {submittingCategory ? '...' : 'Add'}
                    </button>
                 </form>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                 <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest">Category Registry</h2>
                    <div className="text-[9px] font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-md">{categories.length} Total</div>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-xs min-w-[600px]">
                       <thead className="bg-gray-50/20 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                         <tr>
                            <th className="px-6 py-4">Label</th>
                            <th className="px-6 py-4 text-center">Identifier</th>
                            <th className="px-6 py-4 text-right whitespace-nowrap">Operations</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-bold uppercase text-[10px]">
                         {paginate(categories, catPage).map(cat => (
                           <tr key={cat._id} className="hover:bg-gray-50/50">
                              <td className="px-6 py-4 font-black text-gray-900">{cat.name}</td>
                              <td className="px-6 py-4 text-center text-[9px] text-gray-400 opacity-60 font-medium">{cat._id}</td>
                              <td className="px-6 py-4 text-right space-x-2">
                                 <button onClick={() => { setEditingCategory(cat); setEditCategoryName(cat.name); }} className="text-blue-600 hover:underline text-[9px] font-black uppercase tracking-widest">Edit</button>
                                 <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-500 hover:underline text-[9px] font-black uppercase tracking-widest">Delete</button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                   <PaginationControls current={catPage} total={categories.length} onPageChange={setCatPage} />
                 </div>
              </div>
           </div>
        )}

        {editingUser && (
          <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white w-full max-w-lg rounded-2xl p-8 relative">
                <h2 className="text-xl font-black text-gray-900 uppercase mb-6">Edit Identity</h2>
                <form onSubmit={handleUpdateUser} className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Name</label>
                        <input value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none font-bold text-gray-800 text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Email</label>
                        <input value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none font-bold text-gray-800 text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Role</label>
                        <select value={editFormData.role} onChange={(e) => setEditFormData({...editFormData, role: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none font-bold text-gray-800 text-xs">
                           <option value="user">USER</option>
                           <option value="admin">ADMIN</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Phone</label>
                        <input value={editFormData.phoneNumber} onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none font-bold text-gray-800 text-xs" />
                      </div>
                   </div>
                   <div className="flex gap-3 pt-6">
                      <button type="button" onClick={() => setEditingUser(null)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">Cancel</button>
                      <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">Save</button>
                   </div>
                </form>
             </div>
          </div>
        )}

        {editingCategory && (
          <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white w-full max-w-lg rounded-2xl p-8 relative">
                <h2 className="text-xl font-black text-gray-900 uppercase mb-6">Edit Category</h2>
                <form onSubmit={handleUpdateCategory} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Name</label>
                      <input value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none font-bold text-gray-800 text-xs" />
                    </div>
                   <div className="flex gap-3 pt-6">
                      <button type="button" onClick={() => setEditingCategory(null)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">Cancel</button>
                      <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">Save</button>
                   </div>
                </form>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
