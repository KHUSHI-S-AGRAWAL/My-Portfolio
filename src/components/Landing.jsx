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

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <h1 className="landing-bg-title">
          {displayText}
          <span className="typewriter-cursor">|</span>
        </h1>
        <div className="landing-container">
          <div className="landing-info">
            <h3>A Creative</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Designer</div>
              <div className="landing-h2-2">Developer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Developer</div>
              <div className="landing-h2-info-1">Designer</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
