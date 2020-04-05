/**
 * TODO: Documentation
 */
AFRAME.registerComponent('match-mesh', {
  schema: {
    src: { type: 'selector' },
    name: { type: 'string' },
  },

  /**
   * Init handler. Similar to attachedCallback.
   * Called during component initialization and is only run once.
   * Components can use this to set initial state.
   */
  init() {
    // Listen for add/remove of key objects mesh and armature
    // this.el.addEventListener('object3dset', this);
  },

  /**
   * Update handler. Similar to attributeChangedCallback.
   * Called whenever component's data changes.
   * Also called on component initialization when the component receives initial data.
   *
   * @param {object} prevData - Previous attributes of the component.
   */
  update(prevData) {
    const { src, name } = this.data;

    if (src) {
      // does it have a mesh yet?
      const scene = src.getObject3D('mesh');
      if (scene) {
        this.updateToMesh();
      }
      else {
        src.addEventListener('object3dset', () => this.updateToMesh());
      }
    }
    // console.group('update');
    // console.log('data', this.data);
    // console.log('prevData', prevData);
    // console.log('src', src);
    // console.log('mesh', mesh);
    // console.groupEnd();


  },

  /**
   * Tick handler.
   * Called on each tick of the scene render loop.
   * Affected by play and pause.
   *
   * @param {number} time - Scene tick time.
   * @param {number} timeDelta - Difference in current render time and previous render time.
   */
  tick(time, timeDelta) {
  },

  /**
   * Called to start any dynamic behavior (e.g., animation, AI, events, physics).
   */
  play() {
  },

  /**
   * Called to stop any dynamic behavior (e.g., animation, AI, events, physics).
   */
  pause() {
  },


  /**
   * Remove handler. Similar to detachedCallback.
   * Called whenever component is removed from the entity (i.e., removeAttribute).
   * Components can use this to reset behavior on the entity.
   */
  remove() {
  },

  /**
   * DOM Event handler.
   * Called when a listening event is observed.
   * @param  {Event} event the event that has been fired and needs to be processed.
   * @return {undefined}
   */
  handleEvent(event) {
    switch (event.type) {
      case 'model-loaded':
        console.log('event', event);
        this.updateToMesh();
        break;
      default:
        console.warn(`Unhandled event type: ${event.type}`, event); // eslint-disable-line
    }
  },


  updateToMesh() {
    const { src, name } = this.data;
    if (!src || !name) { return; }
    const scene = src.getObject3D('mesh');
    if (!scene) { return; }
    const mesh = scene.getObjectByName(name);
    const pos = new THREE.Vector3();

    mesh.getWorldPosition(pos);
    pos.y += 0.5;
    mesh.position.copy(pos);
    // this.el.object3D.position.copy(pos);
    // pos.copy(mesh.position);
    this.el.object3D.applyMatrix(mesh.matrixWorld);

    console.group('updateToMesh');
    console.log('src', src);
    console.log('mesh', mesh);
    console.log('pos', pos);
    console.groupEnd();


    // this.el.object3D.position.copy(mesh.position);
    // mesh.getWorldPosition(this.el.object3D.position);
    // mesh.matrixWorld.copy(this.el.object3D.matrixWorld);
    // debugger;
    // this.el.object3D.applyMatrix(mesh.matrixWorld);
  },
});
