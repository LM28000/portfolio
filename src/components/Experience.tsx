import React from 'react';
import { Building, Calendar, ChevronRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Experience = () => {
  const { t } = useLanguage();
  
  const experiences = [
    {
      company: t('experience.devoteam.company'),
      position: t('experience.devoteam.title'),
      location: t('experience.devoteam.location.full'),
      period: t('experience.devoteam.period.full'),
      description: t('experience.devoteam.description.full'),
      missions: [
        t('experience.devoteam.mission1'),
        t('experience.devoteam.mission2'),
        t('experience.devoteam.mission3')
      ],
      color: "blue",
      link: "https://www.devoteam.com/"
    },
    {
      company: t('experience.devinci.company'),
      position: t('experience.devinci.title'),
      location: t('experience.devinci.location'),
      period: t('experience.devinci.period'),
      description: t('experience.devinci.description'),
      missions: [
        t('experience.devinci.mission1'),
        t('experience.devinci.mission2'),
        t('experience.devinci.mission3'),
        t('experience.devinci.mission4')
      ],
      color: "teal",
      link: "https://www.devincijunior.fr/"
    }
  ];

  return (
    <section id="experience" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('experience.title')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('experience.intro')}
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
                      <a 
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                          {exp.company}
                          <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                      </a>
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
                  <h4 className="font-semibold text-gray-900">{t('experience.mainMissions')}</h4>
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