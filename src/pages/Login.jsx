import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      toast.success(data.message || 'Login successful!');
      setTimeout(() => {
        if (data.user && data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-gray-800 mt-[-56px] md:mt-[-72px]">
      {/* Left Side: Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-start pt-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-sm w-full mx-auto space-y-12">
          
          {/* Logo */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-3 bg-[#4B2DBD] py-3 px-6 rounded-2xl shadow-xl shadow-indigo-100">
              <img src="/kd_logo.png" alt="KhpalDrive" className="h-8 w-auto object-contain" />
              <h1 className="text-2xl font-black tracking-tight text-white uppercase">KhpalDrive</h1>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-8 pt-4">
            <div className="space-y-1 border-b-2 border-gray-200 focus-within:border-[#4B2DBD] transition-colors">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Email Address</label>
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-2 outline-none text-gray-800 font-bold placeholder:text-gray-300" 
              />
            </div>
            
            <div className="space-y-1 border-b-2 border-gray-200 focus-within:border-[#4B2DBD] transition-colors relative">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Password</label>
              <input 
                required 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-2 outline-none text-gray-800 font-bold placeholder:text-gray-300 pr-10" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-2 text-gray-400 hover:text-[#4B2DBD]">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={rememberLogin}
                    onChange={() => setRememberLogin(!rememberLogin)}
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-[#4B2DBD] peer-checked:border-[#4B2DBD] transition-all"></div>
                  <svg className="absolute top-1 left-1 w-3 h-3 text-white hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">Remember login</span>
              </label>

              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#4B2DBD] hover:bg-[#3a2291] text-white px-10 py-3 rounded-full font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm"
              >
                {loading ? '...' : 'Login'}
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="space-y-4 pt-4 text-sm font-semibold">
            <p className="text-gray-400">
              Don't have account ? <span onClick={() => navigate('/register')} className="text-gray-500 hover:text-[#4B2DBD] underline cursor-pointer transition-colors">Sign Up</span>
            </p>
          </div>

        </div>
      </div>

      {/* Right Side: Image */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
        <img 
          src="/login_bg.png" 
          alt="Car background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
        
      </div>
    </div>
  );
}
