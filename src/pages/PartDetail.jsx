import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAutoPart } from '../context/AutoPartContext';
import { FaPhoneAlt, FaWhatsapp, FaArrowLeft, FaCar, FaMapMarkerAlt, FaCalendarAlt, FaCog } from 'react-icons/fa';

export default function PartDetail() {
  const { id } = useParams();
  const { getPartById } = useAutoPart();
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPart = async () => {
      try {
        const data = await getPartById(id);
        setPart(data);
      } catch (error) {
        toast.error("Failed to load part details");
      } finally {
        setLoading(false);
      }
    };
    fetchPart();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!part) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-black text-gray-900 mb-4">Part Not Found</h2>
        <Link to="/" className="text-[#4B2DBD] font-bold hover:underline">Go back home</Link>
      </div>
    );
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (typeof imagePath === 'string' && imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000/uploads/${imagePath}`;
  };

  const images = part.images && part.images.length > 0 ? part.images : [];

  const handleWhatsApp = () => {
    let phone = part.seller?.phoneNumber || part.seller?.phone || '';
    phone = phone.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '92' + phone.slice(1);
    }
    if (phone.length === 10) {
      phone = '92' + phone;
    }
    const message = `Hi, I am interested in your auto part: ${part.title} listed for PKR ${part.price?.toLocaleString()} on KhpalDrive.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = () => {
    const phone = (part.seller?.phoneNumber || part.seller?.phone || '').replace(/\D/g, '');
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Top Banner */}
      <div className="bg-[#4B2DBD] pt-6 pb-6 px-4 md:px-12 text-white shadow-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-4 relative z-10">
          <Link to="/" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <FaArrowLeft />
          </Link>
          <h1 className="text-xl md:text-3xl font-black tracking-tight flex-1 truncate">{part.title}</h1>
          <div className="hidden md:block text-right">
             <p className="text-sm font-bold text-white/80 uppercase tracking-widest mb-1">Asking Price</p>
             <p className="text-3xl font-black">PKR {part.price?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 mt-6 md:mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2 space-y-6 md:space-y-10">
          
          {/* Main Image Gallery */}
          <div className="bg-gray-50 rounded-[2rem] p-4 md:p-6 border border-gray-100">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-4 shadow-sm border border-gray-100">
              {images.length > 0 ? (
                <img 
                  src={getImageUrl(images[activeImage])} 
                  alt={part.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest bg-gray-100">
                  No Image Available
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#4B2DBD] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:hidden bg-[#4B2DBD]/10 rounded-2xl p-6 border border-[#4B2DBD]/20 text-center">
             <p className="text-xs font-bold text-[#4B2DBD] uppercase tracking-widest mb-1">Asking Price</p>
             <p className="text-3xl font-black text-[#4B2DBD]">PKR {part.price?.toLocaleString()}</p>
          </div>

          {/* Specifications Grid */}
          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
               <FaCog className="text-[#4B2DBD]" /> Specifications
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Condition</p>
                <p className="text-sm font-black text-gray-900">{part.condition}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Category</p>
                <p className="text-sm font-black text-gray-900">{part.category}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</p>
                <p className="text-sm font-black text-gray-900 flex items-center gap-1">
                   <FaMapMarkerAlt className="text-gray-400" /> {part.location}
                </p>
              </div>
              {part.manufacturer && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Brand</p>
                  <p className="text-sm font-black text-gray-900">{part.manufacturer}</p>
                </div>
              )}
            </div>
          </div>

          {/* Compatibility */}
          {(part.compatibleMake || part.compatibleModel || part.compatibleYearRange) && (
            <div>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                 <FaCar className="text-[#4B2DBD]" /> Compatibility
              </h2>
              <div className="bg-[#4B2DBD]/5 p-6 rounded-2xl border border-[#4B2DBD]/10 flex flex-wrap gap-x-8 gap-y-4">
                {part.compatibleMake && (
                  <div>
                    <p className="text-[10px] font-black text-[#4B2DBD]/70 uppercase tracking-widest mb-1">Make</p>
                    <p className="text-sm font-black text-gray-900">{part.compatibleMake}</p>
                  </div>
                )}
                {part.compatibleModel && (
                  <div>
                    <p className="text-[10px] font-black text-[#4B2DBD]/70 uppercase tracking-widest mb-1">Model</p>
                    <p className="text-sm font-black text-gray-900">{part.compatibleModel}</p>
                  </div>
                )}
                {part.compatibleYearRange && (
                  <div>
                    <p className="text-[10px] font-black text-[#4B2DBD]/70 uppercase tracking-widest mb-1">Years</p>
                    <p className="text-sm font-black text-gray-900 flex items-center gap-1">
                      <FaCalendarAlt className="text-[#4B2DBD]" size={12} /> {part.compatibleYearRange}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6">Description</h2>
            <div className="bg-gray-50 p-6 md:p-8 rounded-[2rem] border border-gray-100">
              <p className="text-sm font-medium text-gray-700 leading-relaxed whitespace-pre-wrap">{part.description}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Seller Info */}
        <div className="lg:sticky lg:top-32 space-y-6">
          <div className="bg-white rounded-[2rem] border-2 border-[#4B2DBD]/20 p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-14 h-14 bg-[#4B2DBD]/10 rounded-full flex items-center justify-center text-[#4B2DBD] font-black text-xl">
                {part.seller?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Seller</p>
                <h3 className="text-lg font-black text-gray-900">{part.seller?.name}</h3>
              </div>
            </div>

            <div className="space-y-3">
              {(part.contactPreference === 'Phone' || part.contactPreference === 'Both') && (
                <button 
                  onClick={handleCall}
                  className="w-full bg-[#4B2DBD] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#3b2396] transition-all"
                >
                  <FaPhoneAlt /> Call Seller
                </button>
              )}
              
              {(part.contactPreference === 'WhatsApp' || part.contactPreference === 'Both') && (
                <button 
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#20b958] transition-all"
                >
                  <FaWhatsapp size={18} /> WhatsApp
                </button>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
            <p className="text-xs font-bold text-gray-500">Safety Tip: Never pay in advance and always meet in a safe public place.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
