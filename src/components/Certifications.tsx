import { Award, Calendar, ExternalLink, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdvancedAnimation } from '../hooks/useAdvancedAnimations';

interface Certification {
  title: string;
  issuer: string;
  date: string;
  level?: string;
  description: string;
  credential?: string;
  icon: string;
  color: string;
}

const Certifications = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useAdvancedAnimation({ threshold: 0.3, triggerOnce: true });

  const certifications: Certification[] = [
    {
      title: t('certifications.genai.title'),
      issuer: 'Devoteam',
      date: t('certifications.genai.date'),
      level: 'Level 1',
      description: t('certifications.genai.description'),
      icon: '🧠',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      title: t('certifications.toefl.title'),
      issuer: 'ETS (Educational Testing Service)',
      date: t('certifications.toefl.date'),
      level: 'B2+',
      description: t('certifications.toefl.description'),
      icon: '🌍',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: t('certifications.design.title'),
      issuer: t('certifications.design.issuer'),
      date: t('certifications.design.date'),
      description: t('certifications.design.description'),
      icon: '💡',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: t('certifications.mantu.title'),
      issuer: 'Mantu Group',
      date: t('certifications.mantu.date'),
      description: t('certifications.mantu.description'),
      icon: '👔',
      color: 'from-green-500 to-green-600'
    },
    {
      title: t('certifications.voltaire.title'),
      issuer: 'Projet Voltaire',
      date: t('certifications.voltaire.date'),
      description: t('certifications.voltaire.description'),
      icon: '📝',
      color: 'from-orange-500 to-orange-600'
    }
    
  ];

  return (
    <section id="certifications" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div ref={ref} className="text-center mb-16">
          <h2 className={`text-3xl font-bold text-gray-900 dark:text-white mb-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <Award className="inline-block w-8 h-8 mr-3 text-yellow-500" />
            {t('certifications.title')}
          </h2>
          <p className={`text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${isVisible ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>
            {t('certifications.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {certifications.map((cert, index) => (
            <div
              key={cert.title}
              className={`group bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700 hover-glow hover-shadow-colored hover-shadow-blue-dark ${
                isVisible ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${cert.color} flex items-center justify-center text-white text-xl font-bold shadow-lg hover-scale cursor-pointer`}>
                    {cert.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors cursor-default">
                      {cert.title}
                    </h3>
                    {cert.level && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${cert.color} text-white`}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {cert.level}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{cert.date}</span>
                </div>
                
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {cert.issuer}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {cert.description}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>{t('certifications.verified')}</span>
                  </div>
                  {cert.credential && (
                    <button className="flex items-center text-xs text-blue-600 dark:text-blue-400 transition-colors">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      <span>{t('certifications.viewCredential')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className={`mt-16 grid grid-cols-3 gap-6 max-w-3xl mx-auto ${isVisible ? 'animate-fade-in-up stagger-3' : 'opacity-0'}`}>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">5</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('certifications.stats.total')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">2025</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('certifications.stats.recent')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">100%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('certifications.stats.verified')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
