import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import { Eye, EyeOff, Camera, ShieldCheck, User as UserIcon } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const { getProfile, updateProfile, user, loading } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    oldPassword: '',
    password: '',
    confirmPassword: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        const profileUser = data.user || user;
        if (profileUser) {
          const userData = {
            name: profileUser.name || '',
            email: profileUser.email || '',
            phoneNumber: profileUser.phoneNumber || '',
            oldPassword: '',
            password: '',
            confirmPassword: ''
          };
          setFormData(userData);
          if (profileUser.imageUrl) {
            const baseUrl = 'http://localhost:3000/uploads/';
            setImagePreview(profileUser.imageUrl.startsWith('http') ? profileUser.imageUrl : `${baseUrl}${profileUser.imageUrl}`);
          }
        }
      } catch (err) {
        console.error('Error fetching profile', err);
        toast.error('Could not fetch profile data');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      toast.info('New profile image selected');
    }
  };

  const getPasswordStrength = () => {
    if (!formData.password) return { label: 'Empty', color: 'bg-gray-200', width: '0%' };
    if (formData.password.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (formData.password.length < 10) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      toast.error("Name can only contain letters and spaces");
      document.getElementsByName('name')[0]?.focus();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    const hasPasswordChanged = formData.password.trim() !== '';
    
    if (hasPasswordChanged) {
        if (!formData.oldPassword.trim()) {
            toast.error('Current password is required to set a new password');
            document.getElementsByName('oldPassword')[0]?.focus();
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('New passwords do not match');
            document.getElementsByName('confirmPassword')[0]?.focus();
            return;
        }
    }

    setSubmitting(true);
    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('email', formData.email.trim());
    data.append('phoneNumber', formData.phoneNumber.trim());
    
    if (formData.oldPassword.trim()) data.append('oldPassword', formData.oldPassword.trim());
    if (formData.password.trim()) data.append('password', formData.password.trim());
    if (image) data.append('imageUrl', image);

    try {
      const response = await updateProfile(data);
      toast.success(response.message || 'Profile updated successfully! ✨');
      setFormData(prev => ({ ...prev, oldPassword: '', password: '', confirmPassword: '' }));
      setImage(null);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !formData.name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#4B2DBD] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Syncing Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]/50 py-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Account Settings</h1>
          <p className="text-gray-500 font-medium text-sm">Manage your personal identity and security</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Personal Information */}
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-200 p-6 md:p-10">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-5 bg-[#4B2DBD] rounded-full"></div>
                <h2 className="text-[11px] font-black text-[#4B2DBD] uppercase tracking-widest flex items-center gap-2">
                    <UserIcon size={14} /> Profile Information
                </h2>
            </div>

            <div className="space-y-8">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-50 border-4 border-white overflow-hidden flex items-center justify-center group">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-200">
                        <svg viewBox="0 0 24 24" className="w-16 h-16 fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-[#4B2DBD] text-white p-2 rounded-xl cursor-pointer hover:scale-110 transition-transform border-2 border-white">
                    <Camera size={14} strokeWidth={3} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    required name="name" type="text" value={formData.name} onChange={handleChange} 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-6 focus:bg-white focus:border-[#4B2DBD] transition-all outline-none font-bold text-gray-800" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    required name="email" type="email" value={formData.email} onChange={handleChange} 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-6 focus:bg-white focus:border-[#4B2DBD] transition-all outline-none font-bold text-gray-800" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2 max-w-sm">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input 
                    required name="phoneNumber" type="text" value={formData.phoneNumber} onChange={handleChange} 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-6 focus:bg-white focus:border-[#4B2DBD] transition-all outline-none font-bold text-gray-800" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Security Verification */}
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-200 p-6 md:p-10">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-5 bg-[#4B2DBD] rounded-full"></div>
                <h2 className="text-[11px] font-black text-[#4B2DBD] uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} /> Security Verification
                </h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password (Required to Save)</label>
                  <div className="relative">
                      <input 
                        name="oldPassword" type={showOldPassword ? "text" : "password"} 
                        placeholder="Type current password..." 
                        value={formData.oldPassword} onChange={handleChange} 
                        className="w-full bg-[#4B2DBD]/5 border border-transparent rounded-xl py-4 px-6 focus:bg-white focus:border-[#4B2DBD] transition-all outline-none font-bold text-gray-800 placeholder:text-[#4B2DBD]/30" 
                      />
                      <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#4B2DBD]/50 hover:text-[#4B2DBD]">
                          {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                  <div className="relative">
                    <input 
                      name="password" type={showPassword ? "text" : "password"} 
                      placeholder="Min. 8 characters" value={formData.password} onChange={handleChange} 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-6 focus:bg-white focus:border-[#4B2DBD] transition-all outline-none font-bold text-gray-800 pr-12" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      name="confirmPassword" type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Repeat new password" value={formData.confirmPassword} onChange={handleChange} 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-6 focus:bg-white focus:border-[#4B2DBD] transition-all outline-none font-bold text-gray-800 pr-12" 
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {formData.password && (
                  <div className="flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Strength:</span>
                      <div className="flex-1 flex gap-1 h-1 max-w-[120px]">
                          <div className={`h-full flex-1 rounded-full ${formData.password.length > 0 ? strength.color : 'bg-gray-200'}`}></div>
                          <div className={`h-full flex-1 rounded-full ${formData.password.length >= 6 ? strength.color : 'bg-gray-200'}`}></div>
                          <div className={`h-full flex-1 rounded-full ${formData.password.length >= 10 ? strength.color : 'bg-gray-200'}`}></div>
                      </div>
                      <span className={`text-[9px] font-black uppercase ${formData.password.length > 0 ? 'text-' + strength.color.split('-')[1] + '-500' : 'text-gray-400'}`}>
                          {strength.label}
                      </span>
                  </div>
              )}
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={submitting} 
              className="w-full bg-[#4B2DBD] hover:bg-[#3b2396] text-white py-5 rounded-2xl font-black text-base transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em]"
            >
              {submitting ? 'Updating Account...' : 'Save All Changes'}
            </button>
          </div>
        </form>
        
        <div className="text-center pt-4">
          <button 
            onClick={() => navigate('/listings')} 
            className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#4B2DBD] transition-all"
          >
            ← Back to My Listings
          </button>
        </div>
      </div>
    </div>
  );
}
