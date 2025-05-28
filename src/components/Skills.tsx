
const Skills = () => {
  const skills = [
    { name: "React", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", description: "Biblioteca para interfaces de usuario modernas" },
    { name: "TypeScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", description: "JavaScript con tipado estático robusto" },
    { name: "Vue.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg", description: "Framework progresivo para UI reactivas" },
    { name: "Tailwind CSS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg", description: "Framework CSS utility-first moderno" },
    { name: "Node.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", description: "Runtime de JavaScript en servidor" },
    { name: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", description: "Lenguaje versátil para desarrollo backend" },
    { name: "PostgreSQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", description: "Base de datos relacional avanzada" },
    { name: "MongoDB", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", description: "Base de datos NoSQL escalable" },
    { name: "Git", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", description: "Control de versiones distribuido" },
    { name: "Docker", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", description: "Contenedores para despliegue" },
    { name: "AWS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg", description: "Servicios de nube escalables" },
    { name: "Figma", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", description: "Herramienta de diseño colaborativo" }
  ];

  return (
    <section id="skills" className="py-24 bg-slate-800/30 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block p-3 rounded-xl glass-effect mb-6">
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Expertise</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="gradient-text">Habilidades</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Tecnologías y herramientas que domino para crear <span className="text-blue-400">soluciones excepcionales</span> y experiencias digitales innovadoras
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {skills.map((skill, index) => (
            <div 
              key={index}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="glass-effect p-8 rounded-2xl card-glow flex flex-col items-center text-center h-full relative overflow-hidden">
                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 mb-6 group-hover:animate-pulse">
                  <div className="p-4 rounded-xl bg-slate-800/50 group-hover:bg-slate-700/50 transition-colors duration-300">
                    <img 
                      src={skill.src} 
                      alt={skill.name}
                      className="w-16 h-16 md:w-20 md:h-20 tech-logo"
                    />
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  {skill.name}
                </h4>
                
                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300 leading-relaxed">
                  {skill.description}
                </p>

                {/* Skill Level Indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-4 glass-effect px-8 py-4 rounded-full">
            <div className="flex -space-x-2">
              {skills.slice(0, 5).map((skill, index) => (
                <div key={index} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-600 p-1">
                  <img src={skill.src} alt={skill.name} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
            <span className="text-slate-400">y muchas más tecnologías</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
