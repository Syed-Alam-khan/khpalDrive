import { FaWhatsapp, FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#4B2DBD] text-white py-2 px-3 md:px-8 mt-auto h-[60px] md:h-[70px] flex items-center">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center gap-2">
        
        {/* Brand & Copyright */}
        <div className="flex items-center gap-2">
          <img src="/kd_logo.png" alt="KhpalDrive" className="h-6 md:h-8 w-auto object-contain" />
          <p className="text-[8px] md:text-[11px] opacity-80 font-medium mt-1">
            &copy; 2026 KhpalDrive
          </p>
        </div>

        {/* Contact Info */}
        <div className="hidden md:flex gap-3 text-[11px] font-medium opacity-90">
          <p>Contact: +92347 858</p>
          <span>|</span>
          <p>Email: khpaldrive@gmail.com</p>
        </div>

        {/* Social */}
        <div className="flex gap-1.5 md:gap-3">
          <a href="#" className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center text-[#4B2DBD] hover:bg-opacity-90 transition-all shadow-md">
            <FaWhatsapp size={12} className="md:w-[16px] md:h-[16px]" />
          </a>
          <a href="#" className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center text-[#4B2DBD] hover:bg-opacity-90 transition-all shadow-md">
            <FaInstagram size={12} className="md:w-[16px] md:h-[16px]" />
          </a>
          <a href="#" className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center text-[#4B2DBD] hover:bg-opacity-90 transition-all shadow-md">
            <FaFacebookF size={10} className="md:w-[14px] md:h-[14px]" />
          </a>
          <a href="#" className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center text-[#4B2DBD] hover:bg-opacity-90 transition-all shadow-md">
            <FaTiktok size={10} className="md:w-[14px] md:h-[14px]" />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
