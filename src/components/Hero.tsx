import { ChevronDown, MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Profile Image */}
          <div className="relative mx-auto w-48 h-48 rounded-full overflow-hidden shadow-xl ring-4 ring-white">
            <img 
              src="Capture_d_écran_du_2025-07-10_13-44-12-removebg-preview.png"
              alt="Louis-Marie Perret du Cray"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name and Title */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight">
              Louis-Marie
              <br />
              <span className="text-blue-600">Perret du Cray</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
              {t('hero.subtitle')} <span className="font-semibold text-blue-600">Devoteam</span>
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {t('hero.description')}
            </p>
          </div>

          {/* Quick Contact */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer">
              <MapPin size={16} />
              <span>{t('hero.location')}</span>
            </div>
            <a 
              href="tel:+33619862297"
              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            >
              <Phone size={16} />
              <span>{t('hero.phone')}</span>
            </a>
            <a 
              href="mailto:louis-marie@du-cray.com"
              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            >
              <Mail size={16} />
              <span>{t('hero.email')}</span>
            </a>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              onClick={scrollToAbout}
              className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t('hero.scrollDown')}
              <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;