import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WhatIDo3D from "./WhatIDo3D";

const WhatIDo = () => {
  const containerRef = useRef([]);
  const setRef = (el, index) => {
    containerRef.current[index] = el;
  };
  useEffect(() => {
    if (ScrollTrigger.isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          container.classList.remove("what-noTouch");
          container.addEventListener("click", () => handleClick(container));
        }
      });
    }

    // Hide standing character and extra laptop when in "What I Do" section
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const standingChar = document.querySelector(".character-container");
        if (entry.isIntersecting) {
          if (standingChar) {
            standingChar.style.display = "none";
          }
        } else {
          // If we scroll back up, show it again
          if (standingChar) {
            standingChar.style.display = "block";
          }
        }
      });
    }, { threshold: 0.5 });

    const element = document.querySelector(".whatIDO");
    if (element) {
      observer.observe(element);
    }

    return () => {
      containerRef.current.forEach((container) => {
        if (container) {
          container.removeEventListener("click", () => handleClick(container));
        }
      });
      observer.disconnect();
    };
  }, []);
  return (
    <div className="whatIDO" style={{ position: "relative" }}>
      <div className="what-title-container">
        <h2 className="title">
          WHAT <span className="do-h2">I DO</span>
        </h2>
      </div>
      <div className="what-content-wrapper-three-col">
        {/* Left Column: Development */}
        <div className="what-side-column left-side">
          <div className="what-box-in">
            <div className="what-border2">
              <svg width="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="7,7"
                />
                <line
                  x1="100%"
                  y1="0"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="7,7"
                />
              </svg>
            </div>
            <div
              className="what-content what-noTouch cursor-target"
              ref={(el) => setRef(el, 0)}
            >
              <div className="what-border1">
                <svg height="100%">
                  <line
                    x1="0"
                    y1="0"
                    x2="100%"
                    y2="0"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                  />
                  <line
                    x1="0"
                    y1="100%"
                    x2="100%"
                    y2="100%"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                  />
                </svg>
              </div>
              <div className="what-corner"></div>

              <div className="what-content-in">
                <h3>DEVELOPMENT</h3>
                <h4>Languages & Web</h4>
                <p>
                  Building modern, responsive, and robust web applications with
                  clean architecture and optimized front-end and back-end
                  performance.
                </p>
                <h5>Skillset & tools</h5>
                <div className="what-content-flex">
                  <div className="what-tags">JavaScript</div>
                  <div className="what-tags">Python</div>
                  <div className="what-tags">Java</div>
                  <div className="what-tags">C</div>
                  <div className="what-tags">HTML</div>
                  <div className="what-tags">CSS</div>
                  <div className="what-tags">React</div>
                  <div className="what-tags">Tailwind CSS</div>
                  <div className="what-tags">Node.js</div>
                  <div className="what-tags">Express</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Styled Image */}
        <div className="what-model-column">
          <div className="what-image-wrapper">
            <div className="work-image-glow-container what-i-do-image-container">
              <img
                src="/images/woman_working.png"
                alt="Woman working on laptop"
                className="work-female-image"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Databases */}
        <div className="what-side-column right-side">
          <div className="what-box-in">
            <div className="what-border2">
              <svg width="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="7,7"
                />
                <line
                  x1="100%"
                  y1="0"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="7,7"
                />
              </svg>
            </div>
            <div
              className="what-content what-noTouch cursor-target"
              ref={(el) => setRef(el, 1)}
            >
              <div className="what-border1">
                <svg height="100%">
                  <line
                    x1="0"
                    y1="0"
                    x2="100%"
                    y2="0"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                  />
                  <line
                    x1="0"
                    y1="100%"
                    x2="100%"
                    y2="100%"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                  />
                </svg>
              </div>
              <div className="what-corner"></div>
              <div className="what-content-in">
                <h3>DATABASES</h3>
                <h4>Databases & Tools</h4>
                <p>
                  Managing relational and non-relational databases, version
                  control, and modern UI/UX design tools for efficient prototyping
                  and deployment.
                </p>
                <h5>Skillset & tools</h5>
                <div className="what-content-flex">
                  <div className="what-tags">MySQL</div>
                  <div className="what-tags">MongoDB</div>
                  <div className="what-tags">Git / GitHub</div>
                  <div className="what-tags">Figma</div>
                  <div className="what-tags">Canva</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);

    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
