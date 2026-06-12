import "./styles/Career.css";
import { TbTrophy, TbCertificate, TbTarget, TbAward } from "react-icons/tb";

const Career = () => {
  const achievements = [
    {
      title: "CEP Poster Competition",
      role: "Winner",
      date: "2025",
      desc: "Won first prize at the College Entrepreneurship Program poster competition for the presentation of innovative software solutions.",
      icon: <TbTrophy />,
      accent: "#a855f7"
    },
    {
      title: "National Hackathons",
      role: "Participant & Finalist",
      date: "2025",
      desc: "Participant at INDRADHANU National Level Hackathon and finalist at PICT Impetus 2025. Actively designed and pitched functional workflow architectures.",
      icon: <TbTarget />,
      accent: "#38bdf8"
    },
    {
      title: "WWT Women Hackathon",
      role: "National Participant",
      date: "2025",
      desc: "Competed at the WWT All India Women Only Hackathon, collaborating on high-pressure developer sprint cycles.",
      icon: <TbAward />,
      accent: "#ff79c6"
    },
    {
      title: "Technical Certifications",
      role: "NPTEL & IIT Bombay",
      date: "2024 - 2025",
      desc: "Certified in Programming in C & Python (NPTEL), and HTML & Java through EduPyramids (SINE, IIT Bombay).",
      icon: <TbCertificate />,
      accent: "#fbbf24"
    }
  ];

  return (
    <div className="career-section section-container" id="timeline">
      <div className="career-container">
        <h2>
          Achievements <span>&</span>
          <br /> Certifications
        </h2>
        
        <div className="achievements-bento-grid">
          {achievements.map((item, idx) => (
            <div 
              key={idx} 
              className="achievement-card"
              style={{ "--accent": item.accent }}
            >
              <div className="achievement-card-glow"></div>
              <div className="achievement-header">
                <span className="achievement-icon" style={{ color: item.accent }}>
                  {item.icon}
                </span>
              </div>
              <div className="achievement-body">
                <h3>{item.title}</h3>
                <h4>{item.role}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
