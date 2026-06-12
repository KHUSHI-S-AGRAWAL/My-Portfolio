import { NodeIO } from '@gltf-transform/core';
const io = new NodeIO();
const doc = await io.read('./public/models/character.glb');
const root = doc.getRoot();
console.log('--- MESHES ---');
for (const mesh of root.listMeshes()) {
  console.log(mesh.getName());
}
console.log('--- NODES WITH MESHES ---');
for (const node of root.listNodes()) {
  if (node.getMesh()) {
    console.log(node.getName(), 'uses mesh:', node.getMesh().getName());
  }
}

