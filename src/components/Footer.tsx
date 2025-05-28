
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900/80 border-t border-slate-700 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">Portfolio</h3>
            <p className="text-slate-400 leading-relaxed">
              Desarrollador Full Stack apasionado por crear experiencias digitales excepcionales
              y soluciones innovadoras.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Enlaces Rápidos</h4>
            <div className="space-y-2">
              <a href="#home" className="block text-slate-400 hover:text-blue-400 transition-colors">Inicio</a>
              <a href="#about" className="block text-slate-400 hover:text-blue-400 transition-colors">Sobre Mí</a>
              <a href="#projects" className="block text-slate-400 hover:text-blue-400 transition-colors">Proyectos</a>
              <a href="#skills" className="block text-slate-400 hover:text-blue-400 transition-colors">Habilidades</a>
              <a href="#contact" className="block text-slate-400 hover:text-blue-400 transition-colors">Contacto</a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Sígueme</h4>
            <div className="flex space-x-4">
              <a href="#" className="bg-slate-800 p-3 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-all">
                <Github size={20} />
              </a>
              <a href="#" className="bg-slate-800 p-3 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-all">
                <Linkedin size={20} />
              </a>
              <a href="#" className="bg-slate-800 p-3 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-all">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-center md:text-left">
            © 2024 Portfolio. Todos los derechos reservados.
          </p>
          <p className="text-slate-400 flex items-center mt-4 md:mt-0">
            Hecho con <Heart className="w-4 h-4 text-red-500 mx-1" fill="currentColor" /> y mucho café
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
