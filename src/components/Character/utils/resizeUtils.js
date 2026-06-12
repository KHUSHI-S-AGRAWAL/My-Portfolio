import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

export default function handleResize(renderer, camera, canvasDiv, character) {
  if (!canvasDiv.current) return;
  let canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width;
  const height = canvas3d.height;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  let zoom = 1.0;
  if (width < 600) {
    zoom = 0.85;
  } else if (width < 1024) {
    zoom = 0.95;
  } else if (width < 1440) {
    zoom = 1.1;
  }
  
  if (height < 900 && width > 600) {
    zoom *= 0.8;
  }
  camera.zoom = zoom;
  camera.updateProjectionMatrix();
  const workTrigger = ScrollTrigger.getById("work");
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger != workTrigger) {
      trigger.kill();
    }
  });
  setCharTimeline(character, camera);
  setAllTimeline();
}
