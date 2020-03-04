import { ERROR_NO_MESH } from '../consts/error';

/**
 * Returns the min, max Bounding Box of the Mesh geometry.
 * Returns a [Box3](https://threejs.org/docs/index.html#api/en/math/Box3)
 * @helper
*/
export function getBoundingBoxFromMesh(entity) {
  const mesh = entity.getObject3D('mesh');
  if (!mesh) { throw ERROR_NO_MESH(mesh); }
  const box = new THREE.Box3();
  box.copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);
  return box;
}
