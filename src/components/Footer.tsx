import React from 'react';
import { Heart, Code } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Louis-Marie Perret du Cray</h3>
            <p className="text-gray-400">Alternant Agentic & RSE chez Devoteam</p>
          </div>
          
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <span>Conçu avec</span>
              <Heart size={16} className="text-red-500" />
              <span>et</span>
              <Code size={16} className="text-blue-400" />
              <span>en 2025</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              © 2025 Louis-Marie Perret du Cray. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;