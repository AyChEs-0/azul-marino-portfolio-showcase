
import { Code, Palette, Zap } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Desarrollo Full Stack",
      description: "Experiencia completa en frontend y backend con las últimas tecnologías"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Diseño UI/UX",
      description: "Creación de interfaces intuitivas y experiencias de usuario excepcionales"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Performance",
      description: "Optimización y rendimiento para aplicaciones rápidas y eficientes"
    }
  ];

  return (
    <section id="about" className="py-20 bg-slate-800/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Sobre Mí</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Desarrollador apasionado por crear soluciones innovadoras y experiencias digitales que marquen la diferencia
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-slate-300 leading-relaxed">
              Con más de 5 años de experiencia en desarrollo web, me especializo en crear aplicaciones modernas, 
              escalables y centradas en el usuario. Mi enfoque combina técnicas de desarrollo avanzadas con 
              principios de diseño sólidos.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              Constantemente busco nuevos desafíos y oportunidades para aprender tecnologías emergentes, 
              manteniéndome al día con las mejores prácticas de la industria.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="bg-blue-900/50 text-blue-300 px-4 py-2 rounded-lg border border-blue-700">React</span>
              <span className="bg-blue-900/50 text-blue-300 px-4 py-2 rounded-lg border border-blue-700">TypeScript</span>
              <span className="bg-blue-900/50 text-blue-300 px-4 py-2 rounded-lg border border-blue-700">Node.js</span>
              <span className="bg-blue-900/50 text-blue-300 px-4 py-2 rounded-lg border border-blue-700">Python</span>
            </div>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 card-glow transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-blue-400 mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
