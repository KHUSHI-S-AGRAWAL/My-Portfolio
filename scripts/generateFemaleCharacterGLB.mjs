import * as THREE from 'three';
import { Document, NodeIO, Accessor } from '@gltf-transform/core';

const bufferAttributeToAccessor = (doc, buffer, attribute) => {
  let type = Accessor.Type.SCALAR;
  if (attribute.itemSize === 2) type = Accessor.Type.VEC2;
  else if (attribute.itemSize === 3) type = Accessor.Type.VEC3;

  return doc
    .createAccessor()
    .setType(type)
    .setArray(attribute.array)
    .setBuffer(buffer);
};

const createPrimitive = (doc, buffer, geometry, material) => {
  geometry.computeVertexNormals();

  const primitive = doc.createPrimitive()
    .setAttribute('POSITION', bufferAttributeToAccessor(doc, buffer, geometry.getAttribute('position')))
    .setAttribute('NORMAL', bufferAttributeToAccessor(doc, buffer, geometry.getAttribute('normal')))
    .setMaterial(material);

  if (geometry.getAttribute('uv')) {
    primitive.setAttribute('TEXCOORD_0', bufferAttributeToAccessor(doc, buffer, geometry.getAttribute('uv')));
  }

  if (geometry.index) {
    primitive.setIndices(bufferAttributeToAccessor(doc, buffer, geometry.index));
  }

  return primitive;
};

const createMaterial = (doc, name, color) =>
  doc
    .createMaterial(name)
    .setBaseColorFactor([color.r, color.g, color.b, 1])
    .setRoughnessFactor(0.8)
    .setMetallicFactor(0.05);

const createNodeFromGeometry = (doc, buffer, geometry, material, name) => {
  const mesh = doc.createMesh(name).addPrimitive(createPrimitive(doc, buffer, geometry, material));
  return doc.createNode(name).setMesh(mesh);
};

const main = async () => {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene('Scene');
  const rootNode = doc.createNode('FemaleCharacter');

  scene.addChild(rootNode);
  doc.getRoot().addScene(scene);

  const skinMat = createMaterial(doc, 'skin', new THREE.Color('#f6d0b2'));
  const dressMat = createMaterial(doc, 'dress', new THREE.Color('#8c2f71'));
  const hairMat = createMaterial(doc, 'hair', new THREE.Color('#3b1f50'));
  const eyeMat = createMaterial(doc, 'eye', new THREE.Color('#000000'));

  const torsoGeo = new THREE.CylinderGeometry(1.1, 1.05, 3.2, 24);
  torsoGeo.translate(0, 1.35, 0);
  rootNode.addChild(createNodeFromGeometry(doc, buffer, torsoGeo, dressMat, 'torso'));

  const headGeo = new THREE.SphereGeometry(0.78, 32, 32);
  headGeo.translate(0, 4.05, 0);
  rootNode.addChild(createNodeFromGeometry(doc, buffer, headGeo, skinMat, 'head'));

  const hairGeo = new THREE.SphereGeometry(0.9, 32, 32);
  hairGeo.translate(0, 4.16, -0.1);
  hairGeo.scale(1.07, 0.95, 1.07);
  rootNode.addChild(createNodeFromGeometry(doc, buffer, hairGeo, hairMat, 'hair'));

  const leftArmGeo = new THREE.CylinderGeometry(0.22, 0.22, 2.2, 16);
  leftArmGeo.translate(-1.25, 2.3, 0);
  leftArmGeo.rotateZ(Math.PI / 2.9);
  rootNode.addChild(createNodeFromGeometry(doc, buffer, leftArmGeo, skinMat, 'leftArm'));

  const rightArmGeo = new THREE.CylinderGeometry(0.22, 0.22, 2.2, 16);
  rightArmGeo.translate(1.25, 2.3, 0);
  rightArmGeo.rotateZ(-Math.PI / 2.9);
  rootNode.addChild(createNodeFromGeometry(doc, buffer, rightArmGeo, skinMat, 'rightArm'));

  const leftLegGeo = new THREE.CylinderGeometry(0.26, 0.26, 2.4, 16);
  leftLegGeo.translate(-0.4, -1.1, 0);
  rootNode.addChild(createNodeFromGeometry(doc, buffer, leftLegGeo, skinMat, 'leftLeg'));

  const rightLegGeo = new THREE.CylinderGeometry(0.26, 0.26, 2.4, 16);
  rightLegGeo.translate(0.4, -1.1, 0);
  rootNode.addChild(createNodeFromGeometry(doc, buffer, rightLegGeo, skinMat, 'rightLeg'));

  const skirtGeo = new THREE.ConeGeometry(1.38, 1.8, 24);
  skirtGeo.translate(0, 0.3, 0);
  skirtGeo.rotateX(Math.PI);
  rootNode.addChild(createNodeFromGeometry(doc, buffer, skirtGeo, dressMat, 'skirt'));

  const leftEyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
  leftEyeGeo.translate(-0.2, 4.2, 0.72);
  rootNode.addChild(createNodeFromGeometry(doc, buffer, leftEyeGeo, eyeMat, 'leftEye'));

  const rightEyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
  rightEyeGeo.translate(0.2, 4.2, 0.72);
  rootNode.addChild(createNodeFromGeometry(doc, buffer, rightEyeGeo, eyeMat, 'rightEye'));

  const leftBreastGeo = new THREE.SphereGeometry(0.32, 16, 16);
  leftBreastGeo.translate(-0.45, 2.8, 0.95);
  rootNode.addChild(createNodeFromGeometry(doc, buffer, leftBreastGeo, skinMat, 'leftBreast'));

  const rightBreastGeo = new THREE.SphereGeometry(0.32, 16, 16);
  rightBreastGeo.translate(0.45, 2.8, 0.95);
  rootNode.addChild(createNodeFromGeometry(doc, buffer, rightBreastGeo, skinMat, 'rightBreast'));

  const screenLightGeo = new THREE.BoxGeometry(0.6, 0.3, 0.12);
  screenLightGeo.translate(0, 2.75, -1.1);
  rootNode.addChild(createNodeFromGeometry(doc, buffer, screenLightGeo, skinMat, 'screenlight'));

  const planeGeo = new THREE.PlaneGeometry(0.9, 0.6);
  planeGeo.translate(0, 2.8, -1.2);
  rootNode.addChild(createNodeFromGeometry(doc, buffer, planeGeo, skinMat, 'Plane004'));

  const leftFootGeo = new THREE.BoxGeometry(0.4, 0.2, 0.8);
  leftFootGeo.translate(-0.4, -2.3, 0.15);
  rootNode.addChild(createNodeFromGeometry(doc, buffer, leftFootGeo, skinMat, 'footL'));

  const rightFootGeo = new THREE.BoxGeometry(0.4, 0.2, 0.8);
  rightFootGeo.translate(0.4, -2.3, 0.15);
  rootNode.addChild(createNodeFromGeometry(doc, buffer, rightFootGeo, skinMat, 'footR'));

  const io = new NodeIO();
  const outPath = new URL('../public/models/character.glb', import.meta.url);
  io.writeBinary(outPath, doc);
  console.log('Exported character.glb to', outPath.href);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
