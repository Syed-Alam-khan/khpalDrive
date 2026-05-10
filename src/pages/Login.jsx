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
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex bg-white font-sans text-gray-800 flex-1 overflow-hidden">
      {/* Left Side: Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-start pt-8 md:pt-12 px-8 md:px-16 lg:px-24 overflow-y-auto">
        <div className="max-w-sm w-full mx-auto space-y-4">
          

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg py-3 px-4 focus:bg-white focus:border-[#4B2DBD]/20 transition-all outline-none text-sm text-gray-800 font-bold placeholder:text-gray-400 placeholder:font-normal" 
              />
            </div>
            
            <div className="space-y-2 relative">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Password</label>
              <div className="relative">
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg py-3 px-4 focus:bg-white focus:border-[#4B2DBD]/20 transition-all outline-none text-sm text-gray-800 font-bold placeholder:text-gray-400 placeholder:font-normal pr-12" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4B2DBD] transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-6">
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
                <span className="text-xs font-bold text-gray-400 hover:text-[#4B2DBD] cursor-pointer transition-colors">Forgot Password?</span>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#4B2DBD] hover:bg-[#3a2291] text-white py-3.5 rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm"
              >
                {loading ? 'Processing...' : 'Login Now →'}
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="pt-0 text-center text-sm font-bold">
            <p className="text-gray-400">
              Don't have account? <span onClick={() => navigate('/register')} className="text-[#4B2DBD] hover:underline cursor-pointer transition-colors ml-1">Sign Up Now</span>
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
