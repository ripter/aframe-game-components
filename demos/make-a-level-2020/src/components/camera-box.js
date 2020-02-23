
/**
 */
AFRAME.registerComponent('camera-box', {
  schema: {
    target: { type: 'selector' },
    offset: { type: 'vec3' },
  },

  /**
   * Init handler. Similar to attachedCallback.
   * Called during component initialization and is only run once.
   * Components can use this to set initial state.
   */
  init() {
    this.vec = new THREE.Vector3();
  },

  /**
   * Update handler. Similar to attributeChangedCallback.
   * Called whenever component's data changes.
   * Also called on component initialization when the component receives initial data.
   *
   * @param {object} prevData - Previous attributes of the component.
   */
  update(prevData) {
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
    const { target, offset } = this.data;
    if (!target || !target.object3D) { return; }

    target.object3D.getWorldPosition(this.vec);
    this.el.object3D.position.x = this.vec.x;
    this.el.object3D.position.y = this.vec.y - 1;
  },

  /**
   * Called to start any dynamic behavior (e.g., animation, AI, events, physics).
   */
  play() {
    // this.el.object3D.lookAt(target.object3D.position);
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
