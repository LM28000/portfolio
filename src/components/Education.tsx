import React from 'react';
import { GraduationCap, Calendar, Award, ExternalLink } from 'lucide-react';

const Education = () => {
  const educations = [
    {
      institution: "ESILV",
      degree: "Cycle ingénieur majeure Ingénierie Logicielle & IA",
      location: "Nantes (44)",
      period: "2023 - 2028",
      description: "Formation d'ingénieur spécialisée en développement logiciel et intelligence artificielle",
      color: "blue",
      link: "https://www.esilv.fr/"
    },
    {
      institution: "Académie musicale de Liesse",
      degree: "Bac (mention bien) - Mathématiques & N.S.I.",
      location: "Précigné (72)",
      period: "2020 - 2023",
      description: "Formation musicale approfondie parallèlement aux études scientifiques",
      color: "teal"
    }
  ];

  return (
    <section id="education" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Formation</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Un parcours académique alliant excellence scientifique et formation artistique
          </p>
        </div>

        <div className="space-y-8">
          {educations.map((edu, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div className="flex items-start gap-4 mb-6 lg:mb-0">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    edu.color === 'blue' ? 'bg-blue-100' : 'bg-teal-100'
                  }`}>
                    <GraduationCap className={`w-6 h-6 ${
                      edu.color === 'blue' ? 'text-blue-600' : 'text-teal-600'
                    }`} />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{edu.institution}</h3>
                      {edu.link && (
                        <a 
                          href={edu.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">{edu.degree}</p>
                    <p className="text-gray-600">{edu.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{edu.period}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📍</span>
                    <span>{edu.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-6 py-3 rounded-full">
            <Award className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-gray-700">Mention Bien au Baccalauréat</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;