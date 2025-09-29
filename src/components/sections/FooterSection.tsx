export function FooterSection() {
  return (
    <footer className="py-12 px-4 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <img 
              src="/brand/logo.png" 
              alt="KLYP Logo" 
              className="h-8 w-auto"
            />
          </div>
          
          {/* Contact */}
          <div className="text-center md:text-right">
            <a 
              href="mailto:ping@klyp.travel" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              ping@klyp.travel
            </a>
          </div>
        </div>
        
        {/* Bottom row */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div>© 2024 KLYP. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="/admin" className="hover:text-white transition-colors">Admin</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}