import React from 'react';
import { Folder, ExternalLink, Github, Wrench, Server } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      title: "Projets d'Imagination et d'eXploration (PIX)",
      category: "Robotique & Innovation",
      description: "Projets académiques axés sur l'innovation et la créativité technique",
      details: [
        "Conception d'un robot hexapode",
        "Construction d'une maquette d'immeuble résistant aux séismes"
      ],
      technologies: ["Solidworks", "Mécanique", "Électronique", "Programmation"],
      icon: Wrench,
      color: "blue"
    },
    {
      title: "Serveur Multimédia Personnel",
      category: "Infrastructure & Développement",
      description: "Projet technique de développement et administration système",
      details: [
        "Développement et administration d'un serveur personnel multimédia sous Debian",
        "Configuration des services, sécurisation et optimisation des performances"
      ],
      technologies: ["Debian", "Linux", "Administration système", "Réseaux"],
      icon: Server,
      color: "teal"
    }
  ];

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Projets</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez mes réalisations techniques et mes projets d'innovation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const IconComponent = project.icon;
            const colorClasses = {
              blue: "from-blue-500 to-blue-600 shadow-blue-500/25",
              teal: "from-teal-500 to-teal-600 shadow-teal-500/25"
            };

            return (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
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
                  <p className="text-gray-600 mb-6">{project.description}</p>

                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-gray-900">Réalisations :</h4>
                    <ul className="space-y-2">
                      {project.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                          <span className="text-gray-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Technologies utilisées :</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
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
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
            <Folder className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Plus de projets à venir</h3>
            <p className="text-gray-600">
              En cours de formation, je développe constamment de nouveaux projets. 
              N'hésitez pas à me contacter pour en savoir plus sur mes réalisations récentes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;