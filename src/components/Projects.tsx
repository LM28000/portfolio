import { Folder, ExternalLink, Github, Wrench, Server, ClipboardList, Maximize2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface Project {
  title: string;
  category: string;
  description: string;
  details: string[];
  technologies: string[];
  icon: any;
  color: string;
  architectureImage?: string; // Chemin vers l'image d'architecture
}

const Projects = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const titleAnimation = useScrollAnimation({ delay: 200 });
  const projectsAnimation = useStaggeredAnimation(3, 300);
  const ctaAnimation = useScrollAnimation({ delay: 800 });
  const projects: Project[] = [
    {
      title: t('projects.pix.title'),
      category: t('projects.pix.category'),
      description: t('projects.pix.description'),
      details: [
        t('projects.pix.detail1'),
        t('projects.pix.detail2'),
        t('projects.pix.detail3')
      ],
      technologies: [t('projects.technologies.teamwork'), t('projects.technologies.modeling3d'), t('projects.technologies.projectManagement'), t('projects.technologies.communication'), t('projects.technologies.mechanics')],
      icon: Wrench,
      color: "blue"
    },
    {
      title: t('projects.pix2.title'),
      category: t('projects.pix2.category'),
      description: t('projects.pix2.description'),
      details: [
        t('projects.pix2.detail1'),
        t('projects.pix2.detail2'),
        t('projects.pix2.detail3')
      ],
      technologies: [t('projects.technologies.projectManagement'), t('projects.technologies.moa'), t('projects.technologies.specifications'), t('projects.technologies.ideation'), t('projects.technologies.riskAnalysis')],
      icon: ClipboardList,
      color: "green"
    },
    {
      title: t('projects.multimedia.title'),
      category: t('projects.multimedia.category'),
      description: t('projects.multimedia.description'),
      details: [
        t('projects.multimedia.detail1'),
        t('projects.multimedia.detail2'),
        t('projects.multimedia.detail3'),
        t('projects.multimedia.detail4')
      ],
      technologies: [t('projects.technologies.unixAdmin'), t('projects.technologies.docker'), t('projects.technologies.devops'), t('projects.technologies.virtualization'), t('projects.technologies.containerization'), t('projects.technologies.monitoring')],
      icon: Server,
      color: "teal",
      architectureImage: "/images/server-architecture.png" // Vous mettrez votre image ici
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
        >
          {projects.map((project, index) => {
            const IconComponent = project.icon;
            const colorClasses = {
              blue: "from-blue-500 to-blue-600 shadow-blue-500/25",
              green: "from-green-500 to-green-600 shadow-green-500/25",
              teal: "from-teal-500 to-teal-600 shadow-teal-500/25"
            };

            return (
              <div 
                key={index}
                className={`bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-200 dark:border-gray-700 hover-lift-gentle hover-glow hover-shadow-blue-dark stagger-item ${projectsAnimation.isItemVisible(index) ? 'visible' : ''}`}
              >
                {/* Header */}
                <div className={`p-4 sm:p-6 bg-gradient-to-r ${colorClasses[project.color as keyof typeof colorClasses]} text-white`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <IconComponent size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-1">{project.title}</h3>
                        <p className="text-white/90 text-xs sm:text-sm">{project.category}</p>
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

                  {/* Architecture du projet (si disponible) */}
                  {project.architectureImage && (
                    <div className="space-y-3 mt-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{t('projects.architecture')}</h4>
                      <div className="relative group cursor-pointer" onClick={() => setSelectedImage(project.architectureImage!)}>
                        <img 
                          src={project.architectureImage} 
                          alt={t('projects.architecture')}
                          className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Maximize2 size={16} className="text-gray-600 dark:text-gray-300" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        {t('projects.architecture.click')}
                      </p>
                    </div>
                  )}
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

      {/* Modal pour l'image d'architecture */}
      {selectedImage && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="relative max-w-6xl max-h-[95vh] overflow-auto">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={selectedImage} 
              alt={t('projects.architecture.modal')}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default Projects;