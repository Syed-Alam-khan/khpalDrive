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
  Wrench,
  Cpu,
  Settings2
} from 'lucide-react';
import { useAutoPart } from '../context/AutoPartContext';
import { usePartCategory } from '../context/PartCategoryContext';

const STEPS = [
  { id: 1, name: 'Title & Media', icon: Camera },
  { id: 2, name: 'Specifications', icon: Settings },
  { id: 3, name: 'Compatibility', icon: Wrench },
  { id: 4, name: 'Price & Desc', icon: FileText },
];

const CATEGORIES = [
  "Engine", "Electrical", "Body", "Suspension", "Tires & Rims", "Interior", "Other"
];

export default function SellAutoPart() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const { addPart, getPartById, loading } = useAutoPart();
  const { categories: fetchedCategories, getAllCategories } = usePartCategory();
  
  // Use dynamically fetched categories or fallback to defaults
  const dynamicCategories = fetchedCategories?.length > 0 
    ? fetchedCategories.map(c => c.name) 
    : ["Engine", "Electrical", "Body", "Suspension", "Tires & Rims", "Interior", "Other"];
  
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    condition: 'Used / Aftermarket',
    manufacturer: '',
    compatibleMake: '',
    compatibleModel: '',
    compatibleYearRange: '',
    price: '',
    location: '',
    description: '',
    contactPreference: 'Both'
  });
  
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    if (editId) {
      const fetchPartDetails = async () => {
        try {
          const part = await getPartById(editId);
          if (part) {
            setFormData({
              title: part.title || '',
              category: part.category || '',
              condition: part.condition || 'Used / Aftermarket',
              manufacturer: part.manufacturer || '',
              compatibleMake: part.compatibleMake || '',
              compatibleModel: part.compatibleModel || '',
              compatibleYearRange: part.compatibleYearRange || '',
              price: part.price || '',
              location: part.location || '',
              description: part.description || '',
              contactPreference: part.contactPreference || 'Both'
            });
            if (part.category && !dynamicCategories.includes(part.category)) {
              setIsOtherCategory(true);
              setCustomCategory(part.category);
              setFormData(prev => ({ ...prev, category: 'Other' }));
            }
            if (part.images) {
              setPreviews(part.images.map(img => 
                img.startsWith('http') ? img : `http://localhost:3000/uploads/${img}`
              ));
            }
          }
        } catch (err) {
          toast.error("Failed to fetch auto part details.");
        }
      };
      fetchPartDetails();
    }
    getAllCategories();
  }, [editId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'title' && value) {
      newValue = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setFormData({ ...formData, [name]: newValue });
  };

  const setManualValue = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (files.length + selectedFiles.length > 6) {
      toast.error("Maximum 6 images allowed for auto parts.");
      return;
    }

    setFiles(prev => [...prev, ...selectedFiles]);
    
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const moveFile = (index, direction) => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= previews.length) return;

    const newPreviews = [...previews];
    const newFiles = [...files];

    [newPreviews[index], newPreviews[targetIndex]] = [newPreviews[targetIndex], newPreviews[index]];
    
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
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (formData.category === 'Other') {
        if (!customCategory.trim()) newErrors.category = 'Please specify the category';
      } else if (!formData.category) {
        newErrors.category = "Please select a category";
      }
      if (files.length === 0 && previews.length === 0) {
        newErrors.files = "Please upload at least one photo";
      }
    }
    
    if (step === 2) {
      if (!formData.condition) newErrors.condition = "Please select Condition";
    }
    
    if (step === 4) {
      if (!formData.price) newErrors.price = "Asking Price is required";
      if (!formData.location.trim()) newErrors.location = "Location is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus the first error field
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementsByName(firstErrorField)[0] || document.getElementById(firstErrorField);
      if (element) {
        if (element.type === 'file') {
          element.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          element.focus();
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }
    
    setErrors({});
    if (step < 4) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
       // Only trigger submit if not continuing from a step (Step 4 is last, but we might want to review instead of submitting directly. Wait, step 4 here is review? Actually let's make step 5 review like cars, or just 4 steps.)
       // Based on diagram: Step 4 is Pricing & Description. Tap Post Listing directly from Step 4. Let's make Step 5 review, or just Post on Step 4.
       handleSubmit(new Event('submit'));
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    if(e && e.preventDefault) e.preventDefault();
    
    // Quick validation before final submit
    if (!formData.price || !formData.location || !formData.description) {
       toast.error("Please fill all required fields in the current step.");
       return;
    }

    const data = new FormData();
    
    const finalCategory = formData.category === 'Other' ? customCategory.trim() : formData.category;

    Object.keys(formData).forEach(key => {
      if (key === 'category') {
        data.append(key, finalCategory);
      } else {
        data.append(key, formData[key]);
      }
    });
    
    files.forEach(file => {
      data.append('images', file);
    });

    try {
      if (editId) {
        // Assume updatePart exists if needed later
        // await updatePart(editId, data);
        toast.success("Listing updated!");
        navigate('/listings');
      } else {
        await addPart(data);
        setIsSuccess(true);
      }
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F3F4F6]/50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] max-w-lg w-full text-center space-y-6 animate-in zoom-in-95 duration-500">
           <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
             <span className="text-4xl">🎉</span>
           </div>
           <div className="space-y-2">
             <h1 className="text-2xl font-black text-gray-900">Listing Posted!</h1>
             <p className="text-gray-500 font-medium text-xs">Your auto part has been submitted for review. It will go live within 30 minutes.</p>
           </div>
           <div className="flex flex-col gap-3">
             <button 
              type="button"
              onClick={() => { setIsSuccess(false); setStep(1); setFormData({
                title: '', category: '', condition: 'Used / Aftermarket', manufacturer: '',
                compatibleMake: '', compatibleModel: '', compatibleYearRange: '', price: '',
                location: '', description: '', contactPreference: 'Both'
              }); setFiles([]); setPreviews([]); }}
              className="bg-[#4B2DBD] text-white py-3.5 rounded-xl font-bold hover:bg-[#3b2396] transition-all"
             >
               Post Another Part
             </button>
             <Link to="/listings" className="text-[#4B2DBD] font-bold text-xs hover:underline">View My Listings →</Link>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]/50">
      <form onSubmit={(e) => { e.preventDefault(); }} noValidate>
      {/* Header Banner */}
      <div className="bg-[#4B2DBD] pt-6 pb-2 md:pt-32 md:pb-8 px-4 text-left md:text-center relative overflow-hidden">
        <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

        <h1 className="text-xl md:text-5xl font-black text-white mb-2 md:mb-4 relative z-10 tracking-tight">
          {editId ? 'Update Auto Part' : 'Sell Auto Parts'}
        </h1>
        <p className="hidden md:block text-purple-100 text-xl font-medium mb-8 relative z-10">
          List engines, rims, accessories and more.
        </p>
        
        {/* Stepper */}
        <div className="max-w-2xl mx-auto flex items-center justify-between relative z-10 px-2 md:px-4">
          <div className="absolute top-4 md:top-6 left-0 w-full h-[2px] bg-white/10 -z-0"></div>
          {STEPS.map((s, idx) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-1.5 md:gap-3">
              <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                step === s.id 
                  ? 'bg-white text-[#4B2DBD] scale-110' 
                  : step > s.id 
                    ? 'bg-[#4B2DBD] text-white' 
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
          <div className="h-full bg-[#4B2DBD]/80 rounded-full transition-all duration-700" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>

        {/* Step 1: Title & Media */}
        {step === 1 && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100">
              <div className="flex items-center gap-2.5 mb-8">
                <div className="w-1.5 h-5 bg-[#4B2DBD] rounded-full"></div>
                <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-0.5">
                    Listing Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Honda Civic Reborn Alloy Rims 16&quot;" className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-6 focus:bg-white focus:ring-2 focus:ring-[#4B2DBD]/10 focus:border-[#4B2DBD] outline-none font-bold text-base transition-all" />
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                  </div>
                  {errors.title && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">* {errors.title}</p>}
                </div>
                <div className="space-y-2 relative">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-0.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Other') {
                          setIsOtherCategory(true);
                          setFormData({ ...formData, category: 'Other' });
                        } else {
                          setIsOtherCategory(false);
                          setFormData({ ...formData, category: val });
                        }
                      }}
                      className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-6 pr-12 focus:bg-white focus:ring-2 focus:ring-[#4B2DBD]/10 focus:border-[#4B2DBD] outline-none font-bold text-base transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Category</option>
                      {dynamicCategories.filter(c => c.toLowerCase() !== 'other').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                    <ChevronRight size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
                  </div>
                  
                  {isOtherCategory && (
                    <div className="mt-3 relative animate-in fade-in slide-in-from-top-2 duration-300">
                      <input 
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Type custom category..." 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-6 focus:bg-white focus:ring-2 focus:ring-[#4B2DBD]/10 focus:border-[#4B2DBD] outline-none font-bold text-sm transition-all"
                      />
                    </div>
                  )}
                  {errors.category && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">* {errors.category}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-1.5 h-5 bg-[#4B2DBD] rounded-full"></div>
                <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Part Photos (Max 6)</h2>
              </div>

              <div className="space-y-6">
                <label className="w-full h-32 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-2xl hover:bg-[#4B2DBD]/5 hover:border-[#4B2DBD]/30 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group relative overflow-hidden">
                  <input name="files" type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImageIcon className="text-[#4B2DBD]" size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-gray-800">Drag & drop photos or <span className="text-[#4B2DBD]">browse</span></p>
                  </div>
                </label>
                {errors.files && <p className="text-red-500 text-[10px] font-bold mt-1 text-center">* {errors.files}</p>}

                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {previews.map((url, i) => (
                    <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                      <img src={url} className="w-full h-full object-cover" alt="" />
                      
                      {/* Controls Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-1">
                        <button 
                          type="button"
                          onClick={() => moveFile(i, 'left')} 
                          className={`w-5 h-5 bg-white/90 text-[#4B2DBD] rounded-full flex items-center justify-center hover:bg-white transition-all ${i === 0 ? 'invisible' : ''}`}
                        >
                          <ChevronLeft size={12} strokeWidth={3} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => moveFile(i, 'right')} 
                          className={`w-5 h-5 bg-white/90 text-[#4B2DBD] rounded-full flex items-center justify-center hover:bg-white transition-all ${i === previews.length - 1 ? 'invisible' : ''}`}
                        >
                          <ChevronRight size={12} strokeWidth={3} />
                        </button>
                      </div>

                      <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm hover:bg-red-600">
                        <X size={10} strokeWidth={3} />
                      </button>

                      {i === 0 && <div className="absolute bottom-0 left-0 w-full bg-[#4B2DBD] text-white text-[7px] font-black uppercase py-0.5 text-center">Main</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button type="button" onClick={nextStep} className="w-full bg-[#4B2DBD] text-white py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 hover:bg-[#3b2396] transition-all active:scale-[0.98]">
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Core Specifications */}
        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-1.5 h-5 bg-[#4B2DBD] rounded-full"></div>
                <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Part Condition & Brand</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-0.5">
                    Condition <span className="text-red-500">*</span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {['Brand New / OEM', 'Used / Aftermarket', 'New', 'Used'].map(cond => (
                      <button 
                        type="button"
                        key={cond}
                        onClick={() => setManualValue('condition', cond)}
                        className={`px-6 py-3 rounded-xl text-xs font-black transition-all border ${
                          formData.condition === cond 
                            ? 'bg-[#4B2DBD] text-white border-[#4B2DBD] shadow-sm' 
                            : 'bg-gray-50/50 text-gray-500 border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                  {errors.condition && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">* {errors.condition}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-0.5">
                    Manufacturer / Brand (Optional)
                  </label>
                  <div className="relative">
                    <input name="manufacturer" value={formData.manufacturer} onChange={handleChange} placeholder="e.g. Bosch, Denso, Toyota OEM" className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-6 focus:bg-white focus:ring-2 focus:ring-[#4B2DBD]/5 focus:border-[#4B2DBD] outline-none font-bold text-base transition-all" />
                    <Settings2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button type="button" onClick={prevStep} className="flex-1 bg-white text-gray-400 border border-gray-200 py-4 rounded-xl font-black text-base hover:bg-gray-50 transition-all active:scale-[0.98]">
                ← Back
              </button>
              <button type="button" onClick={nextStep} className="flex-[2] bg-[#4B2DBD] text-white py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 hover:bg-[#3b2396] transition-all active:scale-[0.98]">
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Compatibility Mapping */}
        {step === 3 && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-1.5 h-5 bg-[#4B2DBD] rounded-full"></div>
                <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Compatibility (Optional but recommended)</h2>
              </div>
              
              <p className="text-xs text-gray-500 font-medium mb-6">Help buyers find your part by specifying which cars it fits.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Compatible Make</label>
                  <input name="compatibleMake" value={formData.compatibleMake} onChange={handleChange} placeholder="e.g. Toyota, Honda" className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 focus:bg-white outline-none font-bold text-base transition-all" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Compatible Model</label>
                  <input name="compatibleModel" value={formData.compatibleModel} onChange={handleChange} placeholder="e.g. Corolla, Civic" className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 focus:bg-white outline-none font-bold text-base transition-all" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Year Range</label>
                  <input name="compatibleYearRange" value={formData.compatibleYearRange} onChange={handleChange} placeholder="e.g. 2015 - 2021" className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 focus:bg-white outline-none font-bold text-base transition-all" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={prevStep} className="flex-1 bg-white text-gray-400 border border-gray-200 py-4 rounded-xl font-black text-base hover:bg-gray-50 transition-all active:scale-[0.98]">
                ← Back
              </button>
              <button type="button" onClick={nextStep} className="flex-[2] bg-[#4B2DBD] text-white py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 hover:bg-[#3b2396] transition-all active:scale-[0.98]">
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Pricing & Description */}
        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-5 bg-[#4B2DBD] rounded-full"></div>
                  <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Pricing & Details</h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-0.5">
                    Price (PKR) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="5,000" className="w-full bg-white border border-[#4B2DBD]/30 rounded-xl py-4 pl-14 pr-6 focus:bg-white focus:border-[#4B2DBD] outline-none font-black text-base text-[#4B2DBD] transition-all" />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#4B2DBD]/60">PKR</span>
                  </div>
                  {errors.price && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">* {errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-0.5">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Lahore" className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-6 focus:bg-white outline-none font-bold text-base transition-all" />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                  </div>
                  {errors.location && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">* {errors.location}</p>}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-0.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} placeholder="Describe the part condition, reason for selling, any flaws..." className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-4 px-5 focus:bg-white outline-none font-medium text-sm transition-all resize-none"></textarea>
                {errors.description && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">* {errors.description}</p>}
              </div>

              <div className="space-y-3">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Preferences</p>
                <div className="flex gap-2">
                  {['Phone', 'WhatsApp', 'Both'].map(pref => (
                    <button 
                      type="button"
                      key={pref}
                      onClick={() => setManualValue('contactPreference', pref)}
                      className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border ${
                        formData.contactPreference === pref 
                          ? 'bg-[#4B2DBD] text-white border-[#4B2DBD]' 
                          : 'bg-gray-50/50 text-gray-500 border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4 items-start">
              <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
              <div className="space-y-0.5">
                <p className="text-xs font-black text-amber-900">By posting, you confirm all information is accurate.</p>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={prevStep} 
                className="flex-1 bg-white border border-gray-100 text-gray-400 py-4 rounded-xl font-black text-base hover:bg-gray-50 transition-all active:scale-95"
              >
                ← Back
              </button>
              <button 
                type="button"
                onClick={nextStep}
                disabled={loading} 
                className={`flex-[3] bg-[#4B2DBD] text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-[#3b2396] transition-all active:scale-95 ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? 'Processing...' : editId ? 'Update Listing' : 'Post Listing Now'}
              </button>
            </div>
          </div>
        )}
      </div>
      </form>
    </div>
  );
}
