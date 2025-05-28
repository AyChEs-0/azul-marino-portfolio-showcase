
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';

const Hero = () => {
  const programmingLogos = [
    { name: 'React', icon: '⚛️', position: 'top-20 left-20' },
    { name: 'TypeScript', icon: '📘', position: 'top-40 right-20' },
    { name: 'JavaScript', icon: '🟨', position: 'bottom-40 left-40' },
    { name: 'Node.js', icon: '🟢', position: 'top-60 left-60' },
    { name: 'Python', icon: '🐍', position: 'bottom-20 right-40' },
    { name: 'Vue.js', icon: '💚', position: 'top-32 right-60' },
    { name: 'HTML', icon: '🔴', position: 'bottom-60 left-20' },
    { name: 'CSS', icon: '🔵', position: 'top-80 right-80' },
    { name: 'Git', icon: '📂', position: 'bottom-32 right-20' },
    { name: 'Docker', icon: '🐳', position: 'top-48 left-80' }
  ];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Programming Logos */}
      <div className="absolute inset-0 opacity-20">
        {programmingLogos.map((logo, index) => (
          <div
            key={index}
            className={`absolute ${logo.position} text-6xl animate-float`}
            style={{ animationDelay: `${index * 0.5}s` }}
          >
            {logo.icon}
          </div>
        ))}
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Desarrollador</span>
            <br />
            <span className="text-white">Full Stack</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-3xl mx-auto">
            Transformando ideas en experiencias digitales excepcionales con tecnologías modernas
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
              Ver Proyectos
            </button>
            <button className="border border-blue-400 text-blue-400 px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 hover:text-white transition-all duration-300">
              Contactar
            </button>
          </div>

          <div className="flex justify-center space-x-6 mb-12">
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110">
              <Github size={24} />
            </a>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110">
              <Linkedin size={24} />
            </a>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110">
              <Mail size={24} />
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="text-slate-400" size={24} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
