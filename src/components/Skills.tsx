import { Code, Database, Globe, Users, Brain, Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Skills = () => {
  const { t } = useLanguage();
  
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
    <section id="skills" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('skills.title')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('skills.intro')}
          </p>
        </div>

        {/* Technical Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {skillCategories.map((category, index) => {
            const IconComponent = category.icon;
            const colorClasses = {
              blue: "bg-blue-100 text-blue-600",
              teal: "bg-teal-100 text-teal-600",
              purple: "bg-purple-100 text-purple-600",
              green: "bg-green-100 text-green-600",
              indigo: "bg-indigo-100 text-indigo-600",
              orange: "bg-orange-100 text-orange-600"
            };

            return (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[category.color as keyof typeof colorClasses]}`}>
                    <IconComponent size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className="px-3 py-1 bg-white text-gray-700 text-sm rounded-lg shadow-sm hover:shadow-md transition-shadow"
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
        <div className="bg-gray-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('skills.languages.label')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {languages.map((lang, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{lang.name}</span>
                  <span className="text-sm text-gray-600">({lang.level})</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
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