import { useState } from "react";
import "./styles/Work.css";
import LogoLoop from "./LogoLoop";
import { 
  SiReact, 
  SiNextdotjs, 
  SiNodedotjs, 
  SiExpress, 
  SiMongodb, 
  SiTailwindcss, 
  SiHtml5, 
  SiCss, 
  SiJavascript, 
  SiPython 
} from "react-icons/si";
import { TbBrain } from "react-icons/tb";
import { BiCodeAlt } from "react-icons/bi";

const toolIconMap = {
  mongodb: { node: <SiMongodb />, title: "MongoDB", href: "https://www.mongodb.com" },
  express: { node: <SiExpress />, title: "Express", href: "https://expressjs.com" },
  react: { node: <SiReact />, title: "React", href: "https://react.dev" },
  "node.js": { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
  "ai integration": { node: <TbBrain />, title: "AI Integration" },
  "predictive apis": { node: <TbBrain />, title: "Predictive APIs" },
  "tailwind css": { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  "api integration": { node: <BiCodeAlt />, title: "API Integration" },
  "web scraping": { node: <SiPython />, title: "Python (Scraping)", href: "https://www.python.org" },
  html: { node: <SiHtml5 />, title: "HTML5", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  html5: { node: <SiHtml5 />, title: "HTML5", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  css: { node: <SiCss />, title: "CSS3", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  css3: { node: <SiCss />, title: "CSS3", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  javascript: { node: <SiJavascript />, title: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  "responsive design": { node: <BiCodeAlt />, title: "Responsive Design" },
  "ui/ux architecture": { node: <BiCodeAlt />, title: "UI/UX" }
};

const projects = [
  {
    name: "Arthika",
    category: "Multilingual Financial Literacy Platform",
    description:
      "Built a multilingual MERN web app empowering rural women with budget planning, expense tracking, and AI-driven interactive financial learning tools. Winner of the CEP Poster Competition.",
    tools: ["MongoDB", "Express", "React", "Node.js", "AI Integration"],
    accent: "#ff79c6",
    image: "/images/arthika.png",
    link: "https://arthika-pearl.vercel.app/"
  },
  {
    name: "BlueAlert",
    category: "AI-Powered Flood Prediction & Emergency System",
    description:
      "Developed a real-time safety and flood monitoring dashboard featuring predictive APIs, rapid emergency alert notifications, and location sharing to enable faster assistance during critical situations.",
    tools: ["React", "Node.js", "Express", "Predictive APIs", "Tailwind CSS"],
    accent: "#38bdf8",
    image: "/images/bluealert.png",
    link: "#"
  },
  {
    name: "DealCheck",
    category: "Smart Price Comparison Platform",
    description:
      "A smart, single-interface price comparison platform designed to help users find the absolute best deals across top e-commerce websites by aggregating live retail data in real time.",
    tools: ["React", "Node.js", "Express", "API Integration", "Web Scraping"],
    accent: "#8be9fd",
    image: "/images/dealcheck.png",
    link: "https://deal-check-five.vercel.app/"
  },
  {
    name: "StudySpark",
    category: "Student Productivity Platform",
    description:
      "Created a student productivity and workflow optimization application integrating customized study timers, tasks management, and resource organization to maximize learning efficiency.",
    tools: ["HTML", "CSS", "JavaScript", "React"],
    accent: "#bd93f9",
    image: "/images/studyspark.png",
    link: "https://studyspark-kl5a.onrender.com/"
  },
  {
    name: "MyHRSG",
    category: "HR Professional Community Platform",
    description:
      "Designed and engineered a highly responsive, cross-device community website layout focused on optimized frontend user experience and modern HR networking features.",
    tools: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "UI/UX Architecture"],
    accent: "#ffb86c",
    image: "/images/myhrsg.png",
    link: "#"
  }
];

const Work = () => {
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2 className="work-heading">
          Featured <span>Work</span>
        </h2>
        <p className="work-subheading">
          Here is a selection of projects I've built, combining robust engineering with refined user interfaces.
        </p>

        <div className="projects-loop-container">
          <LogoLoop
            logos={projects}
            speed={40}
            direction="left"
            logoHeight={480}
            gap={40}
            hoverSpeed={0}
            scaleOnHover={false}
            fadeOut
            fadeOutColor="#0b080c"
            ariaLabel="Featured Projects"
            renderItem={(project) => (
              <div className="project-loop-card" style={{ "--project-accent": project.accent }}>
                <div className="project-loop-image-wrapper">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="project-loop-image"
                  />
                </div>
                <div className="project-loop-info">
                  <span
                    className="project-loop-category"
                    style={{ color: project.accent }}
                  >
                    {project.category}
                  </span>
                  <h3 className="project-loop-title">{project.name}</h3>
                  <p className="project-loop-description">
                    {project.description}
                  </p>
                  <div className="project-loop-tools">
                    {project.tools.map((tool, tIdx) => {
                      const key = tool.toLowerCase();
                      const iconObj = toolIconMap[key];
                      return (
                        <span key={tIdx} className="project-loop-tool-tag">
                          {iconObj && (
                            <span className="tool-tag-icon">
                              {iconObj.node}
                            </span>
                          )}
                          {tool}
                        </span>
                      );
                    })}
                  </div>
                  {project.link !== "#" && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="project-loop-visit-btn"
                      style={{
                        background: `linear-gradient(135deg, ${project.accent}, #a855f7)`,
                      }}
                    >
                      Visit Site
                      <svg
                        className="visit-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: "12px", height: "12px", marginLeft: "4px" }}
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Work;
