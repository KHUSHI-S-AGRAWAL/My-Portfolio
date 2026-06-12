import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

const createSimpleFemaleCharacter = () => {
  const character = new THREE.Group();
  character.name = "SimpleFemaleCharacter";

  const skinMaterial = new THREE.MeshStandardMaterial({
    color: "#f6d0b2",
    roughness: 0.75,
    metalness: 0.05,
  });
  const dressMaterial = new THREE.MeshStandardMaterial({
    color: "#8c2f71",
    roughness: 0.8,
    metalness: 0.1,
  });
  const hairMaterial = new THREE.MeshStandardMaterial({
    color: "#2b1f2b",
    roughness: 0.9,
    metalness: 0.05,
  });

  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.15, 3.4, 16),
    dressMaterial,
  );
  torso.position.set(0, 1.2, 0);
  character.add(torso);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.78, 24, 24),
    skinMaterial,
  );
  head.position.set(0, 4.1, 0);
  character.add(head);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.92, 24, 24),
    hairMaterial,
  );
  hair.position.set(0, 4.28, -0.12);
  hair.scale.set(1.05, 0.9, 1.05);
  character.add(hair);

  const leftArmMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 2.2, 12),
    skinMaterial,
  );
  leftArmMesh.position.set(-1.25, 2.3, 0);
  leftArmMesh.rotation.z = Math.PI / 2.8;
  character.add(leftArmMesh);

  const rightArmMesh = leftArmMesh.clone();
  rightArmMesh.position.set(1.25, 2.3, 0);
  rightArmMesh.rotation.z = -Math.PI / 2.8;
  character.add(rightArmMesh);

  const leftLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 2.4, 12),
    skinMaterial,
  );
  leftLeg.position.set(-0.4, -1.1, 0);
  character.add(leftLeg);

  const rightLeg = leftLeg.clone();
  rightLeg.position.set(0.4, -1.1, 0);
  character.add(rightLeg);

  const skirt = new THREE.Mesh(
    new THREE.ConeGeometry(1.35, 1.8, 16),
    dressMaterial,
  );
  skirt.position.set(0, 0.2, 0);
  skirt.rotation.x = Math.PI;
  character.add(skirt);

  const leftBreast = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 16, 16),
    skinMaterial,
  );
  leftBreast.position.set(-0.45, 2.8, 0.95);
  character.add(leftBreast);

  const rightBreast = leftBreast.clone();
  rightBreast.position.set(0.45, 2.8, 0.95);
  character.add(rightBreast);

  const spineBone = new THREE.Object3D();
  spineBone.name = "spine005";
  spineBone.position.set(0, 2.35, 0);
  character.add(spineBone);

  const screenLight = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.3, 0.12),
    new THREE.MeshStandardMaterial({
      color: "#C8BFFF",
      emissive: "#C8BFFF",
      emissiveIntensity: 1,
      transparent: true,
      opacity: 0,
    }),
  );
  screenLight.name = "screenlight";
  screenLight.position.set(0, 2.8, -1.1);
  character.add(screenLight);

  const plane004 = new THREE.Group();
  plane004.name = "Plane004";
  const monitorScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 0.6),
    new THREE.MeshStandardMaterial({
      name: "Material.027",
      color: "#FFFFFF",
      transparent: true,
      opacity: 0,
    }),
  );
  plane004.add(monitorScreen);
  plane004.position.set(0, 2.8, -1.2);
  character.add(plane004);

  const leftFoot = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.2, 0.8),
    skinMaterial,
  );
  leftFoot.name = "footL";
  leftFoot.position.set(-0.4, -2.3, 0.15);
  character.add(leftFoot);

  const rightFoot = leftFoot.clone();
  rightFoot.name = "footR";
  rightFoot.position.set(0.4, -2.3, 0.15);
  character.add(rightFoot);

  return { scene: character, animations: [] };
};

const loadCharacterGLB = async (renderer, scene, camera) => {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync("/models/character.glb");
  if (gltf.scene) {
    await renderer.compileAsync(gltf.scene, camera, scene);
  }
  return gltf;
};

