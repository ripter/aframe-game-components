import { readKeysAsRocker } from '../utils/readKeysAsRocker';

/**
 * User Controls for the demo
 */
AFRAME.registerComponent('user-controls', {
  schema: {
    enabled: { default: true },
    speed: { default: 0.05 },
    clipWalk: { default: 'Walk' },
    clipIdle: { default: 'Idle' },
    keyForward: { default: 'Key.Forward' },
    keyBackward: { default: 'Key.Backward' },
    keyTurnLeft: { default: 'Key.Turn.Left' },
    keyTurnRight: { default: 'Key.Turn.Right' },
  },

  /**
   * Init handler. Similar to attachedCallback.
   * Called during component initialization and is only run once.
   * Components can use this to set initial state.
   */
  init() {
    const { collision, input } = this.el.sceneEl.systems;
    const animMixer = this.el.components['anim-mixer'];

    // Bind methods from systems to make it easy to call them.
    this.isKeyDown = input.isKeyDown.bind(input);
    this.playAnimation = animMixer.playAction.bind(animMixer);
    this.willCollide = collision.willCollide.bind(collision);
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
    if (!this.data.enabled) { return; } // bail if not enabled
    const { el } = this;
    const { velocity, rotation } = this.readUserInput();

    // Check collisins with other moving mobs
    this.updateVelocityFromCollisions(velocity);
    // use velocity to pick the animation.
    this.updateAnimation(velocity);

    // Match rotation
    el.object3D.rotateY(rotation.y);
    // use translate to move the object along it's local axis
    el.object3D.translateX(velocity.x);
    el.object3D.translateZ(velocity.z);
  },


  /**
   * Reads isKeyDown to create velocity and rotation values.
  */
  readUserInput: (() => {
    const rotation = new THREE.Euler();
    const velocity = new THREE.Vector3();

    return function readUserInput() {
      const { isKeyDown } = this;
      const { speed, keyForward, keyBackward, keyTurnLeft, keyTurnRight } = this.data;

      // Reset the velocity back to 0
      velocity.set(0, 0, 0);

      // Create a rocker style switch with two Keys.
      velocity.z = readKeysAsRocker(isKeyDown, keyForward, keyBackward) * speed;
      rotation.y = readKeysAsRocker(isKeyDown, keyTurnLeft, keyTurnRight) * speed;

      return {
        velocity,
        rotation,
      };
    };
  })(),

  /**
   * Update the animation based on velocity.
  */
  updateAnimation(velocity) {
    const { playAnimation } = this;
    const { clipWalk, clipIdle } = this.data;

    if (velocity.x === 0 && velocity.z === 0) {
      playAnimation(clipIdle);
    } else {
      playAnimation(clipWalk);
    }
  },

  /**
   * Updates the velocity refrence if there are collisins.
  */
  updateVelocityFromCollisions(velocity) {
    const { el, willCollide } = this;
    const collidedEl = willCollide(el, velocity);

    if (collidedEl !== null) {
      if (velocity.z > 0) {
        velocity.z = 0;
      }
    }

    return velocity;
  },
});
