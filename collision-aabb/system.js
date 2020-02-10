

/*
 * Basic AABB collision detection.
*/
AFRAME.registerSystem('collision', {
  schema: {
    renderBox: { default: false },
  },

  /**
   * Init handler. Called during scene initialization and is only run once.
   * Systems can use this to set initial state.
   */
  init() {
    this.entityBoxes = new Map();
    this.tmpBox = new THREE.Box3();
  },

  /**
   * Adds the entity to collision checks.
  */
  add(entity, box) {
    const { renderBox } = this.data;

    this.entityBoxes.set(entity, box);

    if (renderBox) {
      const helper = new THREE.Box3Helper(box, 0xffff00);
      entity.sceneEl.object3D.add(helper);
    }
  },

  /**
   * Removes the entity from collision checkes.
  */
  remove(entity) {
    this.entityBoxes.delete(entity);
  },

  /**
   * Return the colliding entity if there is a collision.
   * else returns null if there is no collision.
  */
  willCollide(entity, velocity) {
    const { tmpBox } = this;
    const entityBox = this.entityBoxes.get(entity);

    // Re-use the temp Box variable so we don't move the real one.
    tmpBox.copy(entityBox);
    tmpBox.translate(velocity);

    // Check if our tempBox collides with anything.
    for (const [el, elBox] of this.entityBoxes) {
      if (el === entity) { continue; }
      if (tmpBox.intersectsBox(elBox)) {
        return el;
      }
    }
    // No Collisions found.
    return null;
  },

  /**
   * returns the [intersect](https://threejs.org/docs/index.html#api/en/math/Box3.intersect) of the two entity's colliding boxes.
  */
  intersection(entityA, entityB) {
    const { entityBoxes } = this;
    const boxA = entityBoxes.get(entityA);
    const boxB = entityBoxes.get(entityB);
    return boxA.intersect(boxB);
  },
});
