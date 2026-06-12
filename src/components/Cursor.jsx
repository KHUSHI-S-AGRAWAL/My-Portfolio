import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const getContainingBlock = element => {
  let node = element?.parentElement;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== 'none' ||
      style.perspective !== 'none' ||
      style.filter !== 'none' ||
      style.willChange.includes('transform') ||
      style.willChange.includes('perspective') ||
      style.willChange.includes('filter') ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

const getContainingBlockOffset = block => {
  if (!block) return { x: 0, y: 0 };
  const rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
};

const Cursor = () => {
  const cursorRef = useRef(null);
  useEffect(() => {
    let hover = false;
    const cursor = cursorRef.current;
    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };
    
    const containingBlock = getContainingBlock(cursor);
    
    document.addEventListener("mousemove", (e) => {
      const offset = getContainingBlockOffset(containingBlock);
      mousePos.x = e.clientX - offset.x;
      mousePos.y = e.clientY - offset.y;
    });
    requestAnimationFrame(function loop() {
      if (!hover) {
        const delay = 6;
        cursorPos.x += (mousePos.x - cursorPos.x) / delay;
        cursorPos.y += (mousePos.y - cursorPos.y) / delay;
        cursor.style.transform = `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`;
      }
      requestAnimationFrame(loop);
    });
    document.querySelectorAll("[data-cursor]").forEach((item) => {
      const element = item;
      element.addEventListener("mouseover", (e) => {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const offset = getContainingBlockOffset(containingBlock);

        if (element.dataset.cursor === "icons") {
          cursor.classList.add("cursor-icons");
          cursor.style.transform = `translate3d(${rect.left - offset.x}px, ${rect.top - offset.y}px, 0)`;
          cursor.style.setProperty("--cursorH", `${rect.height}px`);
          hover = true;
        }
        if (element.dataset.cursor === "disable") {
          cursor.classList.add("cursor-disable");
        }
      });
      element.addEventListener("mouseout", () => {
        cursor.classList.remove("cursor-disable", "cursor-icons");
        hover = false;
      });
    });
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
