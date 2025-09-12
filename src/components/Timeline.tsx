import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import TimelineCard from './TimelineCard';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

const Timeline = () => {
  const { t } = useLanguage();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const titleAnimation = useScrollAnimation({ delay: 200 });
  const timelineAnimation = useStaggeredAnimation(5, 300);

  const timelineEvents = [
    {
      date: t('experience.devoteam.period.full'),
      title: t('experience.devoteam.title'),
      company: t('experience.devoteam.company'),
      location: t('experience.devoteam.location.full'),
      description: t('experience.devoteam.description.full'),
      missions: [
        t('experience.devoteam.mission1'),
        t('experience.devoteam.mission2'),
        t('experience.devoteam.mission3')
      ],
      type: "experience",
      color: "blue",
      link: "https://www.devoteam.com/"
    },
    {
      date: "2025 - 2028",
      title: t('timeline.esilv.engineer.title'),
      company: t('education.esilv.institution'),
      location: t('education.esilv.location.full'),
      description: t('timeline.esilv.engineer.description'),
      missions: [],
      type: "education",
      color: "purple",
      link: "https://www.esilv.fr/"
    },
    {
      date: t('experience.devinci.period'),
      title: t('experience.devinci.title'),
      company: t('experience.devinci.company'),
      location: t('experience.devinci.location'),
      description: t('experience.devinci.description'),
      missions: [
        t('experience.devinci.mission1'),
        t('experience.devinci.mission2'),
        t('experience.devinci.mission3'),
        t('experience.devinci.mission4')
      ],
      type: "experience",
      color: "teal",
      link: "https://www.devincijunior.fr/"
    },
    {
      date: "2023 - 2025",
      title: t('timeline.esilv.prepa.title'),
      company: t('education.esilv.institution'),
      location: t('education.esilv.location.full'),
      description: t('timeline.esilv.prepa.description'),
      missions: [],
      type: "education",
      color: "indigo",
      link: "https://www.esilv.fr/"
    },
    {
      date: t('education.academie.period'),
      title: t('education.academie.degree'),
      company: t('education.academie.institution'),
      location: t('education.academie.location'),
      description: t('education.academie.description'),
      missions: [],
      type: "education",
      color: "orange",
      link: "https://www.academiemusicaledeliesse.fr/"
    }
  ];

  const toggleExpanded = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  return (
    <section id="timeline" className="py-16 sm:py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleAnimation.ref}
          className={`text-center mb-12 sm:mb-16 scroll-fade-in ${titleAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('timeline.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-4">
            {t('timeline.subtitle')}
          </p>
        </div>

        <div 
          ref={timelineAnimation.ref}
          className="relative"
        >
          {/* Ligne centrale avec animation gradient - cachée sur mobile */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full timeline-gradient hidden sm:block"></div>
          
          {/* Ligne gauche pour mobile */}
          <div className="absolute left-6 top-0 w-0.5 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-orange-500 sm:hidden"></div>
          
          {timelineEvents.map((event, index) => (
            <div
              key={index}
              className={`relative flex items-center mb-8 sm:mb-12 ${
                index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
              } stagger-item ${timelineAnimation.isItemVisible(index) ? 'visible' : ''}`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <TimelineCard 
                event={event}
                index={index}
                isExpanded={expandedItem === index}
                onToggle={() => toggleExpanded(index)}
                t={t}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
