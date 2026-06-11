import * as THREE from "three";
import { eyebrowBoneNames } from "../../../data/boneData";

const setAnimations = (gltf) => {
  const character = gltf.scene;
  const mixer = new THREE.AnimationMixer(character);
  const hasAnimations =
    Array.isArray(gltf.animations) && gltf.animations.length > 0;

  if (hasAnimations) {
    const introClip = THREE.AnimationClip.findByName(
      gltf.animations,
      "introAnimation",
    );
    if (introClip) {
      const introAction = mixer.clipAction(introClip);
      introAction.setLoop(THREE.LoopOnce, 1);
      introAction.clampWhenFinished = true;
      introAction.play();
    }

    const clipNames = ["key1", "key2", "key5", "key6"];
    clipNames.forEach((name) => {
      const clip = THREE.AnimationClip.findByName(gltf.animations, name);
      if (clip) {
        const action = mixer.clipAction(clip);
        action.play();
        action.timeScale = 1.2;
      }
    });

    // Typing animation disabled to preserve custom hand-near-waist pose
    /*
    const typingAction = createBoneAction(
      gltf,
      mixer,
      "typing",
      typingBoneNames
    );
    if (typingAction) {
      typingAction.enabled = true;
      typingAction.play();
      typingAction.timeScale = 1.2;
    }
    */
  }

  function startIntro() {
    if (!hasAnimations) {
      return;
    }
    const introClip = THREE.AnimationClip.findByName(
      gltf.animations,
      "introAnimation",
    );
    if (!introClip) {
      return;
    }
    const introAction = mixer.clipAction(introClip);
    introAction.clampWhenFinished = true;
    introAction.reset().play();

    setTimeout(() => {
      const blink = THREE.AnimationClip.findByName(gltf.animations, "Blink");
      if (blink) {
        mixer.clipAction(blink).play().fadeIn(0.5);
      }
    }, 2500);
  }

  function hover(gltf, hoverDiv) {
    let eyeBrowUpAction = null;
    if (hasAnimations) {
      eyeBrowUpAction = createBoneAction(
        gltf,
        mixer,
        "browup",
        eyebrowBoneNames,
      );
      if (eyeBrowUpAction) {
        eyeBrowUpAction.setLoop(THREE.LoopOnce, 1);
        eyeBrowUpAction.clampWhenFinished = true;
        eyeBrowUpAction.enabled = true;
      }
    }

    let isHovering = false;
    const onHoverFace = () => {
      if (eyeBrowUpAction && !isHovering) {
        isHovering = true;
        eyeBrowUpAction.reset();
        eyeBrowUpAction.enabled = true;
        eyeBrowUpAction.setEffectiveWeight(4);
        eyeBrowUpAction.fadeIn(0.5).play();
      }
    };
    const onLeaveFace = () => {
      if (eyeBrowUpAction && isHovering) {
        isHovering = false;
        eyeBrowUpAction.fadeOut(0.6);
      }
    };
    if (!hoverDiv) return () => {};
    hoverDiv.addEventListener("mouseenter", onHoverFace);
    hoverDiv.addEventListener("mouseleave", onLeaveFace);
    return () => {
      hoverDiv.removeEventListener("mouseenter", onHoverFace);
      hoverDiv.removeEventListener("mouseleave", onLeaveFace);
    };
  }

  return { mixer, startIntro, hover };
};

const createBoneAction = (gltf, mixer, clip, boneNames) => {
  if (!gltf.animations) {
    return null;
  }
  const animationClip = THREE.AnimationClip.findByName(gltf.animations, clip);
  if (!animationClip) {
    return null;
  }

  const filteredClip = filterAnimationTracks(animationClip, boneNames);
  if (!filteredClip.tracks.length) {
    return null;
  }

  return mixer.clipAction(filteredClip);
};

const filterAnimationTracks = (clip, boneNames) => {
  const filteredTracks = clip.tracks.filter((track) =>
    boneNames.some((boneName) => track.name.includes(boneName)),
  );

  return new THREE.AnimationClip(
    clip.name + "_filtered",
    clip.duration,
    filteredTracks,
  );
};

export default setAnimations;
