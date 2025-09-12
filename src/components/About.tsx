import { User, Target, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

const About = () => {
  const { t } = useLanguage();
  const titleAnimation = useScrollAnimation({ delay: 200 });
  const contentAnimation = useScrollAnimation({ delay: 400 });
  const statsAnimation = useStaggeredAnimation(4, 150);
  
  return (
    <section id="about" className="py-16 sm:py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleAnimation.ref}
          className={`text-center mb-12 sm:mb-16 scroll-fade-in ${titleAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('about.title')}</h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            {t('about.intro')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Content */}
          <div 
            ref={contentAnimation.ref}
            className={`space-y-6 sm:space-y-8 scroll-slide-left ${contentAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('about.profile.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('about.profile.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('about.mission.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('about.mission.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('about.passions.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('about.passions.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div 
            ref={statsAnimation.ref}
            className="grid grid-cols-2 gap-4 sm:gap-6"
          >
            <div className={`text-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover-lift-gentle hover-shadow-blue-dark stagger-item ${statsAnimation.isItemVisible(0) ? 'visible' : ''}`}>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">2025</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-tight">{t('about.stats.apprenticeship')}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Devoteam</div>
            </div>
            <div className={`text-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover-lift-gentle hover-shadow-blue-dark stagger-item ${statsAnimation.isItemVisible(1) ? 'visible' : ''}`}>
              <div className="text-2xl sm:text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">2028</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-tight">{t('about.stats.graduation')}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">ESILV</div>
            </div>
            <div className={`text-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover-lift-gentle hover-shadow-blue-dark stagger-item ${statsAnimation.isItemVisible(2) ? 'visible' : ''}`}>
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">B2+</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-tight">{t('about.stats.english')}</div>
            </div>
            <div className={`text-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover-lift-gentle hover-shadow-blue-dark stagger-item ${statsAnimation.isItemVisible(3) ? 'visible' : ''}`}>
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">B</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-tight">{t('about.stats.license')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;