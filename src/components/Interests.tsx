import { Music, TrendingUp, Anchor, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Interests = () => {
  const { t } = useLanguage();
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
    <section id="interests" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('interests.title')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('interests.intro')}
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('interests.philosophy.title')}</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t('interests.philosophy.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Interests;