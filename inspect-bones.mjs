import { NodeIO } from '@gltf-transform/core';
const io = new NodeIO();
const doc = await io.read('./public/models/character.glb');
const root = doc.getRoot();
const names = ['LeftArm','RightArm','LeftForeArm','RightForeArm','LeftHand','RightHand','Hips','Spine','Spine1','Spine2','Head'];
for (const name of names) {
  const node = root.listNodes().find((n) => n.getName() === name);
  if (!node) {
    console.log(`${name}: not found`);
    continue;
  }
  const t = node.getTranslation();
  const r = node.getRotation();
  const s = node.getScale();
  console.log(name, 'translation=', t, 'rotation=', r, 'scale=', s);
}
