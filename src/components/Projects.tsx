
import { ExternalLink, Github } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Plataforma completa de comercio electrónico con React, Node.js y PostgreSQL",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      github: "#",
      demo: "#"
    },
    {
      title: "Task Management App",
      description: "Aplicación de gestión de tareas con colaboración en tiempo real",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
      technologies: ["Vue.js", "Express", "Socket.io", "MongoDB"],
      github: "#",
      demo: "#"
    },
    {
      title: "Analytics Dashboard",
      description: "Dashboard interactivo para visualización de datos y métricas en tiempo real",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      technologies: ["React", "D3.js", "Python", "FastAPI"],
      github: "#",
      demo: "#"
    },
    {
      title: "Mobile Banking App",
      description: "Aplicación móvil para servicios bancarios con máxima seguridad",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      technologies: ["React Native", "Node.js", "JWT", "Encryption"],
      github: "#",
      demo: "#"
    }
  ];

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Proyectos</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Una selección de mis trabajos más recientes y proyectos destacados
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700 card-glow group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <div className="flex space-x-4">
                    <a 
                      href={project.github}
                      className="bg-slate-800/90 p-2 rounded-lg text-white hover:bg-slate-700 transition-colors"
                    >
                      <Github size={20} />
                    </a>
                    <a 
                      href={project.demo}
                      className="bg-blue-600/90 p-2 rounded-lg text-white hover:bg-blue-500 transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{project.title}</h3>
                <p className="text-slate-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-lg text-sm border border-blue-700/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
