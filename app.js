const { useState, useEffect } = React;
const resumeLink = "https://drive.google.com/file/d/1HA_8YDyBDsYIp0-VUGWsYc_HgfxxZWOF/view";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`flex justify-between items-center p-4 fixed w-full z-10 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-3' : 'bg-white/90 backdrop-blur-sm py-4'}`} data-aos="fade-down">
      <h1 className="text-2xl font-bold mx-4 md:mx-10 gradient-text">Surya K</h1>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-2 mx-4 md:mx-10">
        {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
          <a 
            href={`#${item.toLowerCase()}`} 
            key={item}
            className="nav-link text-lg font-medium hover:text-blue-500 transition-colors duration-300"
          >
            {item}
          </a>
        ))}
      </div>
      
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden mx-4 text-2xl text-blue-600"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </button>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg py-4 px-6 animate-fadeIn">
          {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
            <a 
              href={`#${item.toLowerCase()}`} 
              key={item}
              className="block py-3 px-4 hover:bg-blue-50 rounded-lg hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20" data-aos="zoom-in">
      <h2 className="text-4xl md:text-6xl font-bold mb-4">
        Hi, I'm <span className="gradient-text">Surya</span> <span className="wave animate-waving-hand">👋</span>
      </h2>
      <p className="text-lg md:text-xl mb-8 max-w-2xl px-4 text-gray-600">
        I'm a passionate <span className="font-semibold text-blue-600">Frontend Developer</span> specializing in creating beautiful, interactive web experiences with React.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a 
          href={resumeLink} 
          target="_blank" 
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          data-aos="fade-up" data-aos-delay="100"
        >
          <i className="fas fa-file-alt"></i> View Resume
        </a>
        <a 
          href="#contact" 
          className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          data-aos="fade-up" data-aos-delay="200"
        >
          <i className="fas fa-paper-plane"></i> Contact Me
        </a>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-16 md:py-20 px-4 bg-gray-100" data-aos="fade-up">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center md:text-left gradient-text">About Me</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="order-2 md:order-1">
            <p className="text-base md:text-lg mb-4 text-gray-700">
              I'm a <span className="font-semibold text-blue-600">Frontend Developer</span> with strong skills in modern JavaScript frameworks, particularly React. My journey in web development began with a fascination for creating interactive user interfaces, and I've since dedicated myself to mastering the art of frontend development.
            </p>
            <p className="text-base md:text-lg mb-4 text-gray-700">
              I specialize in building responsive, accessible, and performant web applications using <span className="font-semibold">React, JavaScript (ES6+), Tailwind CSS, and Redux</span>. I have a keen eye for design and user experience, ensuring that the applications I build are not only functional but also visually appealing.
            </p>
            <p className="text-base md:text-lg mb-4 text-gray-700">
              While my primary focus is frontend development, I'm familiar with backend basics including <span className="font-semibold">Node.js, Express, and MongoDB</span>, which helps me collaborate effectively with backend developers. I'm constantly learning new technologies and best practices to stay at the forefront of frontend development.
            </p>
            <p className="text-base md:text-lg text-gray-700">
              When I'm not coding, you can find me exploring new design trends, contributing to open-source projects, or mentoring aspiring developers in frontend technologies.
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-center w-full md:w-auto">
            <div 
              className="bg-white p-1 rounded-full shadow-lg w-48 h-48 md:w-56 md:h-56 flex items-center justify-center hover:shadow-xl transition-all duration-500 overflow-hidden"
              data-aos="flip-right"
            >
              <img 
                src="./Assets/ProfilePic.jpeg" 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const skills = [
    { name: "HTML5", icon: "fab fa-html5", color: "text-orange-500", level: "95%" },
    { name: "CSS3", icon: "fab fa-css3-alt", color: "text-blue-500", level: "90%" },
    { name: "JavaScript", icon: "fab fa-js", color: "text-yellow-500", level: "85%" },
    { name: "Tailwind CSS", icon: "fas fa-paint-brush", color: "text-blue-400", level: "90%" },
    { name: "Bootstrap", icon: "fas fa-bootstrap", color: "text-purple-400", level: "80%" },
    { name: "React", icon: "fab fa-react", color: "text-blue-400", level: "85%" },
    { name: "Redux", icon: "fas fa-boxes", color: "text-purple-400", level: "80%" },
    { name: "Git", icon: "fab fa-git-alt", color: "text-orange-600", level: "85%" },
    { name: "Responsive Design", icon: "fas fa-mobile-alt", color: "text-green-500", level: "90%" },
    { name: "MySQL", icon: "fas fa-database", color: "text-green-500", level: "60%" },
    { name: "Node.js", icon: "fab fa-node-js", color: "text-green-500", level: "60%" },
    { name: "Express", icon: "fas fa-server", color: "text-gray-500", level: "55%" },
    { name: "MongoDB", icon: "fas fa-leaf ", color: "text-green-600", level: "50%" },
    { name: "REST API", icon: "fas fa-code", color: "text-green-400", level: "65%" },
  ];

  return (
    <section id="skills" className="py-16 md:py-20 px-4" data-aos="fade-up">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center gradient-text">My Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {skills.map((skill) => (
            <div 
              key={skill.name} 
              className="skill-card bg-white p-6 rounded-lg shadow hover:shadow-xl transition-all duration-300"
              data-aos="zoom-in"
            >
              <div className="flex items-center mb-4">
                <i className={`${skill.icon} ${skill.color} text-3xl mr-4`}></i>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{skill.name}</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-2.5 rounded-full" 
                      style={{ width: skill.level }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const projects = [
    { 
      name: "Snake Game", 
      tech: "HTML5, Canvas, JavaScript", 
      link: "https://suryassnakegame.netlify.app/", 
      codelink: "https://github.com/Sury002/Snake-Game", 
      description: "A classic Snake game with score tracking feature. Built with vanilla JavaScript and HTML5 Canvas.",
      icon: "fas fa-gamepad",
      image: "./Assets/Sanke game.png"
    },
    { 
      name: "Income Expense Tracker", 
      tech: "HTML, CSS, JavaScript", 
      link: "https://suryasincomeandexpensecalculator.netlify.app/", 
      codelink: "https://github.com/Sury002/Income-Expense-Calculator", 
      description: "A financial tracking application to monitor income and expenses with visual charts and reports.",
      icon: "fas fa-wallet",
      image: "./Assets/I&E Calculator.png"
    },
    { 
      name: "Movie Search App", 
      tech: "ReactJS, OMDB API", 
      link: "https://suryasmoviesearchapp.netlify.app/", 
      codelink: "https://github.com/Sury002/movie-search-app", 
      description: "Interactive movie search application that fetches data from OMDB API with filtering capabilities.",
      icon: "fas fa-film",
      image: "./Assets/Movie Search.png"
    },
    { 
      name: "AI Chat Box", 
      tech: "JavaScript, OpenRouter API", 
      link: "https://openai-chat-box.netlify.app/", 
      codelink: "https://github.com/Sury002/AI-Chat-Box", 
      description: "A responsive chatbot powered by GPT-3.5/4.0 via OpenRouter API, featuring secure serverless backend and token-limited responses for optimal performance.",
      icon: "fas fa-robot",
      image: "./Assets/AI chat box.png"
    },
  ];

  return (
    <section id="projects" className="py-12 md:py-20 px-4 bg-gray-100" data-aos="fade-up">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-5 pb-2 md:mb-12 text-center gradient-text">My Top Projects</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.name} 
              className="relative rounded-xl shadow-xl overflow-hidden h-[300px] sm:h-[350px] md:h-[400px] transition-all duration-300 hover:shadow-2xl group"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              {/* Project Image */}
              <img 
                src={project.image} 
                alt={project.name} 
                className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-50 group-hover:scale-105"
              />
              
              {/* Project Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center mb-4">
                    <i className={`${project.icon} text-2xl md:text-3xl mr-3 text-blue-400`}></i>
                    <h3 className="text-xl md:text-2xl font-bold text-white">{project.name}</h3>
                  </div>
                  <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6">
                    {project.description}
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 mb-4">
                    <span className="font-semibold text-white">Tech Stack:</span> {project.tech}
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 text-sm md:text-base text-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                      <i className="fas fa-external-link-alt"></i> Live Demo
                    </a>
                    <a 
                      href={project.codelink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 text-sm md:text-base text-center text-white bg-gray-800 hover:bg-gray-900 px-4 py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-800/30"
                    >
                      <i className="fab fa-github"></i> Source Code
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-16 md:py-20 px-4" data-aos="fade-up">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 gradient-text">Get In Touch</h2>
        <p className="mb-8 max-w-2xl mx-auto text-sm md:text-base text-gray-600">
          I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll get back to you as soon as possible!
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
          {/* Email Button - Works on all devices */}
          <a 
            href="mailto:Suryabalaji791@gmail.com" 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <i className="fas fa-envelope"></i> 
            <span className="hidden sm:inline">Send Email</span>
            <span className="sm:hidden">Email Me</span>
          </a>
          
          <a 
            href="https://www.linkedin.com/in/suryak24/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-300 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <i className="fab fa-linkedin"></i> 
            <span className="hidden sm:inline">LinkedIn</span>
            <span className="sm:hidden">Connect</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 text-center text-gray-600 text-sm bg-white border-t">
      <div className="flex justify-center gap-4 mb-4">
        <a 
          href="https://github.com/Sury002" 
          target="_blank" 
          className="text-xl hover:text-blue-500 transition-colors duration-300 hover:-translate-y-1"
        >
          <i className="fab fa-github"></i>
        </a>
      </div>
      <p className="mb-2">© {new Date().getFullYear()} Surya. All Rights Reserved.</p>
      <p className="text-xs text-gray-400">Made with ❤️ and React</p>
    </footer>
  );
}

function App() {
  useEffect(() => {
    AOS.init({ 
      duration: 800,
      once: true,
      easing: 'ease-out-quad'
    });
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);