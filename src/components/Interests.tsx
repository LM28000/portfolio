import { Music, TrendingUp, Anchor, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

const Interests = () => {
  const { t } = useLanguage();
  const titleAnimation = useScrollAnimation({ delay: 200 });
  const interestsAnimation = useStaggeredAnimation(4, 200);
  const interests = [
    {
      title: t('interests.music.title'),
      description: t('interests.music.description'),
      detail: t('interests.music.detail'),
      icon: Music,
      color: "purple"
    },
    {
      title: t('interests.finance.title'),
      description: t('interests.finance.description'),
      detail: t('interests.finance.detail'),
      icon: TrendingUp,
      color: "green"
    },
    {
      title: t('interests.sports.title'),
      description: t('interests.sports.description'),
      detail: t('interests.sports.detail'),
      icon: Anchor,
      color: "blue"
    },
    {
      title: t('interests.scouting.title'),
      description: t('interests.scouting.description'),
      detail: t('interests.scouting.detail'),
      icon: Users,
      color: "orange"
    }
  ];

  return (
    <section id="interests" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleAnimation.ref}
          className={`text-center mb-16 scroll-fade-in ${titleAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('interests.title')}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('interests.intro')}
          </p>
        </div>

        <div 
          ref={interestsAnimation.ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {interests.map((interest, index) => {
            const IconComponent = interest.icon;
            const colorClasses = {
              purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
              green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
              blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
              orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
            };

            return (
              <div 
                key={index}
                className={`group bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 hover-glow hover-shadow-colored hover-shadow-blue-dark stagger-item ${interestsAnimation.isItemVisible(index) ? 'visible' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                    colorClasses[interest.color as keyof typeof colorClasses]
                  }`}>
                    <IconComponent size={24} />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                      {interest.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-200 font-medium mb-2">{interest.description}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{interest.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Philosophy */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('interests.philosophy.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              {t('interests.philosophy.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Interests;