import { ChevronDown, MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useScrollParallax, useHover3D } from '../hooks/useAdvancedAnimations';
import { useState, useEffect } from 'react';

const Hero = () => {
  const { t } = useLanguage();
  const { ref: parallaxRef, offset } = useScrollParallax(0.3);
  const { ref: profileRef, transform } = useHover3D();
  const [currentText, setCurrentText] = useState(0);
  
  const texts = [
    t('hero.subtitle'),
    t('hero.description')
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [texts.length]);
  
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 pt-20 overflow-hidden transition-colors duration-300">
      {/* Animated background elements with parallax */}
      <div 
        ref={parallaxRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ transform: `translateY(${offset * 0.5}px)` }}
      >
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200/30 dark:bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-200/30 dark:bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-indigo-200/30 dark:bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Particles en mouvement */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-40"></div>
        <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-50"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Profile Image avec effet 3D */}
          <div className="animate-bounce-in stagger-1">
            <div 
              ref={profileRef}
              className="relative mx-auto w-48 h-48 rounded-full overflow-hidden shadow-xl ring-4 ring-white dark:ring-gray-700 cursor-pointer group"
              style={{ 
                transform,
                transition: 'transform 0.3s ease-out'
              }}
            >
              <img 
                src="/profile.png"
                alt="Louis-Marie Perret du Cray"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Effet de particules au survol */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-2 left-2 w-1 h-1 bg-blue-400 rounded-full"></div>
                <div className="absolute top-4 right-6 w-0.5 h-0.5 bg-purple-400 rounded-full"></div>
                <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Name and Title avec animations */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white tracking-tight animate-slide-in-left stagger-2">
              Louis-Marie
              <br />
              <span className="text-blue-600 dark:text-blue-400 animate-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Perret du Cray
              </span>
            </h1>
            
            {/* Texte dynamique avec machine à écrire */}
            <div className="h-16 flex items-center justify-center">
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl animate-typing">
                {texts[currentText]}
              </p>
            </div>
          </div>

          {/* Quick Contact avec animations staggered */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-300 animate-slide-in-right stagger-3">
            <div className="flex items-center gap-2 transition-all duration-300 cursor-pointer hover-lift p-2 rounded-lg">
              <MapPin size={16} />
              <span>{t('hero.location')}</span>
            </div>
            <a 
              href="tel:+33619862297"
              className="flex items-center gap-2 transition-all duration-300 hover-lift p-2 rounded-lg"
            >
              <Phone size={16} className="animate-bounce-in" style={{ animationDelay: '0.2s' }} />
              <span>{t('hero.phone')}</span>
            </a>
            <a 
              href="mailto:louis-marie@du-cray.com"
              className="flex items-center gap-2 transition-all duration-300 hover-lift p-2 rounded-lg"
            >
              <Mail size={16} className="animate-bounce-in" style={{ animationDelay: '0.4s' }} />
              <span>{t('hero.email')}</span>
            </a>
          </div>

          {/* CTA Button avec effet morphing */}
          <div className="pt-8 animate-scale-in stagger-4">
            <button
              onClick={scrollToAbout}
              className="group relative inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium transition-all duration-500 hover-lift shadow-lg hover:shadow-xl overflow-hidden"
            >
              {/* Effet de vague au survol */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient"></div>
              
              <span className="relative z-10">{t('hero.scrollDown')}</span>
              <ChevronDown size={20} className="relative z-10 group-hover:translate-y-1 group-hover:animate-bounce transition-transform duration-300" />
              
              {/* Particules qui s'échappent au survol */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute -top-1 left-1/4 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute -top-1 right-1/4 w-0.5 h-0.5 bg-white rounded-full"></div>
                <div className="absolute -bottom-1 left-1/3 w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;