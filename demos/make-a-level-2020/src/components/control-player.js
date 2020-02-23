import { Key } from '../consts/key_map';
import { setVelocityFromPlayerInput } from '../utils/setVelocityFromPlayerInput';
/**
 * Stupid Simple Gravity using the AABB collision system.
 */
AFRAME.registerComponent('control-player', {
  schema: {
    // clipName: { default: 'Idle' },
  },

  /**
   * Init handler. Similar to attachedCallback.
   * Called during component initialization and is only run once.
   * Components can use this to set initial state.
   */
  init() {
    const { collision, input } = this.el.sceneEl.systems;
    console.log('gravity init', this.el);

    this.willCollide = collision.willCollide.bind(collision);
    this.isKeyDown = input.isKeyDown.bind(input);

    this.gravity = new THREE.Vector3(0, -0.1, 0);
    this.jump = new THREE.Vector3(0, 1, 0);

    this.velocity = new THREE.Vector3(0, 0, 0);
    this.isJumping = false;
    this.canJump = true;
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
    const { el, gravity, isKeyDown, willCollide, velocity } = this;
    const collidedEl = willCollide(el, gravity);
    const z = el.object3D.position.z;

    setVelocityFromPlayerInput(isKeyDown, velocity);

    if (isKeyDown(Key.Jump)) {
      if (this.canJump) {
        this.canJump = false;
        return AFRAME.ANIME({
          targets: this.el.object3D.position,
          y: '+=1',
          duration: 250,
          easing: 'easeOutCubic',
        });
      }
    }

    if (isKeyDown(Key.Forward)) {
      el.object3D.translateX(0.2);
    }
    else if(isKeyDown(Key.Backward)) {
      el.object3D.translateX(-0.2);
    }

    if (!collidedEl) {
      el.object3D.translateY(gravity.y);
    }
    else {
      this.canJump = true;
    }
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
