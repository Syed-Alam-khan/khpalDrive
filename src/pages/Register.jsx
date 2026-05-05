import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import { Eye, EyeOff, Camera, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useUser();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    phoneNumber: '' 
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!file) {
      toast.error("Please upload a profile photo.");
      return;
    }

    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('password', formData.password);
    form.append('phoneNumber', formData.phoneNumber);
    form.append('imageUrl', file);

    try {
      await register(form);
      setIsSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const getPasswordStrength = () => {
    if (!formData.password) return { label: 'Empty', color: 'bg-gray-200', width: '0%' };
    if (formData.password.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (formData.password.length < 10) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const strength = getPasswordStrength();

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        const info = localStorage.getItem('userInfo');
        const user = info ? JSON.parse(info).user : null;
        if (user?.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/sell';
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center py-12 px-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-gray-200 p-12 shadow-2xl text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={64} strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">Congratulations {formData.name}</h1>
            <p className="text-[#7C3AED] font-bold text-lg">Your Identity & Security synchronized successfully! ✨</p>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest pt-4">Redirecting you to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Registration</h1>
        <p className="text-gray-500 text-sm font-medium">Manage your personal Identity & Security</p>
      </div>

      <div className="max-w-lg w-full bg-white rounded-[2.5rem] border border-gray-200 p-4 md:p-6 shadow-xl">
        <form onSubmit={handleRegister} className="space-y-3">
          
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-[#7C3AED]/10 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[#7C3AED]/40">
                    <svg viewBox="0 0 24 24" className="w-16 h-16 fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#4B6BFB] text-white p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform border-2 border-white">
                <Camera size={16} strokeWidth={3} />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Update Profile Identity</p>
          </div>

          <div className="border-b border-gray-100 pb-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name <span className="text-red-500">*</span></label>
              <input 
                required 
                type="text" 
                placeholder="Enter your name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="w-full bg-[#E5E7EB]/50 border-2 border-transparent rounded-2xl py-1.5 px-4 focus:bg-white focus:border-[#7C3AED]/20 transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 shadow-sm" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address <span className="text-red-500">*</span></label>
                <input 
                  required 
                  type="email" 
                  placeholder="Enter your email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  className="w-full bg-[#E5E7EB]/50 border-2 border-transparent rounded-2xl py-1.5 px-4 focus:bg-white focus:border-[#7C3AED]/20 transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 shadow-sm" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number <span className="text-red-500">*</span></label>
                <input 
                  required 
                  type="text" 
                  placeholder="Enter your phone number" 
                  value={formData.phoneNumber} 
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} 
                  className="w-full bg-[#E5E7EB]/50 border-2 border-transparent rounded-2xl py-1.5 px-4 focus:bg-white focus:border-[#7C3AED]/20 transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 shadow-sm" 
                />
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <p className="text-[10px] font-black text-[#7C3AED] uppercase tracking-widest ml-1">Security Credentials</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    required 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    className="w-full bg-[#E5E7EB]/50 border-2 border-transparent rounded-2xl py-1.5 px-4 focus:bg-white focus:border-[#7C3AED]/20 transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 pr-12 shadow-sm" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7C3AED] transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    required 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirm your password" 
                    value={formData.confirmPassword} 
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                    className="w-full bg-[#E5E7EB]/50 border-2 border-transparent rounded-2xl py-1.5 px-4 focus:bg-white focus:border-[#7C3AED]/20 transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 pr-12 shadow-sm" 
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7C3AED] transition-colors">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password strength:</span>
              <div className="flex-1 flex gap-1 h-1.5 max-w-[150px]">
                <div className={`h-full flex-1 rounded-full ${formData.password.length > 0 ? strength.color : 'bg-gray-200'}`}></div>
                <div className={`h-full flex-1 rounded-full ${formData.password.length >= 6 ? strength.color : 'bg-gray-200'}`}></div>
                <div className={`h-full flex-1 rounded-full ${formData.password.length >= 10 ? strength.color : 'bg-gray-200'}`}></div>
              </div>
              <span className={`text-[10px] font-black uppercase ${formData.password.length > 0 ? 'text-' + strength.color.split('-')[1] + '-500' : 'text-gray-400'}`}>
                {formData.password.length > 0 ? strength.label : 'Weak'}
              </span>
            </div>
          </div>
          
          <div className="pt-1 pb-1">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3.5 rounded-2xl font-black text-lg transition-all active:scale-[0.98] shadow-lg shadow-purple-200 disabled:opacity-50 uppercase tracking-widest"
            >
              {loading ? 'Processing...' : 'Register'}
            </button>
          </div>

          <div className="mt-2 text-center pb-2">
            <p className="text-sm font-bold text-gray-500">
              Already have an account? <span onClick={() => navigate('/login')} className="text-[#7C3AED] hover:underline cursor-pointer transition-all">Log in instead</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
