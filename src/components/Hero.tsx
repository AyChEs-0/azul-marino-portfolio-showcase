
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

const Hero = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Desarrollador Full Stack';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const programmingLogos = [
    { name: 'React', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', position: 'top-20 left-20', delay: '0s' },
    { name: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', position: 'top-40 right-20', delay: '0.5s' },
    { name: 'JavaScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', position: 'bottom-40 left-40', delay: '1s' },
    { name: 'Node.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', position: 'top-60 left-60', delay: '1.5s' },
    { name: 'Python', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', position: 'bottom-20 right-40', delay: '2s' },
    { name: 'Vue.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', position: 'top-32 right-60', delay: '2.5s' },
    { name: 'HTML', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', position: 'bottom-60 left-20', delay: '3s' },
    { name: 'CSS', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', position: 'top-80 right-80', delay: '3.5s' },
    { name: 'Git', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', position: 'bottom-32 right-20', delay: '4s' },
    { name: 'Docker', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', position: 'top-48 left-80', delay: '4.5s' }
  ];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Programming Logos with Enhanced Animation */}
      <div className="absolute inset-0 opacity-20">
        {programmingLogos.map((logo, index) => (
          <div
            key={index}
            className={`absolute ${logo.position}`}
            style={{ 
              animation: `float-gentle 6s ease-in-out infinite`,
              animationDelay: logo.delay
            }}
          >
            <img 
              src={logo.src} 
              alt={logo.name}
              className="w-16 h-16 md:w-20 md:h-20 tech-logo"
            />
          </div>
        ))}
      </div>

      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="animate-fade-in">
          <div className="mb-8">
            <div className="inline-block p-4 rounded-full glass-effect mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">DEV</span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text block mb-2">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
            <span className="text-white bg-clip-text">Excepcional</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transformando ideas en <span className="text-blue-400 font-semibold">experiencias digitales</span> excepcionales con tecnologías modernas y diseño innovador
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="group bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white px-10 py-4 rounded-xl font-semibold button-glow hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 min-w-[200px]">
              <span className="relative z-10">Ver Proyectos</span>
            </button>
            <button className="group border-2 border-blue-400/50 text-blue-400 px-10 py-4 rounded-xl font-semibold glass-effect hover:bg-blue-400 hover:text-white transition-all duration-300 hover:border-blue-400 min-w-[200px]">
              Contactar
            </button>
          </div>

          <div className="flex justify-center space-x-8 mb-16">
            {[
              { Icon: Github, href: "#", label: "GitHub" },
              { Icon: Linkedin, href: "#", label: "LinkedIn" },
              { Icon: Mail, href: "#", label: "Email" }
            ].map(({ Icon, href, label }, index) => (
              <a 
                key={label}
                href={href} 
                className="group p-4 rounded-xl glass-effect text-slate-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon size={28} className="group-hover:animate-pulse" />
              </a>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce p-2 rounded-full glass-effect">
            <ArrowDown className="text-slate-400" size={24} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
