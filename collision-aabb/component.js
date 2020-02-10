/**
 * Adds the Mesh to collision detection on object3dset event.
*/
AFRAME.registerComponent('collision', {
  schema: {
    size: { type: 'vec3', default: { x: 1, y: 1, z: 1 } },
    offset: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
  },

  /**
   * Init handler. Similar to attachedCallback.
   * Called during component initialization and is only run once.
   * Components can use this to set initial state.
  */
  init() {
    this.box = new THREE.Box3();
    this.center = new THREE.Vector3();
    this.matrix = new THREE.Matrix4();

    // Register our box in the collision system.
    this.system.add(this.el, this.box);
  },

  /**
   * Tick handler.
   * Called on each tick of the scene render loop.
   * Affected by play and pause.
   *
   * @param {number} time - Scene tick time.
   * @param {number} timeDelta - Difference in current render time and previous render time.
   */
  tick() {
    const mesh = this.el.getObject3D('mesh');
    if (!mesh) { return; }
    const { size, offset } = this.data;
    const { box, center, matrix } = this;

    // Use the geometry's bounding box, creating it if needed.
    if (!mesh.geometry.boundingBox) {
      mesh.geometry.computeBoundingBox();
    }

    // Copy the geometry's boundingBox so we can find the entity's center in world space.
    box.copy(mesh.geometry.boundingBox);
    // Our custom size/position for the collision box.
    box.getCenter(center);
    box.setFromCenterAndSize(center, size);
    box.translate(offset);

    // Lastly, Apply the position/rotation to match the Mesh.
    matrix.extractRotation(mesh.matrixWorld);
    matrix.copyPosition(mesh.matrixWorld);
    box.applyMatrix4(matrix);
  },

  /**
   * Remove handler. Similar to detachedCallback.
   * Called whenever component is removed from the entity (i.e., removeAttribute).
   * Components can use this to reset behavior on the entity.
   */
  remove() {
    const { el, system } = this;
    // remove from collisions
    system.removeEntity(el);
  },
});
