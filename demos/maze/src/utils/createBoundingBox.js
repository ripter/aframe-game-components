
/**
 * Creates a Bounding box around the entity with offset.
*/
export function createBoundingBox(entity, offset) {
  const box = new THREE.Box3();
  // Set it around the object
  box.setFromObject(entity.object3D);
  // Apply offset to the box
  box.min.add(offset);
  box.max.sub(offset);

  return box;
}
