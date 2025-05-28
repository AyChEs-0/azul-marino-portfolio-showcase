
const Skills = () => {
  const skills = [
    { name: "React", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", description: "Biblioteca para interfaces de usuario" },
    { name: "TypeScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", description: "JavaScript con tipado estático" },
    { name: "Vue.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg", description: "Framework progresivo para UI" },
    { name: "Tailwind CSS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg", description: "Framework CSS utility-first" },
    { name: "Node.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", description: "Runtime de JavaScript en servidor" },
    { name: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", description: "Lenguaje versátil y potente" },
    { name: "PostgreSQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", description: "Base de datos relacional avanzada" },
    { name: "MongoDB", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", description: "Base de datos NoSQL flexible" },
    { name: "Git", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", description: "Control de versiones distribuido" },
    { name: "Docker", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", description: "Contenedores para aplicaciones" },
    { name: "AWS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg", description: "Servicios de nube escalables" },
    { name: "Figma", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", description: "Herramienta de diseño colaborativo" }
  ];

  return (
    <section id="skills" className="py-20 bg-slate-800/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Habilidades</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Tecnologías y herramientas que domino para crear soluciones excepcionales
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div 
              key={index}
              className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 card-glow flex flex-col items-center text-center hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="mb-4">
                <img 
                  src={skill.src} 
                  alt={skill.name}
                  className="w-12 h-12 md:w-16 md:h-16"
                />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{skill.name}</h4>
              <p className="text-sm text-slate-400">{skill.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
