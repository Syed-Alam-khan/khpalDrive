import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCar } from '../context/CarContext';
import { 
  MapPin, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings2, 
  ShieldCheck, 
  Phone, 
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function CarDetail() {
  const { id } = useParams();
  const { getSingleCar, singleCar, loading } = useCar();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) {
      getSingleCar(id);
    }
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-[#4B2DBD] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Retrieving Vehicle Data...</p>
    </div>
  );

  if (!singleCar) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
       <div className="text-6xl font-black text-gray-100 uppercase">404</div>
       <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Vehicle listing not found.</p>
       <button onClick={() => window.history.back()} className="bg-[#4B2DBD] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase">Go Back</button>
    </div>
  );

  const car = singleCar;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/cars/modern_vitz_car_1776686479016.png';
    if (typeof imagePath === 'string' && imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000/uploads/${imagePath}`;
  };

  const handleWhatsApp = () => {
    let phone = car.seller?.phoneNumber || '';
    // Clean phone number: remove all non-digits
    phone = phone.replace(/\D/g, '');
    // Replace leading 0 with 92 (assuming Pakistan)
    if (phone.startsWith('0')) {
      phone = '92' + phone.slice(1);
    }
    // If it's a 10-digit number without country code, add 92
    if (phone.length === 10) {
      phone = '92' + phone;
    }
    
    const message = `Hi, I'm interested in your ${car.carName} (${car.model}) listed for PKR ${car.price?.toLocaleString()}.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 md:px-6 py-4 md:py-6 animate-in fade-in duration-700">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[10px] md:text-xs font-medium mb-5 text-gray-900">
        <Link to="/" className="hover:underline underline-offset-4">Home</Link>
        <span className="text-gray-400">/</span>
        <Link to="/all-cars" className="hover:underline underline-offset-4">All Cars</Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-500 truncate">{car.carName} {car.model}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative group rounded-[1.2rem] overflow-hidden bg-gray-50 border-2 border-gray-100 shadow-md">
            <img 
              src={getImageUrl(car.images?.[activeImage])} 
              alt={car.carName} 
              className="w-full aspect-[4/3] md:aspect-[16/11] object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-[10px] font-black shadow-sm">
               {activeImage + 1} / {car.images?.length || 1}
            </div>
            
            {car.images?.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImage(prev => prev === 0 ? car.images.length - 1 : prev - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  onClick={() => setActiveImage(prev => prev === car.images.length - 1 ? 0 : prev + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-2">
            {car.images?.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(i)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all p-0.5 ${activeImage === i ? 'border-[#4B2DBD]' : 'border-transparent hover:border-gray-200'}`}
              >
                <img src={getImageUrl(img)} className="w-full h-full object-cover rounded-md" alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-white border border-gray-100 px-2.5 py-1 rounded-md text-gray-500 font-bold text-[9px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <MapPin size={12} className="text-gray-400" />
              {car.location}
            </div>
          </div>
          <div className="space-y-1">
            <h1 className=" font-black text-gray-900 tracking-tight uppercase">
              {car.carName} {car.model}
            </h1>
            <div className="text-2xl md:text-3xl font-black text-[#4B2DBD] tracking-tight">
              PKR, {car.price?.toLocaleString()}
            </div>
          </div>



          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-100 p-3 rounded-xl border-2 border-gray-100/50 flex flex-col items-center text-center space-y-1.5">
              <Gauge size={16} className="text-[#4B2DBD]" strokeWidth={2.5} />
              <div className="space-y-0">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Engine</p>
                <p className="font-black text-gray-900 text-[11px] md:text-xs">{car.engineCC}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-3 rounded-xl border-2 border-gray-100/50 flex flex-col items-center text-center space-y-1.5">
              <Fuel size={16} className="text-[#4B2DBD]" strokeWidth={2.5} />
              <div className="space-y-0">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Fuel</p>
                <p className="font-black text-gray-900 text-[11px] md:text-xs">{car.fuelType}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-3 rounded-xl border-2 border-gray-100/50 flex flex-col items-center text-center space-y-1.5">
              <Settings2 size={16} className="text-[#4B2DBD]" strokeWidth={2.5} />
              <div className="space-y-0">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Trans.</p>
                <p className="font-black text-gray-900 text-[11px] md:text-xs">{car.transmission}</p>
              </div>
            </div>
          </div>

          {/* Details Row */}
          <div className="flex flex-wrap gap-2">
            {[

              { label: 'Mileage', value: car.mileage },
              { label: 'Cond.', value: car.condition },
              { label: 'Type', value: car.type },
              { label: 'Cat.', value: car.category?.name || 'N/A' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 border-2 border-gray-100 px-3 py-1 rounded-full text-[9px] font-bold text-gray-600 bg-white shadow-sm">
                <span className="text-gray-400">{item.label}</span>
                <span className="text-gray-900 font-black">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Description Section */}
          {car.description && (
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</h4>
              <p className="text-xs font-medium text-gray-600 leading-relaxed whitespace-pre-line">
                {car.description}
              </p>
            </div>
          )}

          {/* Seller Section */}
          <div className="bg-white border-2 border-gray-100 p-4 rounded-[1.2rem] shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Seller Profile */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full border-2 border-[#4B2DBD]/10 overflow-hidden ring-2 ring-white shadow-sm">
                    {car.seller?.imageUrl ? (
                      <img src={car.seller.imageUrl.startsWith('http') ? car.seller.imageUrl : `http://localhost:3000/uploads/${car.seller.imageUrl}`} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full bg-purple-50 flex items-center justify-center text-[#4B2DBD] font-black text-sm uppercase">
                        {car.seller?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={10} className="text-[#25D366]" fill="currentColor" fillOpacity={0.15} />
                    <span className="text-[8px] md:text-[9px] font-black text-[#25D366] uppercase tracking-widest">Verified Seller</span>
                  </div>
                  <h3 className="text-sm md:text-base font-black text-gray-900 leading-none">{car.seller?.name || 'Seller Name'}</h3>
                  <p className="text-[10px] font-bold text-gray-400 tabular-nums">{car.seller?.phoneNumber || '03454740876'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={handleWhatsApp}
                  className="flex-1 sm:flex-none bg-[#25D366] hover:bg-[#20bd5c] text-white px-4 py-2.5 rounded-full font-black text-[10px] md:text-[11px] flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md shadow-green-100"
                >
                  <MessageSquare size={14} fill="currentColor" />
                  WhatsApp
                </button>
                <button 
                  onClick={() => {
                    const cleanPhone = (car.seller?.phoneNumber || '').replace(/\D/g, '');
                    window.location.href = `tel:${cleanPhone}`;
                  }}
                  className="flex-1 sm:flex-none bg-white hover:bg-gray-50 text-gray-900 px-4 py-2.5 rounded-full font-black text-[10px] md:text-[11px] flex items-center justify-center gap-1.5 border border-gray-200 transition-all active:scale-95 shadow-sm"
                >
                  <Phone size={14} fill="currentColor" className="text-gray-400" />
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}

