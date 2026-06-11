import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          Education <span>&</span>
          <br /> Timeline
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.E. in Computer Engineering</h4>
                <h5>PCCOER</h5>
              </div>
              <h3>2024 - 2028</h3>
            </div>
            <p>
              Pimpri Chinchwad College of Engineering and Research (PCCOER).
              Outstanding academic record: Semester 1: 9.86 SGPA | Semester 2:
              9.68 SGPA | Semester 3: 9.23 SGPA.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Technical Certifications</h4>
                <h5>NPTEL & EduPyramids</h5>
              </div>
              <h3>2024 - 2025</h3>
            </div>
            <p>
              NPTEL Certifications in Programming in C and Python. Certified in
              HTML and JAVA by EduPyramids (SINE, IIT Bombay).
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Hackathons & Achievements</h4>
                <h5>National & International Events</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Finalist at INDRADHANU International Grand Challenge, PICT Impetus
              2025, and WWT All India Women Only Hackathon. Winner of CEP Poster
              Competition. Entrepreneurship Development Program (UDBHAV).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
