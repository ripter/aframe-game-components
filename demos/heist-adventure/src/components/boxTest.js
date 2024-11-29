AFRAME.registerComponent('box-test', {
  schema: {
    size: { type: 'vec3', default: { x: 1, y: 1.8, z: 1 } },
  },

  /**
   * Init handler. Similar to attachedCallback.
   * Called during component initialization and is only run once.
   * Components can use this to set initial state.
   */
  init() {
    this.center = new THREE.Vector3();

    // Create our new Box3
    const box = new THREE.Box3();
    this.box = box;

    // Create a helper to help visualize the box.
    const helper = this.helper = new THREE.Box3Helper(box, 0xFF851B);
    this.el.sceneEl.object3D.add(helper);
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
    const { box } = this;

    // Update the Box to match position/size/rotation
    box.copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);

    // Update the size to match the schema, keeping the center.
    const { center } = this;
    const { size } = this.data;
    box.getCenter(center);
    box.setFromCenterAndSize(center, size);
  },
});
