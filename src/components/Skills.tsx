import { Code, Database, Globe, Users, Brain, Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

const Skills = () => {
  const { t } = useLanguage();
  const titleAnimation = useScrollAnimation({ delay: 200 });
  const skillsAnimation = useStaggeredAnimation(6, 200);
  const languagesAnimation = useScrollAnimation({ delay: 600 });
  
  const skillCategories = [
    {
      title: t('skills.languages.title'),
      icon: Code,
      color: "blue",
      skills: ["C#", "Python", "SQL", "HTML", "CSS", "Bash"]
    },
    {
      title: t('skills.systems.title'),
      icon: Database,
      color: "teal",
      skills: t('skills.systems.items').split(', ')
    },
    {
      title: t('skills.software.title'),
      icon: Globe,
      color: "purple",
      skills: t('skills.software.items').split(', ')
    },
    {
      title: t('skills.soft.title'),
      icon: Users,
      color: "green",
      skills: t('skills.soft.items').split(', ')
    },
    {
      title: t('skills.specializations.title'),
      icon: Brain,
      color: "indigo",
      skills: t('skills.specializations.items').split(', ')
    },
    {
      title: t('skills.experiences.title'),
      icon: Lightbulb,
      color: "orange",
      skills: t('skills.experiences.items').split(', ')
    }
  ];

  const languages = [
    { name: t('skills.french'), level: t('skills.native'), percentage: 100 },
    { name: t('skills.english'), level: t('skills.level.b2'), percentage: 75 }
  ];

  return (
    <section id="skills" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleAnimation.ref}
          className={`text-center mb-16 scroll-fade-in ${titleAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('skills.title')}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('skills.intro')}
          </p>
        </div>

        {/* Technical Skills */}
        <div 
          ref={skillsAnimation.ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {skillCategories.map((category, index) => {
            const IconComponent = category.icon;
            const colorClasses = {
              blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
              teal: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
              purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
              green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
              indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
              orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
            };

            return (
              <div 
                key={index}
                className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 hover-glow hover-shadow-colored hover-shadow-blue-dark stagger-item ${skillsAnimation.isItemVisible(index) ? 'visible' : ''}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[category.color as keyof typeof colorClasses]}`}>
                    <IconComponent size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Languages */}
        <div 
          ref={languagesAnimation.ref}
          className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover-shadow-blue-dark scroll-scale-in ${languagesAnimation.isVisible ? 'visible' : ''}`}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">{t('skills.languages.label')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {languages.map((lang, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-white cursor-default">{lang.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">({lang.level})</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${lang.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;