const Footer = () => {
  return (
    <footer className="bg-[#4FB2E5] text-white py-12">
      <div className="container mx-auto px-5">
        {/* Top Section */}
        <div className="flex flex-wrap justify-between gap-10 mb-10">
          {/* Left Section */}
          <div className="max-w-xs">
            <p className="text-sm">
              Our vision is helping minds grow in strength, confidence, and emotional balance.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-white text-xl hover:text-gray-200"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-white text-xl hover:text-gray-200"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white text-xl hover:text-gray-200"><i className="fab fa-instagram"></i></a>
            </div>
          </div>

          {/* Links Section */}
          <div className="flex flex-wrap gap-10">
            <div>
              <h5 className="font-semibold mb-2">About</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:underline">How it works</a></li>
                <li><a href="#" className="hover:underline">FAQ</a></li>
                <li><a href="#" className="hover:underline">Partnership</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Community</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:underline">Events</a></li>
                <li><a href="#" className="hover:underline">Blog</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Socials</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:underline">Instagram</a></li>
                <li><a href="#" className="hover:underline">Twitter</a></li>
                <li><a href="#" className="hover:underline">Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/30 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
          <p>©2025 Company Name. All rights reserved</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy & Policy</a>
            <span>|</span>
            <a href="#" className="hover:underline">Terms & Condition</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
