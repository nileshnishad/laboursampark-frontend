"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 pt-12 pb-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand and description */}
        <div>
          <div className="flex items-center gap-2">
        <img src="/images/logo.jpg" alt="LabourSampark" className="w-35 h-10 rounded-lg" />
      </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">Connecting skilled labours and trusted contractors for all your project needs. Fast, reliable, and easy to use.</p>
          <div className="flex gap-3 mt-2">
            <a href="#" aria-label="Facebook" className="text-blue-600 dark:text-blue-300 hover:underline">Facebook</a>
            <a href="#" aria-label="Twitter" className="text-blue-600 dark:text-blue-300 hover:underline">Twitter</a>
            <a href="#" aria-label="Instagram" className="text-blue-600 dark:text-blue-300 hover:underline">Instagram</a>
          </div>
        </div>
        {/* Quick Links */}
        <div>
          <div className="font-semibold text-gray-900 dark:text-white mb-2">Quick Links</div>
          <ul className="flex flex-col gap-2 text-gray-700 dark:text-gray-300 text-sm">
            <li><a href="#hero" className="hover:underline">Home</a></li>
            <li><a href="#labours" className="hover:underline">Labours</a></li>
            <li><a href="#contractors" className="hover:underline">Contractors</a></li>
            <li><a href="#about" className="hover:underline">About</a></li>
            <li><a href="#contact" className="hover:underline">Contact</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
          </ul>
        </div>
        {/* Contact Info */}
        <div>
          <div className="font-semibold text-gray-900 dark:text-white mb-2">Contact Us</div>
          <ul className="text-gray-700 dark:text-gray-300 text-sm flex flex-col gap-2">
            <li>Email: <a href="mailto:info@laboursampark.com" className="hover:underline">info@laboursampark.com</a></li>
            <li>Phone: <a href="tel:+911234567890" className="hover:underline">+91 12345 67890</a></li>
            <li>Address: 123, Main Road, City, India</li>
          </ul>
        </div>
        {/* Newsletter */}
        <div>
          <div className="font-semibold text-gray-900 dark:text-white mb-2">Newsletter</div>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="px-3 py-2 rounded border border-gray-300 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 outline-none text-sm"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-8 border-t border-gray-200 dark:border-gray-800 pt-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div>© {new Date().getFullYear()} LabourSampark. All rights reserved.</div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
