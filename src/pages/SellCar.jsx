import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Image as ImageIcon, 
  Check, 
  AlertCircle,
  X,
  FileText,
  Settings,
  Camera,
  Eye,
  ArrowRight,
  MapPin,
  Lightbulb,
  Edit3,
  Fuel,
  Settings2
} from 'lucide-react';
import { useCategory } from '../context/CategoryContext';
import { useCar } from '../context/CarContext';

const STEPS = [
  { id: 1, name: 'Car Info', icon: FileText },
  { id: 2, name: 'Details', icon: Settings },
  { id: 3, name: 'Photos', icon: Camera },
  { id: 4, name: 'Review', icon: Eye },
];

export default function SellCar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const { categories, getAllCategories } = useCategory();
  const { addCar, updateCar, getSingleCar, loading } = useCar();
  
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    model: '',
    price: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCC: '',
    condition: 'Used',
    type: 'Non Cut',
    location: '',
    description: '',
    category: '',
    mileage: ''
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    getAllCategories();
    
    if (editId) {
      const fetchCarDetails = async () => {
        try {
          const data = await getSingleCar(editId);
          const car = data.car || data;
          setFormData({
            model: car.model || '',
            price: car.price || '',
            fuelType: car.fuelType || 'Petrol',
            transmission: car.transmission || 'Automatic',
            engineCC: car.engineCC || '',
            condition: car.condition || 'Used',
            type: car.type || 'Non Cut',
            location: car.location || '',
            description: car.description || '',
            category: car.category?._id || car.category || '',
            mileage: car.mileage || ''
          });
          if (car.images) {
            setPreviews(car.images.map(img => 
              img.startsWith('http') ? img : `http://localhost:3000/uploads/${img}`
            ));
          }
        } catch (err) {
          toast.error("Failed to fetch car details.");
        }
      };
      fetchCarDetails();
    }
  }, [editId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setManualValue = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const moveFile = (index, direction) => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= previews.length) return;

    const newPreviews = [...previews];
    const newFiles = [...files];

    // Swap previews
    [newPreviews[index], newPreviews[targetIndex]] = [newPreviews[targetIndex], newPreviews[index]];
    
    // Swap files (if they exist at these indices)
    if (newFiles[index] || newFiles[targetIndex]) {
       [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    }

    setPreviews(newPreviews);
    setFiles(newFiles);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.model.trim()) newErrors.model = "Car Model is required";
      if (!formData.category) newErrors.category = "Please select a category";
      if (!formData.price) newErrors.price = "Asking Price is required";
      if (!formData.location.trim()) newErrors.location = "Location is required";
    }
    
    if (step === 2) {
      if (!formData.fuelType) newErrors.fuelType = "Please select Fuel Type";
      if (!formData.transmission) newErrors.transmission = "Please select Transmission";
      if (!formData.condition) newErrors.condition = "Please select Condition";
      if (!formData.engineCC.trim()) newErrors.engineCC = "Engine CC is required";
      if (!formData.mileage.trim()) newErrors.mileage = "Mileage is required";
    }
    
    // if (step === 3) {
    //   if (files.length === 0 && previews.length === 0) {
    //     newErrors.files = "Please upload at least one photo of your car";
    //   }
    // }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    files.forEach(file => {
      data.append('images', file);
    });

    try {
      if (editId) {
        await updateCar(editId, data);
        toast.success("Listing updated!");
        navigate('/listings');
      } else {
        await addCar(data);
        setIsSuccess(true);
      }
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F3F4F6]/50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-purple-100 max-w-lg w-full text-center space-y-6 animate-in zoom-in-95 duration-500">
           <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
             <span className="text-4xl">🎉</span>
           </div>
           <div className="space-y-2">
             <h1 className="text-2xl font-black text-gray-900">Listing Posted!</h1>
             <p className="text-gray-500 font-medium text-xs">Your car has been submitted for review. It will go live within 30 minutes after verification.</p>
           </div>
           <div className="flex flex-col gap-3">
             <button 
              type="button"
              onClick={() => { setIsSuccess(false); setStep(1); setFormData({
                carName: '', model: '', price: '', fuelType: 'Petrol', transmission: 'Automatic',
                engineCC: '', condition: 'Used', type: 'Non Cut', location: '', description: '',
                category: '', year: '', mileage: ''
              }); setFiles([]); setPreviews([]); }}
              className="bg-[#4B2DBD] text-white py-3.5 rounded-xl font-bold hover:bg-[#3b2396] transition-all"
             >
               Post Another Car
             </button>
             <Link to="/listings" className="text-[#4B2DBD] font-bold text-xs hover:underline">View My Listings →</Link>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]/50">
      <form onSubmit={handleSubmit} noValidate>
      {/* Header Banner */}
      <div className="bg-[#4B2DBD] pt-3 pb-6 md:pt-12 md:pb-20 px-4 text-left md:text-center relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

        <h1 className="text-xl md:text-5xl font-black text-white mb-4 md:mb-4 relative z-10 tracking-tight">
          {editId ? 'Update Your Car' : 'Post Your Car'}
        </h1>
        <p className="hidden md:block text-purple-100 text-xl font-medium mb-12 relative z-10">
          {editId ? 'Update your listing details below' : 'Fill in the details below — it takes less than 2 minutes'}
        </p>
        
        {/* Stepper */}
        <div className="max-w-xl mx-auto flex items-center justify-between relative z-10 px-2 md:px-4">
          <div className="absolute top-4 md:top-6 left-0 w-full h-[2px] bg-white/10 -z-0"></div>
          {STEPS.map((s, idx) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-1.5 md:gap-3">
              <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                step === s.id 
                  ? 'bg-white text-[#4B2DBD] scale-110' 
                  : step > s.id 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-[#4B2DBD] border border-white/30 md:border-2 md:border-white/20 text-white/60'
              }`}>
                {step > s.id ? (
                  <Check className="w-4 h-4 md:w-5 md:h-5" strokeWidth={4} />
                ) : (
                  <span className="font-black text-xs md:text-lg">{s.id}</span>
                )}
              </div>
              <span className={`text-[10px] md:text-sm tracking-wide transition-all duration-300 ${
                step === s.id ? 'text-white font-black' : 'text-white/50 font-bold'
              }`}>{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-3xl mx-auto px-6 mt-8 pb-20">
        <div className="w-full h-1 bg-gray-200/50 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-[#4B2DBD]/30 rounded-full transition-all duration-700" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-lg border border-gray-100">
              <div className="flex items-center gap-2.5 mb-8">
                <div className="w-1.5 h-5 bg-[#4B2DBD] rounded-full"></div>
                <h2 className="text-[11px] font-black text-[#4B2DBD] uppercase tracking-widest">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-0.5">
                    Car Model <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input name="model" value={formData.model} onChange={handleChange} placeholder="e.g. 2002" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-4 pl-12 pr-6 focus:bg-white focus:ring-2 focus:ring-[#4B2DBD]/5 focus:border-[#4B2DBD] outline-none font-bold text-base transition-all" />
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                  </div>
                  {errors.model && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">* {errors.model}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-0.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-4 px-6 focus:bg-white outline-none font-bold text-base transition-all appearance-none">
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronRight size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" />
                  </div>
                  {errors.category && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">* {errors.category}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-0.5">
                    Asking Price (PKR) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input name="price" type="text" value={formData.price} onChange={handleChange} placeholder="4,500,000" className="w-full bg-gray-50/50 border border-[#4B2DBD]/20 rounded-xl py-4 pl-14 pr-6 focus:bg-white focus:border-[#4B2DBD] outline-none font-black text-base text-[#4B2DBD] transition-all" />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#4B2DBD]/40">PKR</span>
                  </div>
                  {errors.price && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">* {errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-0.5">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Islamabad" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-4 pl-12 pr-6 focus:bg-white outline-none font-bold text-base transition-all" />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                  </div>
                  {errors.location && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">* {errors.location}</p>}
                </div>
              </div>
            </div>
            <button type="button" onClick={nextStep} className="w-full bg-[#4B2DBD] text-white py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 hover:bg-[#3b2396] transition-all shadow-lg shadow-purple-100 active:scale-[0.98]">
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Technical Details */}
        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-lg border border-gray-100">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-1.5 h-5 bg-[#4B2DBD] rounded-full"></div>
                <h2 className="text-[11px] font-black text-[#4B2DBD] uppercase tracking-widest">Fuel & Transmission</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-0.5">
                    Fuel Type <span className="text-red-500">*</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Petrol', 'Diesel', 'CNG', 'Hybrid', 'Electric'].map(type => (
                      <button 
                        type="button"
                        key={type}
                        onClick={() => setManualValue('fuelType', type)}
                        className={`px-6 py-2 rounded-full text-[10px] font-bold transition-all border ${
                          formData.fuelType === type 
                            ? 'bg-[#4B2DBD] text-white border-[#4B2DBD]' 
                            : 'bg-gray-50/50 text-gray-500 border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {errors.fuelType && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">* {errors.fuelType}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-0.5">
                      Transmission <span className="text-red-500">*</span>
                    </p>
                    <div className="flex gap-2">
                      {['Automatic', 'Manual'].map(t => (
                        <button 
                          type="button"
                          key={t}
                          onClick={() => setManualValue('transmission', t)}
                          className={`flex-1 py-2 rounded-full text-[10px] font-bold transition-all border ${
                            formData.transmission === t 
                              ? 'bg-[#4B2DBD] text-white border-[#4B2DBD]' 
                              : 'bg-gray-50/50 text-gray-500 border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    {errors.transmission && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">* {errors.transmission}</p>}
                  </div>
                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-0.5">
                      Condition <span className="text-red-500">*</span>
                    </p>
                    <div className="flex gap-2">
                      {['Used', 'New'].map(c => (
                        <button 
                          type="button"
                          key={c}
                          onClick={() => setManualValue('condition', c)}
                          className={`flex-1 py-2 rounded-full text-[10px] font-bold transition-all border ${
                            formData.condition === c 
                              ? 'bg-[#4B2DBD] text-white border-[#4B2DBD]' 
                              : 'bg-gray-50/50 text-gray-500 border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    {errors.condition && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">* {errors.condition}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-lg border border-gray-100">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-1.5 h-5 bg-[#4B2DBD] rounded-full"></div>
                <h2 className="text-[11px] font-black text-[#4B2DBD] uppercase tracking-widest">Technical Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-0.5">
                    Engine CC <span className="text-red-500">*</span>
                  </label>
                  <input name="engineCC" value={formData.engineCC} onChange={handleChange} placeholder="e.g. 1800cc" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-4 px-6 focus:bg-white outline-none font-bold text-base transition-all" />
                  {errors.engineCC && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">* {errors.engineCC}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-0.5">
                    Mileage (KM) <span className="text-red-500">*</span>
                  </label>
                  <input name="mileage" value={formData.mileage} onChange={handleChange} placeholder="e.g. 45,000 km" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-4 px-6 focus:bg-white outline-none font-bold text-base transition-all" />
                  {errors.mileage && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">* {errors.mileage}</p>}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Car Type</p>
                <div className="flex flex-wrap gap-2">
                  {['Non Cut', 'Cut', 'Import', 'Local'].map(type => (
                    <button 
                      type="button"
                      key={type}
                      onClick={() => setManualValue('type', type)}
                      className={`px-6 py-2 rounded-full text-[10px] font-bold transition-all border ${
                        formData.type === type 
                          ? 'bg-[#4B2DBD] text-white border-[#4B2DBD]' 
                          : 'bg-gray-50/50 text-gray-500 border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Description (Optional)</label>
                <textarea name="description" rows="3" value={formData.description} onChange={handleChange} placeholder="Any extra info..." className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3.5 px-5 focus:bg-white outline-none font-medium text-xs transition-all resize-none shadow-inner"></textarea>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button type="button" onClick={prevStep} className="flex-1 bg-white text-gray-400 border border-gray-200 py-4 rounded-xl font-black text-base hover:bg-gray-50 transition-all active:scale-[0.98]">
                ← Back
              </button>
              <button type="button" onClick={nextStep} className="flex-[2] bg-[#4B2DBD] text-white py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 hover:bg-[#3b2396] transition-all shadow-lg active:scale-[0.98]">
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            {/* Photo Tips Section */}
            <div className="bg-[#4B2DBD]/5 rounded-[2rem] p-6 md:p-8 border border-[#4B2DBD]/10">
              <div className="flex items-center gap-2.5 mb-5">
                <Lightbulb className="text-[#4B2DBD]" size={20} />
                <h3 className="text-[11px] font-black text-[#4B2DBD] uppercase tracking-widest">Photo Tips for Better Sales</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: '☀️', title: 'Natural Light', desc: 'Shoot in daylight for clarity' },
                  { icon: '✨', title: 'Clean Car', desc: 'Wash your car before shooting' },
                  { icon: '📸', title: 'All Angles', desc: 'Exterior, Interior & Engine' },
                  { icon: '🎯', title: 'Clear View', desc: 'Avoid blurry or dark photos' }
                ].map((tip, i) => (
                  <div key={i} className="space-y-2">
                    <div className="text-xl">{tip.icon}</div>
                    <div>
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{tip.title}</p>
                      <p className="text-[9px] font-medium text-gray-500 leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-5 bg-[#4B2DBD] rounded-full"></div>
                  <h2 className="text-[11px] font-black text-[#4B2DBD] uppercase tracking-widest">Vehicle Photos</h2>
                </div>
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{files.length} selected</span>
              </div>
              <div className="space-y-8">
                <label className="w-full h-48 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[2rem] hover:bg-purple-50/30 hover:border-[#4B2DBD]/20 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group relative overflow-hidden">
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <ImageIcon className="text-[#4B2DBD]" size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-gray-800">Drag & drop photos or <span className="text-[#4B2DBD]">browse</span></p>
                    <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Up to 10 photos · Max 10MB each</p>
                  </div>
                </label>
                {errors.files && <p className="text-red-500 text-[10px] font-bold mt-1 text-center">* {errors.files}</p>}

                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {previews.map((url, i) => (
                    <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                      <img src={url} className="w-full h-full object-cover" alt="" />
                      
                      {/* Controls Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-2">
                        <button 
                          type="button"
                          onClick={() => moveFile(i, 'left')} 
                          className={`w-6 h-6 bg-white/90 text-[#4B2DBD] rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all ${i === 0 ? 'invisible' : ''}`}
                        >
                          <ChevronLeft size={14} strokeWidth={3} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => moveFile(i, 'right')} 
                          className={`w-6 h-6 bg-white/90 text-[#4B2DBD] rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all ${i === previews.length - 1 ? 'invisible' : ''}`}
                        >
                          <ChevronRight size={14} strokeWidth={3} />
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button type="button" onClick={() => removeFile(i)} className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-lg hover:bg-red-600">
                        <X size={12} strokeWidth={3} />
                      </button>

                      {i === 0 && <div className="absolute bottom-0 left-0 w-full bg-[#4B2DBD] text-white text-[7px] font-black uppercase py-0.5 text-center">Main Photo</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={prevStep} className="flex-1 bg-white text-gray-400 border border-gray-200 py-4 rounded-xl font-black text-base hover:bg-gray-50 transition-all active:scale-[0.98]">
                ← Back
              </button>
              <button type="button" onClick={nextStep} className="flex-[2] bg-[#4B2DBD] text-white py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 hover:bg-[#3b2396] transition-all shadow-lg active:scale-[0.98]">
                Review Listing <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Review Cards */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-5 bg-[#4B2DBD] rounded-full"></div>
                  <h2 className="text-[10px] font-black text-[#4B2DBD] uppercase tracking-widest">Review Your Listing</h2>
                </div>
                <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1.5 text-[9px] font-black text-[#4B2DBD] uppercase tracking-widest hover:underline">
                  <Edit3 size={12} /> Edit Details
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                 <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Model</p>
                  <p className="text-[12px] font-black text-gray-900">{formData.model}</p>
                </div>
                
                <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Category</p>
                  <p className="text-[12px] font-black text-gray-900">
                    {categories.find(c => c._id === formData.category)?.name || 'Car'}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#4B2DBD]/5 border border-[#4B2DBD]/20">
                  <p className="text-[10px] font-black text-[#4B2DBD] uppercase tracking-widest mb-1">Asking Price</p>
                  <p className="text-sm font-black text-[#4B2DBD]">PKR {Number(formData.price).toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</p>
                  <p className="text-[12px] font-black text-gray-900">{formData.location}</p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 flex items-center gap-3">
                  <Fuel className="text-red-500" size={16} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fuel</p>
                    <p className="text-[12px] font-black text-gray-900">{formData.fuelType}</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 flex items-center gap-3">
                  <Settings2 className="text-[#4B2DBD]" size={16} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transmission</p>
                    <p className="text-[12px] font-black text-gray-900">{formData.transmission}</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 flex items-center gap-3">
                  <div className="text-base">🚗</div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Condition</p>
                    <p className="text-[12px] font-black text-gray-900">{formData.condition}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Engine</p>
                  <p className="text-[12px] font-black text-gray-900">{formData.engineCC}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mileage</p>
                  <p className="text-[12px] font-black text-gray-900">{formData.mileage}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Car Type</p>
                  <p className="text-[12px] font-black text-gray-900">{formData.type}</p>
                </div>
              </div>

              {formData.description && (
                <div className="mt-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Description</p>
                  <p className="text-[11px] font-medium text-gray-600 leading-relaxed">{formData.description}</p>
                </div>
              )}
            </div>

            {/* Photos Review */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-5 bg-[#4B2DBD] rounded-full"></div>
                  <h2 className="text-[10px] font-black text-[#4B2DBD] uppercase tracking-widest">Photos</h2>
                </div>
                <button type="button" onClick={() => setStep(3)} className="text-[9px] font-black text-[#4B2DBD] uppercase tracking-widest hover:underline">
                  Edit Photos
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {previews.map((url, i) => (
                  <div key={i} className={`relative w-28 h-24 rounded-xl overflow-hidden border transition-all ${i === 0 ? 'border-[#4B2DBD]' : 'border-transparent'}`}>
                    <img src={url} className="w-full h-full object-cover" alt="" />
                    {i === 0 && (
                      <div className="absolute bottom-0 left-0 w-full bg-[#4B2DBD] text-white text-[7px] font-black uppercase py-0.5 text-center">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4 items-start">
              <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
              <div className="space-y-0.5">
                <p className="text-xs font-black text-amber-900">By posting, you confirm all information is accurate.</p>
                <p className="text-[10px] font-bold text-amber-700/70 leading-tight">Fraudulent listings will be removed and the account may be permanently banned.</p>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={() => setStep(3)} 
                className="flex-1 bg-white border border-gray-100 text-gray-400 py-4 rounded-xl font-black text-base hover:bg-gray-50 transition-all active:scale-95"
              >
                ← Edit
              </button>
              <button 
                type="submit"
                disabled={loading} 
                className={`flex-[3] bg-emerald-500 text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg active:scale-95 ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? 'Processing...' : editId ? 'Update My Car Now →' : 'Post My Car Now →'}
              </button>
            </div>
          </div>
        )}
      </div>
      </form>
    </div>
  );
}
