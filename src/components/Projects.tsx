import { Folder, ExternalLink, Github, Wrench, Server } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

const Projects = () => {
  const { t } = useLanguage();
  const titleAnimation = useScrollAnimation({ delay: 200 });
  const projectsAnimation = useStaggeredAnimation(3, 300);
  const ctaAnimation = useScrollAnimation({ delay: 800 });
  const projects = [
    {
      title: t('projects.pix.title'),
      category: t('projects.pix.category'),
      description: t('projects.pix.description'),
      details: [
        t('projects.pix.detail1'),
        t('projects.pix.detail2')
      ],
      technologies: ["Solidworks", t('projects.technologies.mechanics'), t('projects.technologies.electronics'), t('projects.technologies.programming')],
      icon: Wrench,
      color: "blue"
    },
    {
      title: t('projects.multimedia.title'),
      category: t('projects.multimedia.category'),
      description: t('projects.multimedia.description'),
      details: [
        t('projects.multimedia.detail1'),
        t('projects.multimedia.detail2')
      ],
      technologies: ["Debian", "Linux", t('projects.technologies.system'), t('projects.technologies.networks')],
      icon: Server,
      color: "teal"
    }
  ];

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleAnimation.ref}
          className={`text-center mb-16 scroll-fade-in ${titleAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('projects.title')}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('projects.intro')}
          </p>
        </div>

        <div 
          ref={projectsAnimation.ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {projects.map((project, index) => {
            const IconComponent = project.icon;
            const colorClasses = {
              blue: "from-blue-500 to-blue-600 shadow-blue-500/25",
              teal: "from-teal-500 to-teal-600 shadow-teal-500/25"
            };

            return (
              <div 
                key={index}
                className={`bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-200 dark:border-gray-700 hover-lift-gentle hover-glow hover-shadow-blue-dark stagger-item ${projectsAnimation.isItemVisible(index) ? 'visible' : ''}`}
              >
                {/* Header */}
                <div className={`p-6 bg-gradient-to-r ${colorClasses[project.color as keyof typeof colorClasses]} text-white`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <IconComponent size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                        <p className="text-white/90 text-sm">{project.category}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{project.description}</p>

                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('projects.achievements')}</h4>
                    <ul className="space-y-2">
                      {project.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full flex-shrink-0 mt-2"></div>
                          <span className="text-gray-600 dark:text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('projects.technologies')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div 
            ref={ctaAnimation.ref}
            className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-2xl mx-auto border border-gray-200 dark:border-gray-700 hover-glow hover-lift-gentle hover-shadow-colored hover-shadow-blue-dark scroll-scale-in ${ctaAnimation.isVisible ? 'visible' : ''}`}
          >
            <Folder className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4 hover-rotate cursor-pointer" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 cursor-default">{t('projects.moreProjects')}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('projects.moreProjectsDesc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;