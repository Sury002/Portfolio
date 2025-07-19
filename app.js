const { useState, useEffect } = React;
const resumeLink = "https://drive.google.com/file/d/16bis1_aQmdpJTCE5ohC4xH1mfIcY4WIC/view";

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
    <nav className={`flex justify-between items-center p-4 fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/95 shadow-xl py-3 backdrop-blur-sm' : 'bg-gray-900/80 py-4 backdrop-blur-sm'}`} data-aos="fade-down">
      <h1 className="text-2xl font-bold mx-4 md:mx-10 gradient-text">Surya K</h1>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-2 mx-4 md:mx-10">
        {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
          <a
            href={`#${item.toLowerCase()}`}
            key={item}
            className="nav-link text-lg font-medium hover:text-purple-400 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            {item}
          </a>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden mx-4 text-2xl text-purple-400 focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-800 shadow-2xl py-4 px-6 animate-fadeIn">
          {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
            <a
              href={`#${item.toLowerCase()}`}
              key={item}
              className="block py-3 px-4 hover:bg-gray-700 rounded-lg hover:text-purple-400 transition-colors font-medium"
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
    <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20 bg-gradient-to-b from-gray-900 to-gray-800" data-aos="zoom-in">
      <div className="max-w-4xl mx-auto">
        <div className="relative inline-block mb-8">
          <div className="absolute -inset-4 bg-purple-900/30 rounded-full blur-lg opacity-75 animate-pulse-slow"></div>
          <img
            src="./Assets/ProfilePic.jpeg"
            alt="Profile"
            className="relative w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-gray-800 shadow-xl"
          />
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          Hi, I'm <span className="gradient-text">Surya</span> <span className="wave animate-waving-hand">👋</span>
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto px-4 text-gray-400">
          I'm a <span className="font-semibold text-purple-400">Full Stack Developer</span> passionate about building modern web applications with clean code and intuitive interfaces.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href={resumeLink}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:shadow-purple-500/30"
            data-aos="fade-up" data-aos-delay="100"
          >
            <i className="fas fa-file-alt"></i> View Resume
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border-2 border-purple-500 text-purple-400 rounded-lg hover:bg-gray-800/50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:shadow-purple-500/10"
            data-aos="fade-up" data-aos-delay="200"
          >
            <i className="fas fa-paper-plane"></i> Contact Me
          </a>
        </div>

        <div className="mt-12 flex justify-center space-x-6">
          <a href="https://github.com/Sury002" target="_blank" className="text-2xl text-gray-400 hover:text-purple-400 transition-colors hover:-translate-y-1">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/suryak24/" target="_blank" className="text-2xl text-gray-400 hover:text-blue-400 transition-colors hover:-translate-y-1">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-16 md:py-20 px-4 bg-gray-800" data-aos="fade-up">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3 flex justify-center">
            <div
              className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group border border-gray-700"
              data-aos="flip-right"
            >
              <img
                src="./Assets/ProfilePic.jpeg"
                alt="Profile"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <h3 className="text-white text-xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  Full Stack Developer
                </h3>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <div className="bg-gray-700/50 p-6 md:p-8 rounded-xl shadow-inner border border-gray-700/30">
              <p className="text-base md:text-lg mb-4 text-gray-300">
                I'm a <span className="font-semibold text-purple-400">Full Stack Developer</span> with expertise in both frontend and backend technologies. My journey in web development started with building interactive user interfaces, and I've since expanded my skills to encompass the entire web development stack.
              </p>
              <p className="text-base md:text-lg mb-4 text-gray-300">
                I specialize in creating <span className="font-semibold">responsive, performant web applications</span> using technologies like <span className="text-purple-400">React, Node.js, Express, and MongoDB</span>. I believe in writing clean, maintainable code and creating intuitive user experiences.
              </p>
              <p className="text-base md:text-lg mb-4 text-gray-300">
                My approach combines <span className="text-blue-400">technical expertise</span> with <span className="text-green-400">creative problem-solving</span>. Whether it's crafting pixel-perfect UIs or designing efficient backend systems, I'm passionate about delivering high-quality solutions.
              </p>
              <p className="text-base md:text-lg text-gray-300">
                When I'm not coding, I enjoy contributing to open-source projects, learning new technologies, and sharing knowledge with other developers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const skills = [
    // Frontend
    { name: "React", icon: "fab fa-react", color: "text-blue-400", level: "85%", category: "frontend" },
    { name: "JavaScript", icon: "fab fa-js", color: "text-yellow-400", level: "90%", category: "frontend" },
    { name: "HTML5", icon: "fab fa-html5", color: "text-orange-400", level: "95%", category: "frontend" },
    { name: "CSS3", icon: "fab fa-css3-alt", color: "text-blue-400", level: "90%", category: "frontend" },
    { name: "Tailwind CSS", icon: "fas fa-paint-brush", color: "text-cyan-400", level: "85%", category: "frontend" },
    { name: "Redux", icon: "fas fa-boxes", color: "text-purple-400", level: "80%", category: "frontend" },

    // Backend
    { name: "Node.js", icon: "fab fa-node-js", color: "text-green-500", level: "80%", category: "backend" },
    { name: "Express", icon: "fas fa-server", color: "text-gray-300", level: "80%", category: "backend" },

    // Database
    { name: "MongoDB", icon: "fas fa-database", color: "text-green-400", level: "75%", category: "database" },
    { name: "PostgreSQL", icon: "fas fa-database", color: "text-blue-400", level: "70%", category: "database" },
    { name: "REST API", icon: "fas fa-code", color: "text-green-400", level: "80%", category: "database" },

    // Other
    { name: "Git", icon: "fab fa-git-alt", color: "text-orange-500", level: "85%", category: "other" },
    { name: "Responsive Design", icon: "fas fa-mobile-alt", color: "text-blue-300", level: "90%", category: "other" },
  ];

  const categories = [
    { id: "frontend", name: "Frontend", icon: "fas fa-laptop-code" },
    { id: "backend", name: "Backend", icon: "fas fa-server" },
    { id: "database", name: "Database", icon: "fas fa-database" },
    { id: "other", name: "Other", icon: "fas fa-cogs" },
  ];

  const [activeCategory, setActiveCategory] = useState("frontend");

  return (
    <section id="skills" className="py-16 md:py-20 px-4 bg-gray-900" data-aos="fade-up">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Technical Skills</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            My comprehensive skill set across the development stack
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${activeCategory === category.id ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              <i className={`${category.icon} ${activeCategory === category.id ? 'text-white' : 'text-purple-400'}`}></i>
              {category.name}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills
            .filter(skill => skill.category === activeCategory)
            .map((skill) => (
              <div
                key={skill.name}
                className="skill-card bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-700 hover:border-purple-500/30"
                data-aos="zoom-in"
              >
                <div className="flex items-center mb-4">
                  <div className={`${skill.color} text-3xl mr-4`}>
                    <i className={skill.icon}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-100">{skill.name}</h3>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
                        style={{ width: skill.level }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400 mt-1 block">{skill.level}</span>
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
      name: "Online Counseling Platform",
      tech: "MERN Stack, Socket.IO, Agora SDK, Stripe",
      link: "https://wellmindcounseling.netlify.app/",
      codelink: "https://github.com/Sury002/Online-Counseling-Platform",
      description: "A secure, full-stack MERN application for online therapy with role-based dashboards, real-time chat, video calls, and payment system.",
      icon: "fas fa-comments",
      image: "./Assets/WellMind.png",
      featured: true
    },
    {
      name: "Recipe App",
      tech: "React, TailwindCSS, TheMealDB API",
      link: "https://tastybookrecipeapp.netlify.app",
      codelink: "https://github.com/Sury002/Recipe-App",
      description: "A modern recipe explorer with search, filtering, detailed recipes, and favorites functionality with dark mode support.",
      icon: "fas fa-utensils",
      image: "./Assets/Recipe.png"
    },
    {
      name: "AI Chat Box",
      tech: "JavaScript, OpenRouter API",
      link: "https://openai-chat-box.netlify.app/",
      codelink: "https://github.com/Sury002/AI-Chat-Box",
      description: "A responsive chatbot powered by GPT-3.5/4.0 via OpenRouter API, featuring secure serverless backend.",
      icon: "fas fa-robot",
      image: "./Assets/AI chat box.png"
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
      name: "Income Expense Tracker",
      tech: "HTML, CSS, JavaScript",
      link: "https://suryasincomeandexpensecalculator.netlify.app/",
      codelink: "https://github.com/Sury002/Income-Expense-Calculator",
      description: "A financial tracking application to monitor income and expenses with visual charts and reports.",
      icon: "fas fa-wallet",
      image: "./Assets/I&E Calculator.png"
    },
    {
      name: "Snake Game",
      tech: "HTML5, Canvas, JavaScript",
      link: "https://suryassnakegame.netlify.app/",
      codelink: "https://github.com/Sury002/Snake-Game",
      description: "A classic Snake game with score tracking feature. Built with vanilla JavaScript and HTML5 Canvas.",
      icon: "fas fa-gamepad",
      image: "./Assets/Sanke game.png"
    }
  ];

  return (
    <section id="projects" className="py-12 md:py-20 px-4 bg-gray-800" data-aos="fade-up">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Featured Projects</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Here are some of my recent projects showcasing my full-stack capabilities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.name}
              className={`relative rounded-2xl overflow-hidden h-[350px] md:h-[400px] transition-all duration-300 hover:shadow-2xl group border ${project.featured ? 'border-purple-500/50 ring-2 ring-purple-500/30' : 'border-gray-700 hover:border-purple-500/50'}`}
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              {project.featured && (
                <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                  <i className="fas fa-star mr-1"></i> Featured
                </div>
              )}
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-50 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center mb-4">
                    <i className={`${project.icon} text-2xl md:text-3xl mr-3 text-purple-400`}></i>
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
                      className="flex-1 text-sm md:text-base text-center text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
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
    <section id="contact" className="py-16 md:py-20 px-4 bg-gray-900" data-aos="fade-up">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Get In Touch</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        <p className="mb-8 max-w-2xl mx-auto text-sm md:text-base text-gray-400">
          I'm currently available for freelance work and full-time opportunities. Feel free to reach out!
        </p>

        <div className="flex justify-center gap-6">
          <a
            href="mailto:Suryabalaji791@gmail.com"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:shadow-purple-500/30"
          >
            <i className="fas fa-envelope"></i> Email Me
          </a>
          <a
            href="https://www.linkedin.com/in/suryak24/"
            target="_blank"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:shadow-blue-500/30"
          >
            <i className="fab fa-linkedin-in"></i> LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 text-center text-gray-500 text-sm bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-center gap-6 mb-6">
          <a
            href="https://github.com/Sury002"
            target="_blank"
            className="text-xl hover:text-purple-400 transition-colors duration-300 hover:-translate-y-1"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/suryak24/"
            target="_blank"
            className="text-xl hover:text-blue-400 transition-colors duration-300 hover:-translate-y-1"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>

        <p className="mb-2">© {new Date().getFullYear()} Surya K. All Rights Reserved.</p>
        <p className="text-xs text-gray-600">
          Crafted with <span className="text-purple-500">❤️</span> using React and Tailwind CSS
        </p>
      </div>
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
    <div className="dark">
      <div className="min-h-screen bg-gray-900 text-gray-200">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);