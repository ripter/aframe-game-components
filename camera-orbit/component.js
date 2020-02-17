
/**
 * Camera: Orbit
 * Basic Orbiting Camera.
 * Follows target, user can use Key.PanLeft and Key.PanRight to pan the camera.
 */
AFRAME.registerComponent('camera-orbit', {
  schema: {
    target: { type: 'selector' },
    offset: { type: 'vec3' },
    keyPanLeft: { default: 'Key.Camera.Pan.Left' },
    keyPanRight: { default: 'Key.Camera.Pan.Right' },
  },

  /**
   * Init handler. Similar to attachedCallback.
   * Called during component initialization and is only run once.
   * Components can use this to set initial state.
   */
  init() {
    const { input } = this.el.sceneEl.systems;

    this.tmpMatrix = new THREE.Matrix4();
    this.tmpVector = new THREE.Vector3();
    this.thetaDeg = 0;

    // Bind methods from systems to make it easy to call them.
    this.isKeyDown = input.isKeyDown.bind(input);
  },

  /**
   * Update handler. Similar to attributeChangedCallback.
   * Called whenever component's data changes.
   * Also called on component initialization when the component receives initial data.
   *
   * @param {object} prevData - Previous attributes of the component.
   */
  update(prevData) {
    // console.group('camera-orbit.update');
    // console.log('prevData', prevData);
    // console.log('data', this.data);
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
    const { tmpMatrix, tmpVector, isKeyDown } = this;
    const { target, offset, keyPanLeft, keyPanRight } = this.data;
    if (!target || !target.object3D) { return; }

    if (isKeyDown(keyPanLeft)) {
      // Rotate the position and the rotation, so the camera continues to face the same direction.
      this.thetaDeg += 1;
      this.el.object3D.rotation.y += THREE.Math.degToRad(1);
    }
    else if (isKeyDown(keyPanRight)) {
      // Rotate the position and the rotation, so the camera continues to face the same direction.
      this.thetaDeg -= 1;
      this.el.object3D.rotation.y -= THREE.Math.degToRad(1);
    }

    // Start by centering on the target.
    this.el.object3D.position.copy(target.object3D.position);

    tmpVector.setFromCylindricalCoords(4, THREE.Math.degToRad(this.thetaDeg), 3);

    this.el.object3D.position.add(tmpVector);
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
      default:
        console.warn(`Unhandled event type: ${event.type}`, event); // eslint-disable-line
    }
  },
});
