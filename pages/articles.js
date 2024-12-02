import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

function HomePage() {
  const router = useRouter();
  const [showBlog, setShowBlog] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [showSubheader, setShowSubheader] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('home');
  const [showImage, setShowImage] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const menuItems = [
  { 
    id: 'home', 
    label: 'HOME', 
    href: '/',
    subItems: [] // Removed subitems
  },
  { 
    id: 'about', 
    label: 'ABOUT', 
    href: '/about',
    subItems: [] 
  },
  { 
    id: 'portfolio', 
    label: 'PORTFOLIO', 
    href: '/portfolio',
    subItems: [] 
  },
  { 
    id: 'projects', 
    label: 'PROJECTS', 
    href: '/projects',
    subItems: [] 
  },
  { 
    id: 'articles', 
    label: 'ARTICLES', 
    href: '/contact',
    subItems: [] 
  },
  { 
    id: 'resources', 
    label: 'RESOURCES', 
    href: '/resources',
    subItems: [] 
  },
  { 
    id: 'contact', 
    label: 'CONTACT', 
    href: '/contact',
    subItems: [] 
  }
];

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowImage(true), 500),
      setTimeout(() => setShowBlog(true), 500),
      setTimeout(() => setShowResources(true), 1000),
      setTimeout(() => setShowHeader(true), 1500),
      setTimeout(() => setShowSubheader(true), 2000)
    ];
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Example API call - replace with your actual endpoint
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setEmail('');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 mx-auto max-w-screen-xl relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900">
        <div className="mx-auto max-w-screen-xl w-full px-4">
          <div className="flex justify-between items-center h-20"> {/* Reduced from h-24 to h-20 */}
            <Link href="/">
              <div className="cursor-pointer">
                <img 
                  src="/assets/images/icogo150.png" 
                  alt="Monarkh Logo" 
                  width={150} 
                  height={150}
                  className="w-[65px] h-[65px]" // Keeping the logo size as requested
                />
              </div>
            </Link>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 w-8 h-8 flex items-center justify-center" // Back to smaller button area
            >
              {isMenuOpen ? (
                <div className="relative w-6 h-6"> {/* Reduced from w-8 h-8 */}
                  <div className="absolute top-1/2 left-0 w-6 h-0.5 bg-white rotate-45"></div>
                  <div className="absolute top-1/2 left-0 w-6 h-0.5 bg-white -rotate-45"></div>
                </div>
              ) : (
                <div className="space-y-1"> {/* Reduced spacing from space-y-2 */}
                  <div className="w-6 h-0.5 bg-green-500"></div>
                  <div className="w-6 h-0.5 bg-green-500"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/95 transition-transform duration-500 ease-in-out z-40
          ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="container mx-auto px-4 pt-24">
          <nav className="space-y-6">
            {menuItems.map((item) => (
              <div key={item.id} className="overflow-hidden">
                {item.subItems.length > 0 ? (
                  // Menu items with subitems
                  <button
                    onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                    className="w-full flex justify-between items-center text-white hover:text-green-500 transition-colors py-2"
                  >
                    <span className="text-2xl font-light">{item.label}</span>
                    <span 
                      className={`text-green-500 transition-transform duration-300 
                        ${activeMenu === item.id ? 'rotate-180' : ''}`}
                    >
                      ▼
                    </span>
                  </button>
                ) : (
                  // Menu items without subitems - direct links
                  <Link href={item.href}>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left text-white hover:text-green-500 transition-colors py-2"
                    >
                      <span className="text-2xl font-light">{item.label}</span>
                    </button>
                  </Link>
                )}

                {item.subItems.length > 0 && (
                  <div 
                    className={`space-y-4 pl-4 transition-all duration-300 
                      ${activeMenu === item.id ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
                  >
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem}
                        className="block w-full text-left text-gray-400 hover:text-white transition-colors py-1"
                      >
                        {subItem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex items-center justify-center p-4 min-h-[90vh]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative mb-16">
            <div 
              className={`text-8xl font-bold bg-gradient-to-b from-gray-600 to-transparent bg-clip-text text-transparent
                transition-all duration-1000 transform
                ${showBlog ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
            >
              BLOG
            </div>
            <div 
              className={`absolute bottom-2 left-0 right-0 text-gray-400 text-sm
                transition-all duration-1000 transform
                ${showResources ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              BLOG AND RESOURCES
            </div>
          </div>

          <h1 
            className={`text-white text-4xl font-light mb-8 leading-relaxed
              transition-all duration-1000 transform
              ${showHeader ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
          >
            Turn your dreams into reality by crafting your world with us
          </h1>

          <p 
            className={`text-gray-400 text-lg
              transition-all duration-1000 transform
              ${showSubheader ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
          >
            Lorem ipsum dolor sit amet consectetur.
            <br />
            Scelerisque cursus eget aliquet vel elit.
          </p>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-900 p-16 text-center">
        <div className="mb-8">
          <svg
            viewBox="0 0 24 24"
            className="w-16 h-16 mx-auto text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M0 9l12 6L24 9M0 9v13h24V9M0 9l12 2l12-2" />
            <path className="opacity-60" d="M-4 9l4 0M24 9l4 0" strokeDasharray="1 2" />
          </svg>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-light text-white mb-8 leading-tight">
          Get the latest <span className="text-orange-200">updates</span>
          <br />
          direct to inbox
        </h2>

        <form onSubmit={handleNewsletterSubmit} className="max-w-xl mx-auto">
          <div className="mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-6 py-4 bg-gray-800/50 text-gray-300 placeholder-gray-500 
                       border-b border-gray-700 focus:border-orange-200 focus:outline-none
                       transition-colors text-lg"
              required
              disabled={isSubmitting}
            />
          </div>

          {submitStatus && (
            <div className={`mb-4 text-sm ${submitStatus === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {submitStatus === 'success' ? 'Successfully subscribed!' : 'Something went wrong. Please try again.'}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="group inline-flex items-center gap-2 text-white text-xl 
                     border-b-2 border-orange-200 pb-1 hover:border-white transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'SENDING...' : 'SUBSCRIBE'}
          </button>
        </form>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 px-8 py-16 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          {/* Logo Section */}
          <div className="mb-16">
            <div className="text-3xl text-white font-light mb-6">John Li</div>
            <p className="text-gray-400 mt-4">
              Portfolio, Projects, and Resources{' '}
              <span className="italic"></span> 
            </p>
          </div>

          {/* Location Section */}
          <div className="mb-16">
            <h3 className="text-3xl text-white font-light mb-6">Location</h3>
            <address className="text-gray-400 not-italic">
              Abu Dhabi,<br />
              United Arab Emirates
            </address>
          </div>

          {/* Contact Section */}
          <div className="mb-16">
            <h3 className="text-3xl text-white font-light mb-6">Let's Connect.</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-orange-200">✉</span>
                <a href="mailto:info@example.com" className="text-gray-400 hover:text-white transition-colors">
                  mail@johnny.ae
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-200">📞</span>
                <a href="tel:054-376-2321" className="text-gray-400 hover:text-white transition-colors">
                  054 376 2321
                </a>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 mb-16">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
            <span className="text-gray-600">/</span>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">X/Twitter</a>
            <span className="text-gray-600">/</span>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
          </div>

          {/* Footer Credits */}
          <div className="text-center text-gray-400 text-sm">
            <p>
              Designed by{' '}
              <a href="#" className="text-white hover:text-orange-200 transition-colors">
                Monarkh AI Design and Build
              </a>
              , Powered by{' '}
              <a href="#" className="text-white hover:text-orange-200 transition-colors">
                Monarkh
              </a>
            </p>
            <a href="#" className="text-gray-400 hover:text-white transition-colors mt-2 inline-block">
              Privacy
            </a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }

        @keyframes scrollRight {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }

        .animate-scroll-left {
          animation: scrollLeft 12s linear infinite;
        }

        .animate-scroll-right {
          animation: scrollRight 12s linear infinite;
        }

        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export default HomePage;
