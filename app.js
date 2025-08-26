const { useState, useEffect } = React;
const resumeLink =
  "https://drive.google.com/file/d/1qvWBuQ7RTOBkeaMilGquXEPT0Gs-lido/view";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`flex justify-between items-center p-4 fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900/95 shadow-xl py-3 backdrop-blur-sm"
          : "bg-gray-900/80 py-4 backdrop-blur-sm"
      }`}
      data-aos="fade-down"
    >
      <h1 className="text-2xl font-bold mx-4 md:mx-10 gradient-text">
        Surya K
      </h1>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-2 mx-4 md:mx-10">
        {["Home", "About", "Skills", "Certificates", "Projects", "Contact"].map(
          (item) => (
            <a
              href={`#${item.toLowerCase()}`}
              key={item}
              className="nav-link text-lg font-medium hover:text-purple-400 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              {item}
            </a>
          )
        )}
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
          {[
            "Home",
            "About",
            "Skills",
            "Certificates",
            "Projects",
            "Contact",
          ].map((item) => (
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
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20 bg-gradient-to-b from-gray-900 to-gray-800"
      data-aos="zoom-in"
    >
      <div className="max-w-4xl mx-auto">
        <div className="relative inline-block mb-8">
          <div className="absolute -inset-4 bg-purple-900/30 rounded-full blur-lg opacity-75 animate-pulse-slow"></div>
          <img
            src="./Assets/ProfilePic.jpeg"
            alt="Profile"
            className="relative w-40 h-40 md:w-60 md:h-60 object-cover rounded-full border-4 border-gray-800 shadow-xl"
          />
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          Hi, I'm <span className="gradient-text">Surya</span>{" "}
          <span className="wave animate-waving-hand">👋</span>
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto px-4 text-gray-400">
          I'm a{" "}
          <span className="font-semibold text-purple-400">
            Full Stack Developer
          </span>{" "}
          passionate about building modern web applications with clean code and
          intuitive interfaces.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href={resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:shadow-purple-500/30"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <i className="fas fa-file-alt"></i> View Resume
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border-2 border-purple-500 text-purple-400 rounded-lg hover:bg-gray-800/50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:shadow-purple-500/10"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <i className="fas fa-paper-plane"></i> Contact Me
          </a>
        </div>

        <div className="mt-12 flex justify-center space-x-6">
          <a
            href="https://github.com/Sury002"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-gray-400 hover:text-purple-400 transition-colors hover:-translate-y-1"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/suryak24/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-gray-400 hover:text-blue-400 transition-colors hover:-translate-y-1"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section
      id="about"
      className="py-16 md:py-20 px-4 bg-gray-800"
      data-aos="fade-up"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            About Me
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3 flex justify-center">
            <div
              className="relative w-64 h-64 md:w-96 md:h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group border border-gray-700"
              data-aos="flip-right"
            >
              <img
                src="./Assets\ProfilePic2.jpg"
                alt="Profile"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute flex justify-center inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                <h3 className="text-green-300 text-3xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  Surya K
                </h3>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <div className="bg-gray-700/50 p-6 md:p-8 rounded-xl shadow-inner border border-gray-700/30">
              <p className="text-base md:text-lg mb-4 text-gray-300">
                I'm a{" "}
                <span className="font-semibold text-purple-400">
                  Full Stack Developer
                </span>{" "}
                with expertise in both frontend and backend technologies. My
                journey in web development started with building interactive
                user interfaces, and I've since expanded my skills to encompass
                the entire web development stack.
              </p>
              <p className="text-base md:text-lg mb-4 text-gray-300">
                I specialize in creating{" "}
                <span className="font-semibold">
                  responsive, performant web applications
                </span>{" "}
                using technologies like{" "}
                <span className="text-purple-400">
                  React, Node.js, Express, and MongoDB
                </span>
                . I believe in writing clean, maintainable code and creating
                intuitive user experiences.
              </p>
              <p className="text-base md:text-lg mb-4 text-gray-300">
                My approach combines{" "}
                <span className="text-blue-400">technical expertise</span> with{" "}
                <span className="text-green-400">creative problem-solving</span>
                . Whether it's crafting pixel-perfect UIs or designing efficient
                backend systems, I'm passionate about delivering high-quality
                solutions.
              </p>
              <p className="text-base md:text-lg text-gray-300">
                When I'm not coding, I enjoy contributing to open-source
                projects, learning new technologies, and sharing knowledge with
                other developers.
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
    {
      name: "React",
      icon: "fab fa-react",
      color: "text-blue-400",
      level: "85%",
      category: "frontend",
    },
    {
      name: "JavaScript",
      icon: "fab fa-js",
      color: "text-yellow-400",
      level: "90%",
      category: "frontend",
    },
    {
      name: "HTML5",
      icon: "fab fa-html5",
      color: "text-orange-400",
      level: "95%",
      category: "frontend",
    },
    {
      name: "CSS3",
      icon: "fab fa-css3-alt",
      color: "text-blue-400",
      level: "90%",
      category: "frontend",
    },
    {
      name: "Bootstrap",
      icon: "devicon-bootstrap-plain colored",
      color: "text-purple-500",
      level: "80%",
      category: "frontend",
    },
    {
      name: "Tailwind CSS",
      icon: "devicon-tailwindcss-plain colored",
      color: "text-cyan-400",
      level: "85%",
      category: "frontend",
    },
    {
      name: "Redux",
      icon: "devicon-redux-original colored",
      color: "text-purple-400",
      level: "80%",
      category: "frontend",
    },
    {
      name: "TypeScript",
      icon: "devicon-typescript-plain colored",
      color: "text-blue-500",
      level: "80%",
      category: "frontend",
    },

    // Backend
    {
      name: "Node.js",
      icon: "devicon-nodejs-plain colored",
      color: "text-green-500",
      level: "80%",
      category: "backend",
    },
    {
      name: "Express",
      icon: "devicon-express-original",
      color: "text-gray-300",
      level: "80%",
      category: "backend",
    },
    {
      name: "REST API",
      icon: "fas fa-code",
      color: "text-green-400",
      level: "80%",
      category: "backend",
    },

    // Database
    {
      name: "MongoDB",
      icon: "devicon-mongodb-plain colored",
      color: "text-green-400",
      level: "75%",
      category: "database",
    },
    {
      name: "MySQL",
      icon: "devicon-mysql-plain colored",
      color: "text-blue-400",
      level: "70%",
      category: "database",
    },
    {
      name: "Mongoose",
      icon: "fas fa-database",
      color: "text-red-500",
      level: "80%",
      category: "database",
    },

    // Other
    {
      name: "Git",
      icon: "devicon-git-plain colored",
      color: "text-orange-500",
      level: "85%",
      category: "other",
    },
    {
      name: "Responsive Design",
      icon: "fas fa-mobile-alt",
      color: "text-blue-300",
      level: "90%",
      category: "other",
    },
    {
      name: "Postman",
      icon: "fas fa-paper-plane", // Sending requests
      color: "text-orange-500",
      level: "85%",
      category: "other",
    },
  ];

  const categories = [
    { id: "frontend", name: "Frontend", icon: "fas fa-laptop-code" },
    { id: "backend", name: "Backend", icon: "fas fa-server" },
    { id: "database", name: "Database", icon: "fas fa-database" },
    { id: "other", name: "Other", icon: "fas fa-cogs" },
  ];

  const [activeCategory, setActiveCategory] = useState("frontend");

  return (
    <section
      id="skills"
      className="py-16 md:py-20 px-4 bg-gray-900"
      data-aos="fade-up"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Technical Skills
          </h2>
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
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                activeCategory === category.id
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <i
                className={`${category.icon} ${
                  activeCategory === category.id
                    ? "text-white"
                    : "text-purple-400"
                }`}
              ></i>
              {category.name}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills
            .filter((skill) => skill.category === activeCategory)
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
                    <h3 className="font-semibold text-lg text-gray-100">
                      {skill.name}
                    </h3>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
                        style={{ width: skill.level }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {skill.level}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

function Certificates() {
  const certificates = [
    {
      title:
        "IIT-M Pravartak certified Full Stack Development Course with AI Tools",
      issuer: "Guvi",
      date: "2025",
      image:
        "./Assets/IIT-M Pravartak certified Full Stack Development Course with AI Tools.png",
      credentialLink:
        "https://v2.zenclass.in/certificateDownload/p53TIxsEDb9jhVb2",
    },
    {
      title: "HTML, CSS, and Tailwind CSS",
      issuer: "Guvi",
      date: "2025",
      image: "./Assets/HTML, CSS & Tailwind CSS.png",
      credentialLink:
        "https://v2.zenclass.in/certificateDownload/Hjn9GjWHS2FS8LbW",
    },
    {
      title: "JavaScript Basics",
      issuer: "Guvi",
      date: "2025",
      image: "./Assets/JS Basics.png",
      credentialLink:
        "https://v2.zenclass.in/certificateDownload/ZUFgiemUELBvxbNx",
    },
    {
      title: "AdvancedJS",
      issuer: "Guvi",
      date: "2025",
      image: "./Assets/Advanced JS.png",
      credentialLink:
        "https://v2.zenclass.in/certificateDownload/EEhSHRFDLsP6qYfn",
    },
    {
      title: "ReactJS",
      issuer: "Guvi",
      date: "2025",
      image: "./Assets/ReactJS.png",
      credentialLink:
        "https://v2.zenclass.in/certificateDownload/HfoIqpSiIwUVQpsb",
    },
    {
      title: "Node JS",
      issuer: "Guvi",
      date: "2025",
      image: "./Assets/NodeJS.png",
      credentialLink:
        "https://v2.zenclass.in/certificateDownload/iNEWssqwvh9zLxsx",
    },
    {
      title: "Database",
      issuer: "Guvi",
      date: "2025",
      image: "./Assets/Database.png",
      credentialLink:
        "https://v2.zenclass.in/certificateDownload/7VkwA8LP7PgTOq1W",
    },
    {
      title: "TypeScript",
      issuer: "Guvi",
      date: "2025",
      image: "./Assets/TypeScript.png",
      credentialLink:
        "https://www.guvi.in/share-certificate/B7H8dnY041a1g06U15",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const nextCertificate = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === certificates.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevCertificate = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? certificates.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section
      id="certificates"
      className="py-16 md:py-20 px-4 bg-gray-800"
      data-aos="fade-up"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Certificates
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            My professional certifications in web development
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prevCertificate}
            className="absolute left-0 md:-left-12 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700/90 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:text-purple-400"
            aria-label="Previous certificate"
          >
            <i className="fas fa-chevron-left text-xl"></i>
          </button>

          <button
            onClick={nextCertificate}
            className="absolute right-0 md:-right-12 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700/90 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:text-purple-400"
            aria-label="Next certificate"
          >
            <i className="fas fa-chevron-right text-xl"></i>
          </button>

          {/* Certificate Card with Zoom Effect */}
          <div
            className={`bg-gray-700/50 rounded-xl overflow-hidden shadow-2xl border border-gray-600 hover:border-purple-500/50 transition-all duration-300 ${
              isAnimating ? "opacity-70" : "opacity-100"
            }`}
          >
            <div
              className="relative h-64 md:h-[500px] bg-gray-900 overflow-hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <a
                href={certificates[currentIndex].credentialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <div className="w-full h-full flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={certificates[currentIndex].image}
                    alt={certificates[currentIndex].title}
                    className={`max-w-full max-h-full object-contain transition-all duration-500 ease-in-out ${
                      isAnimating ? "opacity-0" : "opacity-100"
                    } ${isHovered ? "scale-110" : "scale-100"}`}
                    style={{
                      aspectRatio: "3/2",
                      objectPosition: "center",
                    }}
                  />
                </div>
              </a>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white line-clamp-2">
                    {certificates[currentIndex].title}
                  </h3>
                  <p className="text-gray-400">
                    {certificates[currentIndex].issuer} •{" "}
                    {certificates[currentIndex].date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 bg-gray-800 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                    {currentIndex + 1} / {certificates.length}
                  </span>
                  <a
                    href={certificates[currentIndex].credentialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-white bg-purple-900/30 hover:bg-purple-800/50 px-3 py-1 rounded-full text-sm transition-all duration-300 flex items-center gap-1 whitespace-nowrap"
                  >
                    <i className="fas fa-external-link-alt text-xs"></i> Verify
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {certificates.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true);
                setCurrentIndex(index);
                setTimeout(() => setIsAnimating(false), 500);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "bg-purple-500 w-6"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
              aria-label={`Go to certificate ${index + 1}`}
            />
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
      tech: "MERN Stack, Tailwind CSS, Socket.IO, Agora SDK, Stripe",
      link: "https://wellmindcounseling.netlify.app",
      codelink: "https://github.com/Sury002/Online-Counseling-Platform",
      description:
        "A secure, full-stack MERN application for online therapy with role-based dashboards, real-time chat, video calls, and payment system.",
      icon: "fas fa-comments",
      image: "./Assets/WellMind.png",
      featured: true,
    },
    {
      name: "Meme Generator",
      tech: "MERN Stack, Tailwind CSS, Multer, Sharp",
      link: "https://suryasmemegenerator.netlify.app",
      codelink: "https://github.com/Sury002/Meme-Generator",
      description:
        "A full-stack application that allows users to upload images and instantly create hilarious memes with auto-generated captions.",
      icon: "fas fa-image",
      image: "./Assets/Meme Generator.png",
    },
    {
      name: "AI Chat Assistant",
      tech: "MERN Stack, Tailwind CSS, OpenRouter API",
      link: "https://suryaaichatassistant.netlify.app",
      codelink: "https://github.com/Sury002/AI-Chat-Assistant",
      description:
        "A modern, responsive chat application with AI-powered responses, conversation history, and a sleek dark/light mode UI.",
      icon: "fas fa-robot",
      image: "./Assets/AI Chat Assistant.png",
    },
    {
      name: "QR Code Generator",
      tech: "HTML5, Tailwind CSS, JavaScript(ES6)",
      link: "https://suryaqrcodegeneratorpro.netlify.app",
      codelink: "https://github.com/Sury002/QR-Code-Generator-Pro",
      description:
        "A feature-rich, modern web application that allows users to create customizable QR codes for various purposes.",
      icon: "fas fa-qrcode",
      image: "./Assets/QR Code Generator Pro.png",
    },
    {
      name: "Snake Game",
      tech: "HTML5, Canvas, CSS3, JavaScript(ES6)",
      link: "https://suryassnakegame.netlify.app",
      codelink: "https://github.com/Sury002/Snake-Game",
      description:
        "A modern, responsive Snake game, playable on all devices with keyboard controls for desktop and touch controls for mobile.",
      icon: "fas fa-gamepad",
      image: "./Assets/Snake Game.png",
    },
    {
      name: "Income Expense Calculator",
      tech: "HTML5, Tailwind CSS, JavaScript(ES6)",
      link: "https://suryasincomeandexpensecalculator.netlify.app",
      codelink: "https://github.com/Sury002/Income-Expense-Calculator",
      description:
        "A simple, responsive Income Expense Calculator web application to manage your personal finances.",
      icon: "fas fa-coins",
      image: "./Assets/I&E Calculator.png",
    },
    {
      name: "Recipe App",
      tech: "HTML5, Tailwind CSS, JavaScript(ES6)",
      link: "tastybookrecipeapp.netlify.app",
      codelink: "https://github.com/Sury002/Recipe-App",
      description:
        "A modern, responsive recipe explorer. Search, filter, view detailed recipes, and save your favorites",
      icon: "fas fa-utensils",
      image: "./Assets/Recipe.png",
    },
    {
      name: "Food Delivery App",
      tech: "HTML5, CSS3, JavaScript(ES6), TheMealDB API",
      link: "https://suryafooddelight.netlify.app",
      codelink: "https://github.com/Sury002/Food-Delight",
      description:
        "A modern, responsive food delivery web application that offers a seamless experience for ordering delicious meals.",
      icon: "fas fa-motorcycle",
      image: "./Assets/Food Delight.png",
    },
  ];

  return (
    <section
      id="projects"
      className="py-12 md:py-20 px-4 bg-gray-800"
      data-aos="fade-up"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Featured Projects
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Here are some of my recent projects showcasing my full-stack
            capabilities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.name}
              className={`relative rounded-2xl overflow-hidden h-[350px] md:h-[400px] transition-all duration-300 hover:shadow-2xl group border ${
                project.featured
                  ? "border-purple-500/50 ring-2 ring-purple-500/30"
                  : "border-gray-700 hover:border-purple-500/50"
              }`}
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              {project.featured && (
                <div className="absolute top-4 right-4 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                  <i className="fas fa-star"></i>
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
                    <i
                      className={`${project.icon} text-2xl md:text-3xl mr-3 text-purple-400`}
                    ></i>
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      {project.name}
                    </h3>
                  </div>
                  <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6">
                    {project.description}
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 mb-4">
                    <span className="font-semibold text-white">
                      Tech Stack:
                    </span>{" "}
                    {project.tech}
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', or 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("https://formspree.io/f/xgvzrvoj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-16 md:py-20 px-4 bg-gray-900"
      data-aos="fade-up"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-gray-400">
            I'm currently available for freelance work and full-time
            opportunities. Feel free to reach out or send me a message using the
            form below!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gray-800/50 p-6 md:p-8 rounded-xl shadow-lg border border-gray-700/30">
            <h3 className="text-xl font-bold mb-6 text-white">Contact Form</h3>

            {submitStatus === "success" ? (
              <div className="bg-green-900/30 border border-green-800 text-green-400 p-4 rounded-lg mb-6">
                <i className="fas fa-check-circle mr-2"></i>
                Thank you for your message! I'll get back to you soon.
              </div>
            ) : submitStatus === "error" ? (
              <div className="bg-red-900/30 border border-red-800 text-red-400 p-4 rounded-lg mb-6">
                <i className="fas fa-exclamation-circle mr-2"></i>
                There was an error sending your message. Please try again or
                email me directly.
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all"
                  placeholder="Enter your message"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-purple-800 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                } text-white shadow-lg hover:shadow-xl hover:-translate-y-1 hover:shadow-purple-500/30`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-800/50 p-6 md:p-8 rounded-xl shadow-lg border border-gray-700/30">
              <h3 className="text-xl font-bold mb-6 text-white">
                Contact Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="text-purple-400 text-xl mt-1">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-300">Email</h4>
                    <a
                      href="mailto:Suryabalaji791@gmail.com"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      Suryabalaji791@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-blue-400 text-xl mt-1">
                    <i className="fab fa-linkedin-in"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-300">LinkedIn</h4>
                    <a
                      href="https://www.linkedin.com/in/suryak24/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      linkedin.com/in/suryak24
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-gray-300 text-xl mt-1">
                    <i className="fab fa-github"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-300">GitHub</h4>
                    <a
                      href="https://github.com/Sury002"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      github.com/Sury002
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 md:p-8 rounded-xl shadow-lg border border-gray-700/30">
              <h3 className="text-xl font-bold mb-6 text-white">
                Let's Connect
              </h3>
              <p className="text-gray-400 mb-6">
                Feel free to reach out for collaborations or just to say hi! I'm
                always open to discussing new projects, creative ideas or
                opportunities to be part of your vision.
              </p>
            </div>
          </div>
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
            rel="noopener noreferrer"
            className="text-xl hover:text-purple-400 transition-colors duration-300 hover:-translate-y-1"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/suryak24/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl hover:text-blue-400 transition-colors duration-300 hover:-translate-y-1"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>

        <p className="mb-2">
          © {new Date().getFullYear()} Surya K. All Rights Reserved.
        </p>
        <p className="text-xs text-gray-600">
          Crafted with <span className="text-purple-500">❤️</span> using React
          and Tailwind CSS
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
      easing: "ease-out-quad",
    });
  }, []);

  return (
    <div className="dark">
      <div className="min-h-screen bg-gray-900 text-gray-200">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Certificates />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
