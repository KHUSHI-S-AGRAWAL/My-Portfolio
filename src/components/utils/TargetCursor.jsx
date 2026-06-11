import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import '../styles/TargetCursor.css';

// A position: fixed element is positioned relative to the viewport UNLESS an
// ancestor establishes a containing block (transform, perspective, filter,
// will-change of those, or contain). When that happens, the cursor's translate
// no longer maps to viewport coordinates, so we measure and compensate for it.
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

const TargetCursor = ({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hoverDuration = 0.2,
  parallaxOn = true
}) => {
  const cursorRef = useRef(null);
  const cornersRef = useRef(null);
  const spinTl = useRef(null);
  const containingBlockRef = useRef(null);

  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef(null);
  const tickerFnRef = useRef(null);
  const activeStrengthRef = useRef(0);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
  }, []);

  const constants = useMemo(
    () => ({
      borderWidth: 3,
      cornerSize: 12
    }),
    []
  );

  const moveCursor = useCallback((x, y) => {
    if (!cursorRef.current) return;
    const { x: offsetX, y: offsetY } = getContainingBlockOffset(containingBlockRef.current);
    gsap.to(cursorRef.current, {
      x: x - offsetX,
      y: y - offsetY,
      duration: 0.1,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const cursor = cursorRef.current;
    
    // Hide custom target cursor by default
    gsap.set(cursor, { opacity: 0, visibility: 'hidden' });

    cornersRef.current = cursor.querySelectorAll('.target-cursor-corner');

    containingBlockRef.current = getContainingBlock(cursor);
    const getOffset = () => getContainingBlockOffset(containingBlockRef.current);

    let activeTarget = null;
    let resumeTimeout = null;

    const initialOffset = getOffset();
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - initialOffset.x,
      y: window.innerHeight / 2 - initialOffset.y
    });

    const createSpinTimeline = () => {
      if (spinTl.current) {
        spinTl.current.kill();
      }
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };

    createSpinTimeline();

    const tickerFn = () => {
      if (!cursorRef.current || !cornersRef.current) {
        return;
      }

      // Dynamically calculate target bounding rect each frame so corners expand with the box
      if (activeTarget) {
        const rect = activeTarget.getBoundingClientRect();
        const { borderWidth, cornerSize } = constants;
        const { x: offsetX, y: offsetY } = getOffset();
        targetCornerPositionsRef.current = [
          { x: rect.left - borderWidth - offsetX, y: rect.top - borderWidth - offsetY },
          { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.top - borderWidth - offsetY },
          { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
          { x: rect.left - borderWidth - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY }
        ];
      }

      const strength = activeStrengthRef.current;
      if (strength === 0 || !targetCornerPositionsRef.current) return;

      const cursorX = gsap.getProperty(cursorRef.current, 'x');
      const cursorY = gsap.getProperty(cursorRef.current, 'y');

      const corners = Array.from(cornersRef.current);
      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x');
        const currentY = gsap.getProperty(corner, 'y');

        const targetX = targetCornerPositionsRef.current[i].x - cursorX;
        const targetY = targetCornerPositionsRef.current[i].y - cursorY;

        // Use a lerp factor to smoothly glide the corners to the targets per-frame
        const lerpFactor = 0.25; 
        const finalX = currentX + (targetX - currentX) * lerpFactor;
        const finalY = currentY + (targetY - currentY) * lerpFactor;

        gsap.set(corner, {
          x: finalX,
          y: finalY
        });
      });
    };

    tickerFnRef.current = tickerFn;

    const moveHandler = e => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    const mouseDownHandler = () => {
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
    };

    const mouseUpHandler = () => {
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    // Delegated hover handler on document
    const handleMouseOver = e => {
      const target = e.target.closest(targetSelector);
      if (target) {
        if (activeTarget === target) return;
        
        activeTarget = target;
        const corners = Array.from(cornersRef.current);
        corners.forEach(corner => gsap.killTweensOf(corner));

        gsap.killTweensOf(cursorRef.current, 'rotation');
        spinTl.current?.pause();
        gsap.set(cursorRef.current, { rotation: 0 });

        const rect = target.getBoundingClientRect();
        const { borderWidth, cornerSize } = constants;
        const { x: offsetX, y: offsetY } = getOffset();
        const cursorX = gsap.getProperty(cursorRef.current, 'x');
        const cursorY = gsap.getProperty(cursorRef.current, 'y');

        targetCornerPositionsRef.current = [
          { x: rect.left - borderWidth - offsetX, y: rect.top - borderWidth - offsetY },
          { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.top - borderWidth - offsetY },
          { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
          { x: rect.left - borderWidth - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY }
        ];

        isActiveRef.current = true;
        gsap.ticker.add(tickerFnRef.current);

        gsap.to(activeStrengthRef, {
          current: 1,
          duration: hoverDuration,
          ease: 'power2.out'
        });

        // Instantly align corners to start snapping smoothly
        corners.forEach((corner, i) => {
          gsap.set(corner, {
            x: targetCornerPositionsRef.current[i].x - cursorX,
            y: targetCornerPositionsRef.current[i].y - cursorY
          });
        });

        // Hide standard custom cursor
        const mainCursor = document.querySelector('.cursor-main');
        if (mainCursor) {
          mainCursor.classList.add('cursor-main-hidden');
        }

        // Show target corners
        gsap.to(cursor, { opacity: 1, visibility: 'visible', duration: 0.2, overwrite: 'auto' });
      } else {
        if (activeTarget) {
          gsap.ticker.remove(tickerFnRef.current);

          isActiveRef.current = false;
          targetCornerPositionsRef.current = null;
          gsap.set(activeStrengthRef, { current: 0, overwrite: true });
          activeTarget = null;

          // Restore standard custom cursor
          const mainCursor = document.querySelector('.cursor-main');
          if (mainCursor) {
            mainCursor.classList.remove('cursor-main-hidden');
          }

          // Hide target corners immediately when leaving target elements
          gsap.to(cursor, { opacity: 0, visibility: 'hidden', duration: 0.2, overwrite: 'auto' });

          if (cornersRef.current) {
            const corners = Array.from(cornersRef.current);
            gsap.killTweensOf(corners);
            const { cornerSize } = constants;
            const positions = [
              { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
              { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
              { x: cornerSize * 0.5, y: cornerSize * 0.5 },
              { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
            ];
            const tl = gsap.timeline();
            corners.forEach((corner, index) => {
              tl.to(
                corner,
                {
                  x: positions[index].x,
                  y: positions[index].y,
                  duration: 0.3,
                  ease: 'power3.out'
                },
                0
              );
            });
          }

          if (resumeTimeout) clearTimeout(resumeTimeout);
          resumeTimeout = setTimeout(() => {
            if (!activeTarget && cursorRef.current && spinTl.current) {
              const currentRotation = gsap.getProperty(cursorRef.current, 'rotation');
              const normalizedRotation = currentRotation % 360;
              spinTl.current.kill();
              spinTl.current = gsap
                .timeline({ repeat: -1 })
                .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
              gsap.to(cursorRef.current, {
                rotation: normalizedRotation + 360,
                duration: spinDuration * (1 - normalizedRotation / 360),
                ease: 'none',
                onComplete: () => {
                  spinTl.current?.restart();
                }
              });
            }
          }, 50);
        }
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    const resizeHandler = () => {
      containingBlockRef.current = getContainingBlock(cursor);
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
      }

      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);

      document.removeEventListener('mouseover', handleMouseOver);

      // Restore standard custom cursor on unmount
      const mainCursor = document.querySelector('.cursor-main');
      if (mainCursor) {
        mainCursor.classList.remove('cursor-main-hidden');
      }

      if (resumeTimeout) clearTimeout(resumeTimeout);
      spinTl.current?.kill();

      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      activeStrengthRef.current = 0;
    };
  }, [targetSelector, spinDuration, moveCursor, constants, isMobile, hoverDuration, parallaxOn]);

  useEffect(() => {
    if (isMobile || !cursorRef.current || !spinTl.current) return;
    if (spinTl.current.isActive()) {
      spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    }
  }, [spinDuration, isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>
  );
};

export default TargetCursor;
