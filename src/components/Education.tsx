import { GraduationCap, Calendar, Award, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Education = () => {
  const { t } = useLanguage();
  
  const educations = [
    {
      institution: t('education.esilv.institution'),
      degree: t('education.esilv.degree'),
      location: t('education.esilv.location.full'),
      period: t('education.esilv.period.full'),
      description: t('education.esilv.description.full'),
      color: "blue",
      link: "https://www.esilv.fr/"
    },
    {
      institution: t('education.academie.institution'),
      degree: t('education.academie.degree'),
      location: t('education.academie.location'),
      period: t('education.academie.period'),
      description: t('education.academie.description'),
      color: "teal",
      link: "https://www.academiemusicaledeliesse.fr/"
    }
  ];

  return (
    <section id="education" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('education.title')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('education.intro')}
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
                    <a 
                      href={edu.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-2 mb-2">
                        {edu.institution}
                        <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                    </a>
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
            <span className="font-medium text-gray-700">{t('education.baccalaureat.mention')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;