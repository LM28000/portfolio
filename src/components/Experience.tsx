import React from 'react';
import { Building, Calendar, ChevronRight } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      company: "Devoteam",
      position: "Alternant Agentic & RSE",
      location: "Levallois-Perret (92)",
      period: "2025 - 2028",
      description: "En alternance dans une entreprise de conseil en transformation digitale",
      missions: [
        "AI AgentSpace : aide à la mise en place du service et du support associé",
        "AI Agentic : création et support d'agents",
        "RSE : déploiement des processus de maîtrise des émissions CO₂e"
      ],
      color: "blue"
    },
    {
      company: "DeVinci Junior",
      position: "Développeur commercial",
      location: "Nantes (44)",
      period: "2024 - 2025",
      description: "Junior-Entreprise de l'école d'ingénieurs",
      missions: [
        "Prospection de nouveaux clients",
        "Rendez-vous clients et présentation de services",
        "Rédaction de devis et propositions commerciales",
        "Gestion de projets internes"
      ],
      color: "teal"
    }
  ];

  return (
    <section id="experience" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Expérience</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Mon parcours professionnel entre innovation technologique et développement commercial
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      exp.color === 'blue' ? 'bg-blue-100' : 'bg-teal-100'
                    }`}>
                      <Building className={`w-6 h-6 ${
                        exp.color === 'blue' ? 'text-blue-600' : 'text-teal-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{exp.company}</h3>
                      <p className="text-lg font-medium text-gray-600">{exp.position}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📍</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{exp.description}</p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Missions principales :</h4>
                  <ul className="space-y-2">
                    {exp.missions.map((mission, missionIndex) => (
                      <li key={missionIndex} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-600">{mission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;