const setCharacter = (renderer, scene, camera) => {
  const loadCharacter = async () => {
    try {
      let gltf;

      try {
        gltf = await loadCharacterGLB(renderer, scene, camera);
        gltf.scene.scale.set(5.8, 5.8, 5.8);
        gltf.scene.position.setY(4.0);
      } catch (loadError) {
        console.warn(
          "Failed to load /models/character.glb, using fallback model",
          loadError,
        );
        gltf = createSimpleFemaleCharacter();
      }

      const character = gltf.scene;

      let leftArm = undefined;
      let rightArm = undefined;
      let leftForeArm = undefined;
      let rightForeArm = undefined;
      let leftHand = undefined;
      let rightHand = undefined;

      character.traverse((child) => {
        const name = (child.name || "").toLowerCase();
        // robust matching for different export naming conventions
        const isLeft =
          name.includes("left") ||
          name.endsWith("_l") ||
          name.endsWith("l_") ||
          (name.endsWith("l") && name.includes("arm"));
        const isRight =
          name.includes("right") ||
          name.endsWith("_r") ||
          name.endsWith("r_") ||
          (name.endsWith("r") && name.includes("arm"));

        if (
          name.includes("arm") ||
          name.includes("upperarm") ||
          name.includes("upper_arm") ||
          name.includes("upperarml") ||
          name.includes("upper_arml") ||
          name.includes("upper_arm_r") ||
          name.includes("upper_arm_l")
        ) {
          if (
            isLeft ||
            name.includes("leftarm") ||
            name.includes("left_arm") ||
            name.includes("upper_arml") ||
            name.includes("upperarm_l") ||
            name.includes("mixamorig:leftarm") ||
            name.includes("mixamorig_leftarm")
          ) {
            leftArm = child;
          }
          if (
            isRight ||
            name.includes("rightarm") ||
            name.includes("right_arm") ||
            name.includes("upper_armr") ||
            name.includes("upperarm_r") ||
            name.includes("mixamorig:rightarm") ||
            name.includes("mixamorig_rightarm")
          ) {
            rightArm = child;
          }
        }

        if (
          name.includes("forearm") ||
          name.includes("lowerarm") ||
          name.includes("fore_arm")
        ) {
          if (
            isLeft ||
            name.includes("leftforearm") ||
            name.includes("forearml") ||
            name.includes("_l")
          ) {
            leftForeArm = child;
          }
          if (
            isRight ||
            name.includes("rightforearm") ||
            name.includes("forearmr") ||
            name.includes("_r")
          ) {
            rightForeArm = child;
          }
        }

        if (name.includes("hand") || name.includes("wrist")) {
          if (
            isLeft ||
            name.includes("lefthand") ||
            name.includes("handl") ||
            name.includes("_l")
          ) {
            leftHand = child;
          }
          if (
            isRight ||
            name.includes("righthand") ||
            name.includes("handr") ||
            name.includes("_r")
          ) {
            rightHand = child;
          }
        }

        if (name.includes("thumb")) {
          child.quaternion.setFromEuler(new THREE.Euler(0, 0, 0, "XYZ"));
        }
      });

      // Enforce arm poses based on model layout
      const isDesktopModel = character.getObjectByName("Plane004") || character.getObjectByName("screenlight") || character.name.includes("SimpleFemaleCharacter");

      if (isDesktopModel) {
        if (leftArm)
          leftArm.quaternion.setFromEuler(
            new THREE.Euler(1.4, 0.3, -0.5, "XYZ"),
          );
        if (rightArm)
          rightArm.quaternion.setFromEuler(
            new THREE.Euler(1.4, -0.3, 0.5, "XYZ"),
          );
        if (leftForeArm)
          leftForeArm.quaternion.setFromEuler(
            new THREE.Euler(1.2, 0.0, 0.0, "XYZ"),
          );
        if (rightForeArm)
          rightForeArm.quaternion.setFromEuler(
            new THREE.Euler(1.2, 0.0, 0.0, "XYZ"),
          );
        if (leftHand)
          leftHand.quaternion.setFromEuler(
            new THREE.Euler(-0.3, 0.0, 0.0, "XYZ"),
          );
        if (rightHand)
          rightHand.quaternion.setFromEuler(
            new THREE.Euler(-0.3, 0.0, 0.0, "XYZ"),
          );
      } else {
        if (leftArm)
          leftArm.quaternion.setFromEuler(
            new THREE.Euler(0.0, 0.0, -1.45, "XYZ"),
          );
        if (rightArm)
          rightArm.quaternion.setFromEuler(
            new THREE.Euler(0.0, 0.0, 1.45, "XYZ"),
          );
        if (leftForeArm)
          leftForeArm.quaternion.setFromEuler(
            new THREE.Euler(0.3, 0.0, 0.0, "XYZ"),
          );
        if (rightForeArm)
          rightForeArm.quaternion.setFromEuler(
            new THREE.Euler(0.3, 0.0, 0.0, "XYZ"),
          );
        if (leftHand)
          leftHand.quaternion.setFromEuler(
            new THREE.Euler(-Math.PI / 2, 0.0, 0.0, "XYZ"),
          );
        if (rightHand)
          rightHand.quaternion.setFromEuler(
            new THREE.Euler(-Math.PI / 2, 0.0, 0.0, "XYZ"),
          );
      }

      character.traverse((child) => {
        if (
          child.isMesh &&
          child.morphTargetInfluences &&
          child.morphTargetDictionary
        ) {
          const dict = child.morphTargetDictionary;
          for (const key in dict) {
            if (key.toLowerCase().includes("smile")) {
              const idx = dict[key];
              child.morphTargetInfluences[idx] = 0.35;
            }
          }
        }
      });

      // Revert clothes/outfit styling changes to keep original textures
      const outfit = character.getObjectByName("avaturn_look_0");
      if (outfit) {
        outfit.visible = true;
      }

      // Restore other glass/spectacles meshes if they exist
      character.traverse((child) => {
        if (
          child.name &&
          (child.name.includes("glass") || child.name.includes("spectacle"))
        ) {
          child.visible = true;
          if (child.material) {
            child.material = child.material.clone();
            child.material.transparent = false;
            child.material.opacity = 1;
            child.material.color.setHex(0x111111);
            child.material.needsUpdate = true;
          }
        }
      });
      await renderer.compileAsync(character, camera, scene);
      character.traverse((child) => {
        if (child.isMesh) {
          const mesh = child;
          child.castShadow = true;
          child.receiveShadow = true;
          mesh.frustumCulled = true;
        }
      });

      setCharTimeline(character, camera);
      setAllTimeline();

      return gltf;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return { loadCharacter };
};

export default setCharacter;
