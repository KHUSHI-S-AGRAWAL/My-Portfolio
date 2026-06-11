import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import StaggeredMenu from "./StaggeredMenu";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother;

const Navbar = () => {
  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    const handleMenuClick = (e) => {
      const href = e.currentTarget.getAttribute("href");
      if (href) {
        e.preventDefault();
        
        // Find toggle button and check if menu is open
        const toggleBtn = document.querySelector(".sm-toggle");
        const isExpanded = toggleBtn?.getAttribute("aria-expanded") === "true";
        
        if (isExpanded) {
          toggleBtn.click(); // Close menu
        }

        // Delay smooth scroll slightly for closing animation to feel natural
        setTimeout(() => {
          if (href === "#" || href === "") {
            if (smoother) smoother.scrollTo(0, true);
          } else {
            if (window.innerWidth > 1024 && smoother) {
              smoother.scrollTo(href, true, "top top");
            } else {
              const targetEl = document.querySelector(href);
              if (targetEl) {
                targetEl.scrollIntoView({ behavior: "smooth" });
              }
            }
          }
        }, isExpanded ? 350 : 0);
      }
    };

    // Delay selector query to ensure elements are mounted
    const timer = setTimeout(() => {
      const panelLinks = document.querySelectorAll(".sm-panel-item");
      panelLinks.forEach((elem) => {
        elem.addEventListener("click", handleMenuClick);
      });
    }, 100);

    window.addEventListener("resize", () => {
      ScrollSmoother.refresh(true);
    });

    return () => {
      clearTimeout(timer);
      const panelLinks = document.querySelectorAll(".sm-panel-item");
      panelLinks.forEach((elem) => {
        elem.removeEventListener("click", handleMenuClick);
      });
    };
  }, []);

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '#' },
    { label: 'About', ariaLabel: 'Learn about me', link: '#about' },
    { label: 'Work', ariaLabel: 'View my work', link: '#work' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' }
  ];

  const socialItems = [
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' }
  ];

  return (
    <>
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#ccc"
        openMenuButtonColor="#111"
        changeMenuColorOnOpen={true}
        colors={['#100d14', '#1b1722', '#00d2ff']}
        logoUrl=""
        accentColor="#00d2ff"
        isFixed={true}
      />
      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
