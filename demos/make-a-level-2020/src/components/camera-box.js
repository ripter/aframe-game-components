
/**
 */
AFRAME.registerComponent('camera-box', {
  schema: {
    target: { type: 'selector' },
  },

  /**
   * Tick handler.
   * Called on each tick of the scene render loop.
   * Affected by play and pause.
   *
   * @param {number} time - Scene tick time.
   * @param {number} timeDelta - Difference in current render time and previous render time.
   */
  tick: (() => {
    const worldPosition = new THREE.Vector3();

    return function tick(time, timeDelta) {
      const { isKeyDown } = this;
      const { target } = this.data;
      if (!target || !target.object3D) { return; }

      target.object3D.getWorldPosition(worldPosition);
      this.el.object3D.position.x = worldPosition.x;
      this.el.object3D.position.y = worldPosition.y - 1;
    }
  })(),

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
