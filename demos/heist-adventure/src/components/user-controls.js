import { readKeysAsRocker } from '../../../../utils/readKeysAsRocker';

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
    this.getCollision = collision.getCollisionBoxes.bind(collision);
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
    if (!this.el.getObject3D('mesh') || !this.el.getObject3D('armature')) { return; }

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
      const {
        speed, keyForward, keyBackward, keyTurnLeft, keyTurnRight,
      } = this.data;

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
    const { el, willCollide, getCollision } = this;
    const collidedEl = willCollide(el, velocity);
    if (!collidedEl) { return velocity; }
    const [boxA, boxB] = getCollision(el, collidedEl);

    // Skip if we are not trying to move
    if (velocity.x === 0 && velocity.y === 0 && velocity.z === 0) {
      return velocity;
    }

    // Convert the local velocity into world velocity.
    const velocityWorld = new THREE.Vector3();
    velocityWorld.copy(velocity);
    velocityWorld.applyQuaternion(el.object3D.quaternion);
    // use the world velocity to figure out which world direction we are moving
    const isMovingEast = velocityWorld.x > 0;
    const isMovingWest = velocityWorld.x < 0;
    const isMovingNorth = velocityWorld.z < 0;
    const isMovingSouth = velocityWorld.z > 0;

    // Figure out which direction the collision is on.
    const isCollisionSouth = boxA.min.z < boxB.min.z;
    const isCollisionNorth = boxA.max.z > boxB.max.z;
    const isCollisionEast = boxA.min.x < boxB.min.x;
    const isCollisionWest = boxA.max.x > boxB.max.x;

    // Don't allow moving into the collision.
    // TODO: Only kill the axis that would collide. Player should be able to 'slide' along a wall.
    if (isMovingNorth && isCollisionNorth) {
      velocity.z = 0;
    } else if (isMovingSouth && isCollisionSouth) {
      velocity.z = 0;
    }

    if (isMovingEast && isCollisionEast) {
      velocity.z = 0;
    } else if (isMovingWest && isCollisionWest) {
      velocity.z = 0;
    }

    return velocity;
  },
});
