/**
 * Clicking on the entity will move the named component to this one.
 */
AFRAME.registerComponent('click-to-select', {
  /**
   * Called to start any dynamic behavior (e.g., animation, AI, events, physics).
   */
  play() {
    this.el.addEventListener('click', this);
  },

  /**
   * Called to stop any dynamic behavior (e.g., animation, AI, events, physics).
   */
  pause() {
    this.el.removeEventListener('click', this);
  },

  /**
   * DOM Event handler.
   * Called when a listening event is observed.
   * @param  {Event} event the event that has been fired and needs to be processed.
   * @return {undefined}
   */
  handleEvent(event) {
    switch (event.type) {
      case 'click':
        // this.system.select(this.el);
        console.log('CLICKED ME');
        break;
      default:
        console.warn(`Unhandled event type: ${event.type}`, event, this); // eslint-disable-line
    }
  },
});
