import { Link } from 'react-router-dom';

export default function CarCard({ car }) {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/cars/modern_vitz_car_1776686479016.png';
    if (typeof imagePath === 'string' && imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000/uploads/${imagePath}`;
  };

  return (
    <Link to={`/detail/${car._id}`} className="block group">
      <div className="bg-white border-[3px] border-gray-200 rounded-2xl overflow-hidden transition-all duration-300">
        {/* Car Image */}
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={getImageUrl(car.images?.[0])}
            alt={car.carName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Car Info */}
        <div className="p-3 md:p-4 flex items-center justify-between gap-2">
          {/* Text Content */}
          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="text-base font-black text-gray-800 truncate">
              {car.carName}
            </h3>
            <p className="text-[11px] font-black text-black uppercase tracking-widest mb-1">
              {car.category?.name || 'Luxury'}
            </p>
            <p className="text-[#4B2DBD] font-black text-xl md:text-base truncate">
              PKR {car.price?.toLocaleString()}
            </p>
          </div>

          {/* Show Details Button */}
          <div className="bg-[#4B2DBD] text-white text-[10px] font-bold px-3 py-2 rounded-lg hover:opacity-90 transition-all uppercase tracking-wider whitespace-nowrap shrink-0">
            Show details
          </div>
        </div>
      </div>
    </Link>
  );
}
