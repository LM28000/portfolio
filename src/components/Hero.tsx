import React from 'react';
import { ChevronDown, MapPin, Phone, Mail, Linkedin } from 'lucide-react';

const Hero = () => {
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
              src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400"
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
              Alternant Agentic & RSE chez <span className="font-semibold text-blue-600">Devoteam</span>
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Étudiant Ingénieur en Logiciel & IA à l'ESILV, passionné par l'innovation technologique et le développement durable
            </p>
          </div>

          {/* Quick Contact */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <MapPin size={16} />
              <span>Levallois-Perret, 92</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Phone size={16} />
              <span>+33 6 19 86 22 97</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Mail size={16} />
              <span>louis-marie@du-cray.com</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              onClick={scrollToAbout}
              className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Découvrir mon parcours
              <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;