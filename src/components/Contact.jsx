import { MdArrowOutward, MdCopyright, MdEmail, MdPhone } from "react-icons/md";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { TbNotes } from "react-icons/tb";
import "./styles/Contact.css";

const Contact = () => {
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3 className="contact-title-main">
          Get In <span>Touch</span>
        </h3>

        <div className="contact-terminal-grid">
          {/* Card 1: Direct Info */}
          <div className="contact-glass-card direct-info-card" onMouseMove={handleMouseMove}>
            <div className="card-spotlight"></div>
            <div className="contact-card-header">
              <span className="card-icon-badge">
                <MdEmail />
              </span>
              <h4>Direct Channels</h4>
            </div>
            
            <div className="channel-box">
              <span className="channel-label">Send an Email</span>
              <a
                href="mailto:khushiagrawal2815@gmail.com"
                className="channel-link"
                data-cursor="disable"
              >
                khushiagrawal2815@gmail.com
                <MdArrowOutward className="outward-icon" />
              </a>
            </div>

            <div className="channel-box">
              <span className="channel-label">Call Directly</span>
              <a href="tel:+917558694834" className="channel-link" data-cursor="disable">
                +91 75586 94834
                <MdArrowOutward className="outward-icon" />
              </a>
            </div>
          </div>

          {/* Card 2: Social Networks */}
          <div className="contact-glass-card social-networks-card" onMouseMove={handleMouseMove}>
            <div className="card-spotlight"></div>
            <div className="contact-card-header">
              <span className="card-icon-badge">
                <FaLinkedin />
              </span>
              <h4>Profiles & Communities</h4>
            </div>
            
            <div className="socials-matrix">
              <a
                href="https://github.com/KHUSHI-S-AGRAWAL"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
                className="matrix-link github-matrix"
              >
                <SiGithub />
                <span>GitHub</span>
                <MdArrowOutward />
              </a>

              <a
                href="https://www.linkedin.com/in/khushi-agrawal-879547305"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
                className="matrix-link linkedin-matrix"
              >
                <FaLinkedin />
                <span>LinkedIn</span>
                <MdArrowOutward />
              </a>

              <a
                href="/KHUSHI_AGRAWAL_RESUME.pdf"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
                className="matrix-link resume-matrix"
              >
                <TbNotes />
                <span>Resume</span>
                <MdArrowOutward />
              </a>
            </div>
          </div>

          {/* Card 3: Signature Card */}
          <div className="contact-glass-card signature-card" onMouseMove={handleMouseMove}>
            <div className="card-spotlight"></div>
            <div className="signature-flex-container">
              <h2>
                Designed & Developed <br />
                by <span className="highlight-signature">Khushi Agrawal</span>
              </h2>
              <div className="footer-credits">
                <span className="copyright-tag">
                  <MdCopyright /> 2026 Portfolio
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
