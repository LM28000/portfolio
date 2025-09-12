import { Calendar, MapPin, Building2, GraduationCap, Briefcase, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useHover3D } from '../hooks/useAdvancedAnimations';

interface TimelineCardProps {
  event: {
    date: string;
    title: string;
    company: string;
    location: string;
    description: string;
    missions: string[];
    type: string;
    color: string;
    link: string;
  };
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  t: (key: string) => string;
}

const TimelineCard = ({ event, index, isExpanded, onToggle, t }: TimelineCardProps) => {
  const { ref, transform } = useHover3D();
  const [isHovering, setIsHovering] = useState(false);

  const IconComponent = event.type === 'experience' ? Briefcase : GraduationCap;
  const colorClasses = {
    blue: "bg-blue-500 border-blue-200",
    purple: "bg-purple-500 border-purple-200", 
    teal: "bg-teal-500 border-teal-200",
    indigo: "bg-indigo-500 border-indigo-200",
    orange: "bg-orange-500 border-orange-200"
  };

  return (
    <>
      {/* Point central avec icône animée - du côté opposé à la carte */}
      <div className={`absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg z-10 transition-all duration-500 hover:scale-110 animate-bounce-in ${
        colorClasses[event.color as keyof typeof colorClasses]
      } ${
        // Sur mobile : toujours centré sur la ligne gauche
        // Sur desktop : alternance gauche/droite selon l'index
        'left-6 -translate-x-1/2 ' + 
        `sm:${index % 2 === 0 ? 'right-1/2 sm:translate-x-1/2' : 'left-1/2 sm:-translate-x-1/2'}`
      }`}
      style={{ animationDelay: `${index * 150}ms` }}>
        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-rotate-in" 
          style={{ animationDelay: `${index * 150 + 300}ms` }} />
      </div>
      
      {/* Contenu avec effet 3D */}
      <div className={`w-full pl-16 sm:pl-0 sm:w-5/12 ${index % 2 === 0 ? 'sm:pr-8' : 'sm:pl-8'}`}>
        <div 
          ref={ref}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 group cursor-pointer text-left overflow-hidden relative hover-glow hover-lift-gentle hover-shadow-colored hover-shadow-blue-dark"
          onClick={onToggle}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={{ 
            transform: isHovering ? transform : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out'
          }}
        >
          {/* Effet de brillance au survol - uniquement en mode clair */}
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 dark:group-hover:opacity-0 transition-all duration-700 transform ${
            isHovering ? 'translate-x-full' : '-translate-x-full'
          }`} style={{ width: '200%', left: '-100%' }} />
          
          {/* Badge de type avec animation */}
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-3 animate-scale-in ${
            event.type === 'experience' 
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
          }`}
          style={{ animationDelay: `${index * 100 + 400}ms` }}>
            {event.type === 'experience' ? t('timeline.experience') : t('timeline.education')}
          </div>
          
          <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 animate-fade-in"
            style={{ animationDelay: `${index * 100 + 500}ms` }}>
            <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
            <span>{event.date}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors animate-slide-up pr-2"
              style={{ animationDelay: `${index * 100 + 600}ms` }}>
              {event.title}
            </h3>
            <div className="flex items-center gap-2">
              {event.missions.length > 0 && (
                <div className={`transform transition-all duration-300 ${
                  isExpanded ? 'rotate-90 scale-110' : 'group-hover:scale-110'
                }`}>
                  <ChevronRight size={14} className="sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2 animate-slide-up"
            style={{ animationDelay: `${index * 100 + 700}ms` }}>
            <Building2 size={14} className="sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
            <a 
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 dark:text-blue-400 transition-all duration-300 text-sm sm:text-base"
              onClick={(e) => e.stopPropagation()}
            >
              {event.company}
            </a>
          </div>
          
          <div className="flex items-center gap-2 mb-3 text-gray-500 dark:text-gray-400 animate-slide-up"
            style={{ animationDelay: `${index * 100 + 800}ms` }}>
            <MapPin size={12} className="sm:w-3.5 sm:h-3.5" />
            <span className="text-xs sm:text-sm">{event.location}</span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed animate-fade-in-up"
            style={{ animationDelay: `${index * 100 + 900}ms` }}>
            {event.description}
          </p>

          {/* Section extensible pour les missions avec animation fluide */}
          {event.missions.length > 0 && (
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isExpanded ? 'max-h-96 mt-3 sm:mt-4 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3 sm:pt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 text-xs sm:text-sm animate-slide-in-left">
                  {event.type === 'experience' ? t('experience.mainMissions') : t('education.specialization')}
                </h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  {event.missions.map((mission, missionIndex) => (
                    <li key={missionIndex} 
                      className="flex items-start gap-2 text-xs sm:text-sm animate-slide-in-right"
                      style={{ animationDelay: `${missionIndex * 100}ms` }}>
                      <span className="text-blue-500 dark:text-blue-400 mt-0.5 sm:mt-1 text-xs">•</span>
                      <span className="text-gray-600 dark:text-gray-300 leading-relaxed">{mission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Indicateur cliquable avec animation */}
          {event.missions.length > 0 && (
            <div className="mt-3 text-center">
              <span className={`text-xs text-gray-400 dark:text-gray-500 transition-all duration-300`}>
                {isExpanded ? t('timeline.clickToCollapse') : t('timeline.clickToExpand')}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TimelineCard;
