import { User, Target, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();
  
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('about.title')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('about.intro')}
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('about.profile.title')}</h3>
                <p className="text-gray-600">
                  {t('about.profile.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('about.mission.title')}</h3>
                <p className="text-gray-600">
                  {t('about.mission.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('about.passions.title')}</h3>
                <p className="text-gray-600">
                  {t('about.passions.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">2025</div>
              <div className="text-sm text-gray-600">{t('about.stats.apprenticeship')}</div>
              <div className="text-sm text-gray-600">Devoteam</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-teal-600 mb-2">2028</div>
              <div className="text-sm text-gray-600">{t('about.stats.graduation')}</div>
              <div className="text-sm text-gray-600">ESILV</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-orange-600 mb-2">B2+</div>
              <div className="text-sm text-gray-600">{t('about.stats.english')}</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">B</div>
              <div className="text-sm text-gray-600">{t('about.stats.license')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;