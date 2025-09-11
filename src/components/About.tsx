import React from 'react';
import { User, Target, Heart } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">À propos de moi</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Passionné par la technologie et l'innovation, je combine expertise technique et conscience environnementale
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Profil</h3>
                <p className="text-gray-600">
                  Étudiant ingénieur en 3ème année à l'ESILV, spécialisé en Ingénierie Logicielle & IA. 
                  En alternance chez Devoteam depuis 2025, je travaille sur des projets d'intelligence artificielle 
                  et de responsabilité sociétale des entreprises.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Mission</h3>
                <p className="text-gray-600">
                  Contribuer au développement de solutions technologiques innovantes tout en intégrant 
                  les enjeux du développement durable et de la RSE dans chaque projet.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Passions</h3>
                <p className="text-gray-600">
                  Musicien accompli (violon, alto, piano, guitare), pratiquant de sports nautiques, 
                  et engagé dans le scoutisme. Passionné par la finance et les cryptomonnaies.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">2025</div>
              <div className="text-sm text-gray-600">Début alternance</div>
              <div className="text-sm text-gray-600">Devoteam</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-teal-600 mb-2">2028</div>
              <div className="text-sm text-gray-600">Diplôme ingénieur</div>
              <div className="text-sm text-gray-600">ESILV</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-orange-600 mb-2">B2+</div>
              <div className="text-sm text-gray-600">Niveau anglais</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">B</div>
              <div className="text-sm text-gray-600">Permis de conduire</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;