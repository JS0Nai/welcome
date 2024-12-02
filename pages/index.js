import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useInView } from '../hooks/useInView';

function HomePage() {
  const router = useRouter();
  
  // State declarations
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
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [numbers, setNumbers] = useState([0, 0, 0, 0, 0]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // InView hooks
  const [heroRef, heroInView] = useInView({ threshold: 0.2 });
  const [portfolioRef, portfolioInView] = useInView({ threshold: 0.2 });
  const [newsletterRef, newsletterInView] = useInView({ threshold: 0.2 });

  const menuItems = [
    { id: 'home', label: 'HOME', href: '/', subItems: [] },
    { id: 'about', label: 'ABOUT', href: '/about', subItems: [] },
    { id: 'portfolio', label: 'PORTFOLIO', href: '/portfolio', subItems: [] },
    { id: 'projects', label: 'PROJECTS', href: '/projects', subItems: [] },
    { id: 'articles', label: 'ARTICLES', href: '/articles', subItems: [] },
    { id: 'resources', label: 'RESOURCES', href: '/resources', subItems: [] },
    { id: 'contact', label: 'CONTACT', href: '/contact', subItems: [] }
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

  useEffect(() => {
    if (portfolioInView) {
      const duration = 2000;
      const steps = 50;
      const interval = duration / steps;
      const targetNumbers = [4, 20, 15, 30, 50];
      
      const animateNumbers = () => {
        for (let i = 0; i <= steps; i++) {
          setTimeout(() => {
            setNumbers(prevNumbers =>
              prevNumbers.map((num, index) =>
                Math.round((targetNumbers[index] * i) / steps)
              )
            );
          }, i * interval);
        }
      };

      animateNumbers();
    } else {
      setNumbers([0, 0, 0, 0, 0]);
    }
  }, [portfolioInView]);

  const topSliderImages = [
    "/assets/images/artdoll.png",
    "/assets/images/fantasyscene.png",
    "/assets/images/dolly01.png",
    "/assets/images/artgirl.png",
    "/assets/images/artgirl2.png"
  ];

  const handleSlideChange = (direction) => {
    const slider = document.querySelector('.image-slider-left');
    const scrollAmount = direction === 'left' ? -288 : 288;
    
    if (slider) {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      const newScrollPosition = slider.scrollLeft + scrollAmount;
      
      if (newScrollPosition >= 0 && newScrollPosition <= maxScroll) {
        slider.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      } else {
        // If we're at the end, loop back to start
        slider.scrollTo({
          left: direction === 'left' ? maxScroll : 0,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
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
    <div>
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900">
        <div className="mx-auto max-w-screen-xl w-full px-4">
          <div className="flex justify-between items-center h-20">
            <Link href="/">
              <div className="cursor-pointer">
                <img 
                  src="/assets/images/icogo150.png" 
                  alt="Monarkh Logo" 
                  width={150} 
                  height={150}
                  className="w-[65px] h-[65px]"
                />
              </div>
            </Link>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 w-8 h-8 flex items-center justify-center"
            >
              {isMenuOpen ? (
                <div className="relative w-6 h-6">
                  <div className="absolute top-1/2 left-0 w-6 h-0.5 bg-white rotate-45"></div>
                  <div className="absolute top-1/2 left-0 w-6 h-0.5 bg-white -rotate-45"></div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="w-6 h-0.5 bg-green-500"></div>
                  <div className="w-6 h-0.5 bg-green-500"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>
    </div>

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

{/* Signature Image Section */}
      <div>
        <div className="flex justify-center items-center pt-24 pb-8">
          <div className="relative w-full max-w-2xl mx-auto px-4">
            <img 
              src="/assets/images/jli-signature1000.png"
              alt="JLi Signature"
              width={1200}
              height={1000}
              className={`w-full h-auto object-contain max-w-lg mx-auto
                opacity-0 transition-opacity duration-1000 
                ${showImage ? 'opacity-80' : 'opacity-0'}
                sm:w-4/5 md:w-3/4 lg:w-2/3`}
            />
          </div>
        </div>

        {/* Hero Section */}
        <div ref={heroRef} className="flex items-center justify-center p-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className={`relative mb-16 scroll-animate ${heroInView ? 'fade-in' : ''}`}>
              <div className="text-8xl font-bold bg-gradient-to-b from-gray-600 to-transparent bg-clip-text text-transparent">
                WELCOME
              </div>
              <div className="absolute bottom-2 left-0 right-0 text-gray-400 text-sm">
                CREATE  |  DESIGN  |  BUILD  |  DEPLOY
              </div>
            </div>

            <h1 className={`text-white text-4xl font-light mb-8 leading-relaxed scroll-animate-left ${heroInView ? 'fade-in' : ''}`}
                style={{ transitionDelay: '200ms' }}>
              Creative freedom and the pursuit of improving how things work
            </h1>

            <p className={`text-gray-400 text-lg scroll-animate-right ${heroInView ? 'fade-in' : ''}`}
              style={{ transitionDelay: '400ms' }}>
              <br />
            </p>
          </div>
        </div>
      </div>

{/* Portfolio Showcase Section */}
      <div className="relative bg-gray-900 py-24 overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-7xl font-extralight mb-4 tracking-wide text-white dark:text-gray-200 font-garamond"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <span className="text-orange-200/90">Creative</span>{' '}
            <span className="text-white">Works</span>
          </h2>
        </div>

{/* Top Slider */}
<div className="relative overflow-hidden mb-8 py-4">
  <button
    onClick={() => handleSlideChange('left')}
    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all"
    aria-label="Previous slide"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>

  <div className="flex gap-4 image-slider-left">
    {[1, 2].map((set) => (
      <div key={set} className="flex gap-4 flex-nowrap">
        {topSliderImages.map((img, index) => (
          <div key={`${set}-${index}`} className="flex-none w-72 h-96 relative">
            <img
              src={img}
              alt={`Portfolio ${index + 1}`}
              className="slider-image w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    ))}
  </div>

  <button
    onClick={() => handleSlideChange('right')}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all"
    aria-label="Next slide"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
</div>

{/* Explore Text */}
        <div className="text-center mt-12">
          <Link href="/portfolio">
            <span className="group inline-flex items-center gap-2 text-gray-400 text-sm tracking-widest hover:text-orange-200 transition-colors cursor-pointer">
              Explore The Portfolio
              <svg 
                className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>

{/* Scrolling Banners Section */}
      <div className="relative overflow-hidden bg-gray-900">
        <div className="w-full relative left-[50%] -translate-x-1/2 overflow-hidden bg-gray-900">
          <div className="banner-container">
            <div className="flex whitespace-nowrap animate-scroll-left">
              <div className="flex items-center text-white text-3xl md:text-4xl font-light py-4">
                {[1, 2, 3].map((i) => (
                  <span key={i} className="flex items-center">
                    {"Generative AI * Custom Coding * Research * DevOps".split('*').map((text, index) => (
                      <span key={index} className="flex items-center">
                        <span>{text}</span>
                        <span className="text-orange-200 mx-3 transform rotate-45">✱</span>
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </div>
          </div>

{/* Bottom banner - scrolling right */}
          <div className="relative mt-2">
            <div 
              className="relative transform -rotate-6 bg-orange-200 -mx-8"
              style={{
                boxShadow: '0 0 20px rgba(0,0,0,0.1)'
              }}
            >
              <div className="flex whitespace-nowrap animate-scroll-right">
                <div className="flex items-center text-gray-900 text-2xl md:text-3xl font-bold py-4">
                  {[1, 2, 3].map((i) => (
                    <span key={i} className="flex items-center">
                      {"PORTFOLIO * PROJECTS * PORTFOLIO * PROJECTS * ".split('*').map((text, index) => (
                        <span key={index} className="flex items-center">
                          <span>{text}</span>
                          <span className="mx-3 transform rotate-45">✱</span>
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

{/* Portfolio Stats Section */}
<div ref={portfolioRef} className="bg-gray-900 py-24">
  <div className="max-w-6xl mx-auto px-4">
    <div className={`text-center mb-20 scroll-animate ${portfolioInView ? 'fade-in' : ''}`}>
      <h2 className="text-sm uppercase tracking-widest mb-8 font-light text-gray-300">
        Best Quality Templates
      </h2>
      
      <div className="space-y-1">
        <h1 className={`text-7xl font-extralight tracking-wide text-white scroll-animate-left ${portfolioInView ? 'fade-in' : ''}`}
            style={{ fontFamily: "'Cormorant Garamond', serif", transitionDelay: '200ms' }}>
          Creative
        </h1>
        <h1 className={`text-7xl font-extralight tracking-wide text-white scroll-animate-right ${portfolioInView ? 'fade-in' : ''}`}
            style={{ fontFamily: "'Cormorant Garamond', serif", transitionDelay: '300ms' }}>
          personal
        </h1>
        <div className={`flex justify-center items-baseline space-x-4 scroll-animate ${portfolioInView ? 'fade-in' : ''}`}
             style={{ transitionDelay: '400ms' }}>
          <h1 className="text-5xl font-extralight text-orange-200/90 tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            portfolio
          </h1>
          <span className="text-5xl font-extralight text-orange-200/90 tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            &
          </span>
          <h1 className="text-5xl font-extralight text-orange-200/90 tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            resume
          </h1>
        </div>
        <h1 className={`text-5xl font-extralight text-gray-500/80 tracking-wide scroll-animate ${portfolioInView ? 'fade-in' : ''}`}
            style={{ fontFamily: "'Cormorant Garamond', serif", transitionDelay: '500ms' }}>
          templates
        </h1>
      </div>
    </div>

{/* Numbers grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-12">
      {[
        { label: "Portfolio homepages" },
        { label: "Elegant inner pages" },
        { label: "Custom components" },
        { label: "Design variations" },
        { label: "Premium elements" }
      ].map((item, index) => (
        <div 
          key={index}
          className={`text-center scroll-animate ${portfolioInView ? 'fade-in' : ''}`}
          style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            transitionDelay: `${(index + 6) * 150}ms`
          }}
        >
          <div className="text-7xl font-extralight mb-2 tracking-wide text-white">
            {numbers[index]}
            <span className="text-orange-200/90">+</span>
          </div>
          <div className="text-lg text-gray-400/90 font-light tracking-wide">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

{/* Newsletter Section */}
      <div ref={newsletterRef} className="bg-gray-900 p-16 text-center">
        <div className={`mb-8 scroll-animate ${newsletterInView ? 'fade-in' : ''}`}>
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
        
        <h2 className={`text-4xl md:text-5xl font-light text-white mb-8 leading-tight scroll-animate-left ${newsletterInView ? 'fade-in' : ''}`}
            style={{ transitionDelay: '200ms' }}>
          Get the latest <span className="text-orange-200">updates</span>
          <br />
          direct to inbox
        </h2>

        <form onSubmit={handleNewsletterSubmit} className={`max-w-xl mx-auto scroll-animate ${newsletterInView ? 'fade-in' : ''}`}
              style={{ transitionDelay: '400ms' }}>
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
                <a href="mailto:hi@johnny.ae" className="text-gray-400 hover:text-white transition-colors">
                  hi@johnny.ae
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

        @keyframes countUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default HomePage;
