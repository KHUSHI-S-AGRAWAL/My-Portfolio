import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import { OrbitControls } from "three-stdlib";

const WhatIDo3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const canvasElement = containerRef.current;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const aspect = canvasElement.clientWidth / canvasElement.clientHeight;
    
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    camera.position.set(2.0, 1.3, 3.2); // Balanced angle showing typing action

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    canvasElement.appendChild(renderer.domElement);

    // 2. Interactive Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Stay above ground
    controls.minDistance = 1.5;
    controls.maxDistance = 5.0;
    controls.target.set(0, 0.05, 0.0); // Focus on the laptop typing level

    // 3. Studio Accent Lighting (Cyan/Purple theme)
    const ambientLight = new THREE.AmbientLight(0x0f0f1a, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(4, 6, 3);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Cyan glowing laptop screen light
    const cyanLight = new THREE.PointLight(0x00f0ff, 3.5, 2.0);
    cyanLight.position.set(0, 0.35, 0.05);
    scene.add(cyanLight);

    // Purple soft rim light
    const purpleLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    purpleLight.position.set(-3, 3, -3);
    scene.add(purpleLight);

    // Floor shadow catcher
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.3 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.75;
    floor.receiveShadow = true;
    scene.add(floor);

    // 4. Construct Custom Furniture & Laptop (Papercraft Low-Poly Style)
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x854d0e, // Warm wood brown
      roughness: 0.9,
      metalness: 0.0,
      flatShading: true,
    });

    const fabricMat = new THREE.MeshStandardMaterial({
      color: 0x6b21a8, // Accent purple
      roughness: 0.95,
      metalness: 0.0,
      flatShading: true,
    });

    // --- Table ---
    const tableGroup = new THREE.Group();
    const topGeo = new THREE.BoxGeometry(1.2, 0.04, 0.7);
    const tableTop = new THREE.Mesh(topGeo, woodMat);
    tableTop.position.set(0, -0.08, -0.1);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    const legGeo = new THREE.BoxGeometry(0.05, 0.65, 0.05);
    const legPositions = [
      [-0.55, -0.425, -0.4],
      [0.55, -0.425, -0.4],
      [-0.55, -0.425, 0.2],
      [0.55, -0.425, 0.2]
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, woodMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      leg.receiveShadow = true;
      tableGroup.add(leg);
    });
    scene.add(tableGroup);

    // --- Chair ---
    const chairGroup = new THREE.Group();
    const seatGeo = new THREE.BoxGeometry(0.42, 0.04, 0.42);
    const seat = new THREE.Mesh(seatGeo, fabricMat);
    seat.position.set(0, -0.28, 0.45);
    seat.castShadow = true;
    seat.receiveShadow = true;
    chairGroup.add(seat);

    const chairLegGeo = new THREE.BoxGeometry(0.03, 0.47, 0.03);
    const chairLegPositions = [
      [-0.18, -0.515, 0.26],
      [0.18, -0.515, 0.26],
      [-0.18, -0.515, 0.64],
      [0.18, -0.515, 0.64]
    ];
    chairLegPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(chairLegGeo, woodMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      leg.receiveShadow = true;
      chairGroup.add(leg);
    });

    const backSupportGeo = new THREE.BoxGeometry(0.03, 0.45, 0.03);
    const leftSupport = new THREE.Mesh(backSupportGeo, woodMat);
    leftSupport.position.set(-0.18, -0.075, 0.64);
    leftSupport.castShadow = true;
    chairGroup.add(leftSupport);

    const rightSupport = leftSupport.clone();
    rightSupport.position.set(0.18, -0.075, 0.64);
    chairGroup.add(rightSupport);

    const backrestGeo = new THREE.BoxGeometry(0.39, 0.16, 0.03);
    const backrest = new THREE.Mesh(backrestGeo, fabricMat);
    backrest.position.set(0, 0.08, 0.64);
    backrest.castShadow = true;
    chairGroup.add(backrest);

    scene.add(chairGroup);

    // --- Laptop ---
    const createLaptop = () => {
      const laptopGroup = new THREE.Group();
      laptopGroup.name = "laptop";

      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.8,
        metalness: 0.2,
        flatShading: true,
      });

      const keyboardMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.9,
        metalness: 0.1,
        flatShading: true,
      });

      const screenMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        flatShading: true,
      });

      const baseGeo = new THREE.BoxGeometry(0.38, 0.015, 0.26);
      const base = new THREE.Mesh(baseGeo, bodyMat);
      base.castShadow = true;
      base.receiveShadow = true;
      laptopGroup.add(base);

      const kbGeo = new THREE.BoxGeometry(0.34, 0.002, 0.13);
      const kb = new THREE.Mesh(kbGeo, keyboardMat);
      kb.position.set(0, 0.008, 0.03);
      laptopGroup.add(kb);

      const lidGroup = new THREE.Group();
      lidGroup.position.set(0, 0.008, -0.13);

      const lidGeo = new THREE.BoxGeometry(0.38, 0.26, 0.012);
      const lidMesh = new THREE.Mesh(lidGeo, bodyMat);
      lidMesh.position.set(0, 0.13, -0.006);
      lidMesh.castShadow = true;
      lidMesh.receiveShadow = true;
      lidGroup.add(lidMesh);

      const displayGeo = new THREE.PlaneGeometry(0.35, 0.23);
      const display = new THREE.Mesh(displayGeo, screenMat);
      display.position.set(0, 0.13, 0.001);
      lidGroup.add(display);

      lidGroup.rotation.x = -0.2;
      laptopGroup.add(lidGroup);
      return laptopGroup;
    };

    const laptop = createLaptop();
    laptop.position.set(0, -0.06, -0.02);
    scene.add(laptop);

    // --- Desk Lamp ---
    const lampGroup = new THREE.Group();
    const lampBaseGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.015, 8);
    const lampBase = new THREE.Mesh(lampBaseGeo, fabricMat);
    lampBase.position.set(-0.45, -0.06, -0.25);
    lampBase.castShadow = true;
    lampGroup.add(lampBase);

    const lampArmGeo = new THREE.BoxGeometry(0.02, 0.38, 0.02);
    const lampArm = new THREE.Mesh(lampArmGeo, woodMat);
    lampArm.position.set(-0.45, 0.12, -0.25);
    lampArm.rotation.z = 0.25;
    lampArm.castShadow = true;
    lampGroup.add(lampArm);

    const lampHeadGeo = new THREE.ConeGeometry(0.08, 0.1, 8);
    const lampHead = new THREE.Mesh(lampHeadGeo, fabricMat);
    lampHead.position.set(-0.38, 0.30, -0.25);
    lampHead.rotation.z = -0.8;
    lampHead.castShadow = true;
    lampGroup.add(lampHead);

    const lampLight = new THREE.PointLight(0xfef08a, 2.5, 2.0);
    lampLight.position.set(-0.35, 0.26, -0.25);
    scene.add(lampLight);
    scene.add(lampGroup);

    // --- Load Character ---
    const loader = new GLTFLoader();
    let characterNode = null;

    const applyPaperMaterial = (node) => {
      node.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          const lowerName = child.name.toLowerCase();
          if (lowerName.includes("eye") || lowerName.includes("pupil") || lowerName.includes("cornea")) {
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat) => { mat.roughness = 0.1; });
              } else {
                child.material.roughness = 0.1;
              }
            }
            return;
          }

          if (child.material) {
            const makePaper = (mat) => {
              return new THREE.MeshStandardMaterial({
                color: mat.color ? mat.color.clone() : new THREE.Color(0xffffff),
                map: mat.map || null,
                roughness: 1.0,
                metalness: 0.0,
                flatShading: true,
                side: THREE.DoubleSide
              });
            };
            if (Array.isArray(child.material)) {
              child.material = child.material.map(makePaper);
            } else {
              child.material = makePaper(child.material);
            }
          }
        }
      });
    };

    let hips = null;
    let spine = null;
    let spine1 = null;
    let spine2 = null;
    let head = null;
    let leftUpLeg = null;
    let rightUpLeg = null;
    let leftLeg = null;
    let rightLeg = null;
    let leftArm = null;
    let rightArm = null;
    let leftForeArm = null;
    let rightForeArm = null;
    let leftHand = null;
    let rightHand = null;
    let leftFoot = null;
    let rightFoot = null;

    loader.load(
      "/models/character.glb",
      (gltf) => {
        characterNode = gltf.scene;
        characterNode.scale.set(1.2, 1.2, 1.2);
        
        characterNode.position.set(0, -1.47, 0.52);
        characterNode.rotation.y = Math.PI;

        characterNode.traverse((child) => {
          if (child.isMesh && child.morphTargetDictionary) {
            Object.keys(child.morphTargetDictionary).forEach((key) => {
              const lowerKey = key.toLowerCase();
              if (lowerKey.includes("smile")) {
                const idx = child.morphTargetDictionary[key];
                child.morphTargetInfluences[idx] = 0.28;
              }
            });
          }
        });

        if (gltf.animations) {
          gltf.animations = [];
        }

        applyPaperMaterial(characterNode);
        cyanLight.position.set(0, 0.07, -0.06);

        const findBone = (keys) => {
          let result = null;
          characterNode.traverse((child) => {
            if (result) return;
            const name = (child.name || "").toLowerCase();
            for (const key of keys) {
              const lowerKey = key.toLowerCase();
              if (
                name === lowerKey ||
                name.endsWith(":" + lowerKey) ||
                name.endsWith("_" + lowerKey) ||
                name.endsWith(lowerKey) ||
                name.includes("_" + lowerKey) ||
                name.includes(":" + lowerKey)
              ) {
                result = child;
                break;
              }
            }
          });
          return result;
        };

        hips = findBone(["hips", "pelvis"]);
        scene.add(characterNode);
        
        spine = findBone(["spine", "spine1", "spine2", "chest", "upperbody"]);
        spine1 = findBone(["spine1", "spine_1", "chest"]);
        spine2 = findBone(["spine2", "spine_2", "upper_chest"]);
        head = findBone(["head"]);
        leftUpLeg = findBone(["leftupleg", "thigh_l", "thighl", "upperleg_l"]);
        rightUpLeg = findBone(["rightupleg", "thigh_r", "thighr", "upperleg_r"]);
        leftLeg = findBone(["leftleg", "shin_l", "shinl", "lowerleg_l"]);
        rightLeg = findBone(["rightleg", "shin_r", "shinr", "lowerleg_r"]);
        leftArm = findBone(["leftarm", "upperarm_l", "upperarml", "upper_arm_l", "shoulder_l"]);
        rightArm = findBone(["rightarm", "upperarm_r", "upperarmr", "upper_arm_r", "shoulder_r"]);
        leftForeArm = findBone(["leftforearm", "forearm_l", "forearml", "lowerarm_l"]);
        rightForeArm = findBone(["rightforearm", "forearm_r", "forearmr", "lowerarm_r"]);
        leftHand = findBone(["lefthand", "hand_l", "handl", "left_hand"]);
        rightHand = findBone(["righthand", "hand_r", "handr", "right_hand"]);
        leftFoot = findBone(["leftfoot", "foot_l", "footl", "left_foot"]);
        rightFoot = findBone(["rightfoot", "foot_r", "footr", "right_foot"]);
      },
      undefined,
      (err) => console.error("Error loading character.glb", err)
    );

    // 5. Animation Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (hips) {
        hips.rotation.set(0.0, 0.0, 0.0);
      }

      if (leftUpLeg) leftUpLeg.rotation.set(1.35, 0.02, 0.0);
      if (rightUpLeg) rightUpLeg.rotation.set(1.35, -0.02, 0.0);
      if (leftLeg) leftLeg.rotation.set(1.25, 0.0, 0.0);
      if (rightLeg) rightLeg.rotation.set(1.25, 0.0, 0.0);
      if (leftFoot) leftFoot.rotation.set(-0.15, Math.PI, 0.0);
      if (rightFoot) rightFoot.rotation.set(-0.15, Math.PI, 0.0);

      if (head) {
        head.rotation.set(0.15 + Math.sin(elapsedTime * 1.5) * 0.01, Math.cos(elapsedTime * 0.6) * 0.01, 0.0);
      }
      if (spine) spine.rotation.set(-0.02 + Math.sin(elapsedTime * 1.5) * 0.002, 0.0, 0.0);
      if (spine1) spine1.rotation.set(-0.01, 0.0, 0.0);
      if (spine2) spine2.rotation.set(-0.01, 0.0, 0.0);

      // --- ALIGNMENT COORDS FOR LAPTOP KEYBOARD PLACEMENT ---
      
      // 1. Point upper arms forward while pulling elbows inwards tighter to her sides (Z-angle change)
      if (leftArm) {
        leftArm.rotation.order = "XYZ";
        leftArm.rotation.set(1.1, 0.4, -0.6); 
      }
      if (rightArm) {
        rightArm.rotation.order = "XYZ";
        rightArm.rotation.set(1.1, -0.4, 0.6); 
      }

      // 2. Fold elbows forward and angle inward across the desk (Y-angle change)
      if (leftForeArm) {
        leftForeArm.rotation.order = "XYZ";
        leftForeArm.rotation.set(-1.4, 0.8, 0.0); 
      }
      if (rightForeArm) {
        rightForeArm.rotation.order = "XYZ";
        rightForeArm.rotation.set(-1.4, -0.8, 0.0); 
      }

      // 3. Level hands flat with beautiful dynamic typing cycles
      if (leftHand) {
        leftHand.rotation.order = "XYZ";
        leftHand.rotation.set(
          0.3 + Math.sin(elapsedTime * 15.0) * 0.05, 
          0.0, 
          0.0
        );
      }
      if (rightHand) {
        rightHand.rotation.order = "XYZ";
        rightHand.rotation.set(
          0.3 + Math.cos(elapsedTime * 13.5) * 0.05, 
          0.0, 
          0.0
        );
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!canvasElement) return;
      const width = canvasElement.clientWidth;
      const height = canvasElement.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      controls.dispose();

      if (canvasElement && renderer.domElement) {
        canvasElement.removeChild(renderer.domElement);
      }

      scene.traverse((obj) => {
        if (!obj.isMesh) return;
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else if (obj.material) {
          obj.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="what-i-do-3d-canvas"
      style={{
        width: "100%",
        height: "500px",
        position: "relative",
        cursor: "grab",
      }}
    />
  );
};

export default WhatIDo3D;