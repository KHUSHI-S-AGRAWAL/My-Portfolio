import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef(null);
  const hoverDivRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [character, setChar] = useState(null);
  const [cryptoError, setCryptoError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      let zoom = 1.0;
      if (container.width < 600) {
        zoom = 0.85;
      } else if (container.width < 1024) {
        zoom = 0.95;
      } else if (container.width < 1440) {
        zoom = 1.1;
      }
      
      if (container.height < 900 && container.width > 600) {
        zoom *= 0.8;
      }
      
      camera.zoom = zoom;
      camera.updateProjectionMatrix();

      let headBone = null;
      let screenLight = null;
      let mixer;
      let hasAnimations = false;
      let loadedChar = null;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter()
        .then((gltf) => {
          if (!isMounted) return;
          if (gltf) {
            // STRIP ARM TRACKS FROM GLTF ANIMATIONS BEFORE MIXER INITIALIZATION
            if (gltf.animations && gltf.animations.length > 0) {
              const armTrackNames = [
                "leftarm",
                "leftforearm",
                "lefthand",
                "rightarm",
                "rightforearm",
                "righthand",
                "upper_arm",
                "forearm",
                "hand",
                "shoulder",
                "clavicle",
                "thumb",
                "finger",
                "index",
                "middle",
                "ring",
                "pinky",
              ];

              gltf.animations.forEach((clip) => {
                clip.tracks = clip.tracks.filter((track) => {
                  const name = track.name.toLowerCase();
                  return !armTrackNames.some((pattern) =>
                    name.includes(pattern),
                  );
                });
              });
            }

            const animations = setAnimations(gltf);
            hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
            mixer = animations.mixer;
            hasAnimations =
              Array.isArray(gltf.animations) && gltf.animations.length > 0;
            let character = gltf.scene;
            loadedChar = character;
            setChar(character);
            scene.add(character);
            // Debug helper: when visiting with ?debugBones=1, log bone names
            try {
              const debugBones =
                new URLSearchParams(window.location.search).get(
                  "debugBones",
                ) === "1";
              if (debugBones) {
                console.group("Character bone/object list");
                character.traverse((c) => {
                  if (!c) return;
                  const info = `${c.type || "Object3D"} — ${c.name || "(no-name)"}`;
                  // show likely arm/forearm/hand candidates
                  if (
                    /arm|fore|hand|shoulder|upper|wrist|mixamorig/i.test(
                      c.name || "",
                    )
                  ) {
                    console.log(info, c);
                    // add small visual marker so you can see joint locations
                    const markerGeo = new THREE.SphereGeometry(0.06, 6, 6);
                    const markerMat = new THREE.MeshBasicMaterial({
                      color: 0xff0000,
                    });
                    const marker = new THREE.Mesh(markerGeo, markerMat);
                    marker.name = `debug_marker_${c.name}`;
                    // attach marker to the node (won't affect skinning)
                    c.add(marker);
                  }
                });
                console.groupEnd();
              }
            } catch (e) {
              console.warn("debugBones helper failed", e);
            }
            headBone =
              character.getObjectByName("Head") ||
              character.getObjectByName("spine006") ||
              null;
            screenLight = character.getObjectByName("screenlight") || null;
            progress.loaded().then(() => {
              setTimeout(() => {
                light.turnOnLights();
                animations.startIntro();
              }, 2500);
            });
          }
        })
        .catch((err) => {
          if (!isMounted) return;
          if (
            err instanceof Error &&
            err.message.includes("Web Crypto API is unavailable")
          ) {
            setCryptoError(err.message);
          } else {
            setCryptoError("Failed to load 3D character model.");
          }
        });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce;
      const onTouchStart = (event) => {
        const element = event.target;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y })),
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", (event) => {
        onMouseMove(event);
      });
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart, {
          passive: true,
        });
        landingDiv.addEventListener("touchend", onTouchEnd, { passive: true });
      }

      const handleWindowResize = () => {
        handleResize(renderer, camera, canvasDiv, loadedChar || character);
      };
      window.addEventListener("resize", handleWindowResize);

      const animate = () => {
        requestAnimationFrame(animate);
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp,
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer && hasAnimations) {
          mixer.update(delta);
        }

        if (loadedChar) {
          // Check if this is the sitting model setup by looking for desktop-specific objects
          const isDesktopModel = loadedChar.getObjectByName("Plane004") || loadedChar.getObjectByName("screenlight") || loadedChar.name.includes("SimpleFemaleCharacter");

          if (isDesktopModel) {
            let leftArm = undefined;
            let rightArm = undefined;
            let leftForeArm = undefined;
            let rightForeArm = undefined;
            let leftHand = undefined;
            let rightHand = undefined;

            loadedChar.traverse((child) => {
              const name = child.name.toLowerCase();
              if (name.endsWith("leftarm") || name.endsWith("upper_arml") || name.endsWith("leftuparm")) leftArm = child;
              if (name.endsWith("rightarm") || name.endsWith("upper_armr") || name.endsWith("rightuparm")) rightArm = child;
              if (name.endsWith("leftforearm") || name.endsWith("forearml")) leftForeArm = child;
              if (name.endsWith("rightforearm") || name.endsWith("forearmr")) rightForeArm = child;
              if (name.endsWith("lefthand") || name.endsWith("handl")) leftHand = child;
              if (name.endsWith("righthand") || name.endsWith("handr")) rightHand = child;
            });

            // Rotate upper arms forward and down toward the desk
            if (leftArm && leftArm.rotation) leftArm.rotation.set(1.4, 0.3, -0.5);
            if (rightArm && rightArm.rotation) rightArm.rotation.set(1.4, -0.3, 0.5);

            // Bend elbows inward so the hands meet at the laptop keyboard
            if (leftForeArm && leftForeArm.rotation) leftForeArm.rotation.set(1.2, 0.0, 0.0);
            if (rightForeArm && rightForeArm.rotation) rightForeArm.rotation.set(1.2, 0.0, 0.0);

            // Flatten the wrists so the palms face down on the keys
            if (leftHand && leftHand.rotation) leftHand.rotation.set(-0.3, 0.0, 0.0);
            if (rightHand && rightHand.rotation) rightHand.rotation.set(-0.3, 0.0, 0.0);
          } else {
            const findBone = (names) => {
              for (const name of names) {
                const bone = loadedChar.getObjectByName(name);
                if (bone) return bone;
              }
              let result = null;
              loadedChar.traverse((child) => {
                const childName = (child.name || "").toLowerCase();
                if (
                  names.some((pattern) =>
                    childName.includes(pattern.toLowerCase()),
                  )
                ) {
                  result = result || child;
                }
              });
              return result;
            };

            const leftUpperArm = findBone([
              "upper_armL",
              "upperarmL",
              "LeftArm",
              "leftArm",
              "left_arm",
            ]);
            const leftForeArm = findBone([
              "forearmL",
              "forearm_L",
              "LeftForeArm",
              "leftForeArm",
              "left_forearm",
              "LeftForearm",
            ]);
            const leftHand = findBone([
              "handL",
              "hand_L",
              "LeftHand",
              "leftHand",
              "left_hand",
            ]);
            const rightUpperArm = findBone([
              "upper_armR",
              "upperarmR",
              "RightArm",
              "rightArm",
              "right_arm",
            ]);
            const rightForeArm = findBone([
              "forearmR",
              "forearm_R",
              "RightForeArm",
              "rightForeArm",
              "right_forearm",
              "RightForearm",
            ]);
            const rightHand = findBone([
              "handR",
              "hand_R",
              "RightHand",
              "rightHand",
              "right_hand",
            ]);

            const applyLocalRotation = (bone, x, y, z) => {
              if (!bone || !bone.rotation) return;
              bone.rotation.order = "XYZ";
              bone.rotation.set(x, y, z);
              bone.matrixAutoUpdate = true;
              bone.updateMatrix();
              bone.updateMatrixWorld(true);
            };

            if (leftUpperArm && leftUpperArm.rotation) {
              applyLocalRotation(leftUpperArm, 1.45, 0.0, 0.0);
            }
            if (leftForeArm && leftForeArm.rotation) {
              applyLocalRotation(leftForeArm, 0.0, 0.0, 0.0);
            }
            if (leftHand && leftHand.rotation) {
              applyLocalRotation(leftHand, 0.0, 0.0, 0.0);
            }

            if (rightUpperArm && rightUpperArm.rotation) {
              applyLocalRotation(rightUpperArm, 1.45, 0.0, 0.0);
            }
            if (rightForeArm && rightForeArm.rotation) {
              applyLocalRotation(rightForeArm, 0.0, 0.0, 0.0);
            }
            if (rightHand && rightHand.rotation) {
              applyLocalRotation(rightHand, 0.0, 0.0, 0.0);
            }
          }

          // Open/uncurle the thumbs so they are open like the fingers
          loadedChar.traverse((child) => {
            if (child.isBone && child.name.toLowerCase().includes("thumb")) {
              child.rotation.set(0, 0, 0);
            }
          });

          loadedChar.updateMatrixWorld(true);
        }

        renderer.render(scene, camera);
      };
      animate();
      return () => {
        isMounted = false;
        clearTimeout(debounce);
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", handleWindowResize);
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  if (cryptoError) {
    return (
      <div style={{ color: "#f55", padding: 24, textAlign: "center" }}>
        <h2>3D Character Unavailable</h2>
        <p>{cryptoError}</p>
      </div>
    );
  }

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
