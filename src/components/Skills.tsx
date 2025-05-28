
const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend",
      skills: [
        { name: "React", icon: "⚛️", description: "Biblioteca para interfaces de usuario" },
        { name: "TypeScript", icon: "📘", description: "JavaScript con tipado estático" },
        { name: "Vue.js", icon: "💚", description: "Framework progresivo para UI" },
        { name: "Tailwind CSS", icon: "🎨", description: "Framework CSS utility-first" }
      ]
    },
    {
      title: "Backend",
      skills: [
        { name: "Node.js", icon: "🟢", description: "Runtime de JavaScript en servidor" },
        { name: "Python", icon: "🐍", description: "Lenguaje versátil y potente" },
        { name: "PostgreSQL", icon: "🐘", description: "Base de datos relacional avanzada" },
        { name: "MongoDB", icon: "🍃", description: "Base de datos NoSQL flexible" }
      ]
    },
    {
      title: "Tools & Others",
      skills: [
        { name: "Git", icon: "📂", description: "Control de versiones distribuido" },
        { name: "Docker", icon: "🐳", description: "Contenedores para aplicaciones" },
        { name: "AWS", icon: "☁️", description: "Servicios de nube escalables" },
        { name: "Figma", icon: "🎯", description: "Herramienta de diseño colaborativo" }
      ]
    }
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

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div 
              key={index}
              className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 card-glow"
            >
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">{category.title}</h3>
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div 
                    key={skillIndex}
                    className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <div className="text-3xl">
                      {skill.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white">{skill.name}</h4>
                      <p className="text-sm text-slate-400">{skill.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
