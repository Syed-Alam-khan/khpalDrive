import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAutoPart } from '../context/AutoPartContext';
import { 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Phone, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
  Settings2,
  Car,
  LayoutGrid,
  Tag
} from 'lucide-react';

export default function PartDetail() {
  const { id } = useParams();
  const { getPartById } = useAutoPart();
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

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

  useEffect(() => {
    if (isFullScreenOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isFullScreenOpen]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-[#4B2DBD] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Retrieving Part Data...</p>
    </div>
  );

  if (!part) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
         <div className="text-6xl font-black text-gray-100 uppercase">404</div>
         <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Part listing not found.</p>
         <button onClick={() => window.history.back()} className="bg-[#4B2DBD] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase">Go Back</button>
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
    <div className="max-w-5xl mx-auto w-full px-4 md:px-6 py-4 md:py-6 pb-48 lg:pb-6 animate-in fade-in duration-700">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs md:text-sm font-medium mb-5 text-gray-900">
        <Link to="/" className="hover:underline underline-offset-4">Home</Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-500 truncate">{part.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative group rounded-[1.2rem] overflow-hidden bg-gray-50 border-2 border-gray-100">
            {images.length > 0 ? (
              <img 
                src={getImageUrl(images[activeImage])} 
                alt={part.title} 
                className="w-full aspect-[16/9] md:aspect-[21/9] object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in" 
                onClick={() => setIsFullScreenOpen(true)}
              />
            ) : (
              <div className="w-full aspect-[16/9] md:aspect-[21/9] flex items-center justify-center text-gray-400 font-black uppercase tracking-widest bg-gray-100">
                No Image Available
              </div>
            )}
            
            {images.length > 0 && (
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-black">
                 {activeImage + 1} / {images.length}
              </div>
            )}
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  onClick={() => setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all p-0.5 ${activeImage === i ? 'border-[#4B2DBD]' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img src={getImageUrl(img)} className="w-full h-full object-cover rounded-md" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-white border border-gray-100 px-3 py-1.5 rounded-md text-gray-500 font-bold text-[10px] md:text-xs uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={14} className="text-gray-400" />
              {part.location}
            </div>
            <div className="bg-white border border-gray-100 px-3 py-1.5 rounded-md text-[#4B2DBD] font-bold text-[10px] md:text-xs uppercase tracking-wider flex items-center gap-1.5">
              {part.condition}
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-lg md:text-xl font-black text-gray-900 tracking-tight uppercase">
              {part.category} <span className="text-gray-300 mx-2">|</span> {part.manufacturer || 'Spare Part'}
            </h1>
            <div className="flex flex-col gap-0">
              <p className="text-sm md:text-lg font-bold text-gray-500 uppercase tracking-widest">
                {part.title}
              </p>
              <div className="text-2xl md:text-3xl font-black text-[#4B2DBD] tracking-tight">
                PKR {part.price?.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Condition', value: part.condition, icon: ShieldCheck },
              { label: 'Category', value: part.category, icon: LayoutGrid },
              { label: 'Brand', value: part.manufacturer || 'N/A', icon: Tag },
              { label: 'Compatible Make', value: part.compatibleMake || 'Any Make', icon: Car },
              { label: 'Compatible Model', value: part.compatibleModel || 'Any Model', icon: Settings2 },
              { label: 'Compatible Years', value: part.compatibleYearRange || 'Any Year', icon: Calendar }
            ].map((spec, idx) => (
              <div key={idx} className="bg-gray-100 p-3 rounded-xl border-2 border-gray-100/50 flex flex-col items-center text-center space-y-1.5">
                <spec.icon size={18} className="text-[#4B2DBD]" strokeWidth={2.5} />
                <div className="space-y-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{spec.label}</p>
                  <p className="font-black text-gray-900 text-xs md:text-sm truncate max-w-[120px]">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description Section */}
          {part.description && (
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</h4>
              <p className="text-sm font-medium text-gray-600 leading-relaxed whitespace-pre-line">
                {part.description}
              </p>
            </div>
          )}

          {/* Seller Section */}
          <div className="lg:relative lg:mt-8 fixed bottom-0 left-0 w-full lg:w-auto bg-white p-4 lg:rounded-[1.2rem] rounded-t-[1.5rem] z-40">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Seller Profile */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full border-2 border-[#4B2DBD]/10 overflow-hidden ring-2 ring-white">
                    {part.seller?.imageUrl ? (
                      <img src={part.seller.imageUrl.startsWith('http') ? part.seller.imageUrl : `http://localhost:3000/uploads/${part.seller.imageUrl}`} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full bg-purple-50 flex items-center justify-center text-[#4B2DBD] font-black text-sm uppercase">
                        {part.seller?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={12} className="text-[#25D366]" fill="currentColor" fillOpacity={0.15} />
                    <span className="text-[10px] font-black text-[#25D366] uppercase tracking-widest">Verified Seller</span>
                  </div>
                  <h3 className="text-base md:text-lg font-black text-gray-900 leading-none">{part.seller?.name || 'Seller Name'}</h3>
                  <p className="text-xs md:text-sm font-bold text-gray-400 tabular-nums">{part.seller?.phoneNumber || '03454740876'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {(part.contactPreference === 'WhatsApp' || part.contactPreference === 'Both') && (
                  <button 
                    onClick={handleWhatsApp}
                    className="flex-1 sm:flex-none bg-[#25D366] hover:bg-[#20bd5c] text-white px-5 py-3 rounded-full font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <MessageSquare size={16} fill="currentColor" />
                    WhatsApp
                  </button>
                )}
                {(part.contactPreference === 'Phone' || part.contactPreference === 'Both') && (
                  <button 
                    onClick={handleCall}
                    className="flex-1 sm:flex-none bg-white hover:bg-gray-50 text-gray-900 px-5 py-3 rounded-full font-black text-xs flex items-center justify-center gap-1.5 border border-gray-200 transition-all active:scale-95"
                  >
                    <Phone size={16} fill="currentColor" className="text-gray-400" />
                    Call Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {isFullScreenOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300"
          onClick={() => setIsFullScreenOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 z-[110]"
            onClick={() => setIsFullScreenOpen(false)}
          >
            <X size={32} />
          </button>
          
          <div className="relative w-full max-w-5xl px-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
             <img 
               src={getImageUrl(images[activeImage])} 
               className="max-w-full max-h-[90vh] object-contain rounded-lg animate-in zoom-in duration-500"
               alt=""
             />
             
             {images.length > 1 && (
               <>
                 <button 
                   onClick={() => setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                   className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                 >
                   <ChevronLeft size={24} />
                 </button>
                 <button 
                   onClick={() => setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                   className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                 >
                   <ChevronRight size={24} />
                 </button>
               </>
             )}
             
             <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/50 font-black text-[10px] uppercase tracking-[0.3em]">
                {activeImage + 1} / {images.length}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
