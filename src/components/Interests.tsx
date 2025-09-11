import React from 'react';
import { Music, TrendingUp, Anchor, Users } from 'lucide-react';

const Interests = () => {
  const interests = [
    {
      title: "Musique",
      description: "Violon, alto, piano, guitare, orchestre, chant",
      detail: "Formation musicale approfondie à l'Académie de Liesse",
      icon: Music,
      color: "purple"
    },
    {
      title: "Finance & Cryptomonnaie",
      description: "Analyse des marchés financiers et technologies blockchain",
      detail: "Veille technologique et investissement responsable",
      icon: TrendingUp,
      color: "green"
    },
    {
      title: "Sports Nautiques",
      description: "Voile et aviron",
      detail: "Pratique régulière et participation à des compétitions",
      icon: Anchor,
      color: "blue"
    },
    {
      title: "Scoutisme",
      description: "Engagement associatif et développement personnel",
      detail: "Leadership, travail d'équipe et valeurs humaines",
      icon: Users,
      color: "orange"
    }
  ];

  return (
    <section id="interests" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Centres d'intérêt</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Mes passions qui enrichissent ma vision et complètent mon profil professionnel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {interests.map((interest, index) => {
            const IconComponent = interest.icon;
            const colorClasses = {
              purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-200",
              green: "bg-green-100 text-green-600 group-hover:bg-green-200",
              blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-200",
              orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-200"
            };

            return (
              <div 
                key={index}
                className="group bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                    colorClasses[interest.color as keyof typeof colorClasses]
                  }`}>
                    <IconComponent size={24} />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {interest.title}
                    </h3>
                    <p className="text-gray-700 font-medium mb-2">{interest.description}</p>
                    <p className="text-gray-600 text-sm">{interest.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Philosophy */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-8">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ma philosophie</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Je crois fermement que la diversité des expériences enrichit la perspective professionnelle. 
              Mes passions musicales développent ma créativité, le sport nautique renforce ma persévérance, 
              et mon engagement scout cultive mes valeurs humaines - autant de qualités précieuses dans le monde de l'ingénierie.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Interests;