import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

const Loading = () => {
  const { setIsLoading } = useLoading();
  const [stage, setStage] = useState(0); // 0 = gather letters, 1 = move left & reveal text, 2 = exit

  useEffect(() => {
    // Stage 1: Move KA left and reveal "Welcome to Khushi's Work"
    const t1 = setTimeout(() => {
      setStage(1);
    }, 1000);

    // Stage 2: Trigger slide/fade exit transition
    const t2 = setTimeout(() => {
      setStage(2);
    }, 2800);

    // Stage 3: Complete loading and run page entrance animations
    const t3 = setTimeout(() => {
      import("./utils/initialFX").then((module) => {
        if (module.initialFX) {
          module.initialFX();
        }
        setIsLoading(false);
      });
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [setIsLoading]);

  return (
    <div className={`loading-screen ${stage === 2 ? "exit" : ""}`}>
      <div className={`welcome-logo-container ${stage >= 1 ? "shifted" : ""}`}>
        <div className="logo-ka-glow">
          <span className="logo-letter letter-k">K</span>
          <span className="logo-letter letter-a">A</span>
        </div>
        
        <div className={`welcome-work-text-wrapper ${stage >= 1 ? "reveal" : ""}`}>
          <div className="welcome-divider"></div>
          <span className="welcome-work-text">Welcome to Khushi's Space</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;

export const setProgress = (setLoading) => {
  function loaded() {
    return new Promise((resolve) => {
      setLoading(100);
      resolve(100);
    });
  }
  return { loaded, percent: 100, clear: () => {} };
};
