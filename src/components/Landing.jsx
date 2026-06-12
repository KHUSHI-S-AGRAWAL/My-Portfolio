import { useEffect, useState } from "react";
import "./styles/Landing.css";
import { useLoading } from "../context/LoadingProvider";

const Landing = ({ children }) => {
  const [displayText, setDisplayText] = useState("");
  const { isLoading } = useLoading();
  const targetText = "HI, I'M KHUSHI";

  useEffect(() => {
    if (isLoading) return;

    let index = 0;
    let intervalId;
    
    const delayTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        if (index <= targetText.length) {
          setDisplayText(targetText.slice(0, index));
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 90);
    }, 400);

    return () => {
      clearTimeout(delayTimer);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLoading]);

  // Cross-fade slideshow for the role (Developer, Computer Engineer, Software Developer)
  const roles = ["Frontend Developer", "Computer Engineer", "Software Developer"];
  const [roleIdx, setRoleIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setRoleIdx((prev) => (prev + 1) % roles.length);
        setFade(true);
      }, 500); // Match transition duration
    }, 3500);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <h1 className="landing-bg-title">
          {displayText}
          <span className="typewriter-cursor">|</span>
        </h1>
        
        {/* Left Side Intro */}
        <div className="landing-left-intro">
          <span className="left-intro-tag">Welcome to my space</span>
          <h3 className="left-intro-heading">Engineering digital experiences.</h3>
          <p className="left-intro-text">
            Computer Engineering student focused on building robust full-stack applications, database workflows, and refined user interfaces.
          </p>
        </div>

        <div className="landing-container">
          <div className="landing-info">
            <h2 className="landing-info-h2">
              <span className={`role-fade-text ${fade ? "fade-in" : "fade-out"}`}>
                {roles[roleIdx]}
              </span>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
