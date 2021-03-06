

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
   * Returns all the colliding entities with this one.
  */
  findCollisions: () => {
    const box = new THREE.Box3();

    return function findCollisions(entity, velocity) {
      const list = [];
      // Loop over all known boxes, check each one for collision with self.
      for (const [el, elBox] of this.entityBoxes) {
        if (el === entity) { continue; }
        if (tmpBox.intersectsBox(elBox)) {
          list.append(el);
        }
      }
      return list;
    };
  },

  /**
   * [intersect](https://threejs.org/docs/index.html#api/en/math/Box3.intersect)
   * Returns an array, [intersect, boxA, boxB]
  */
  getCollisionBoxes(entityA, entityB) {
    const { entityBoxes } = this;
    const boxA = entityBoxes.get(entityA);
    const boxB = entityBoxes.get(entityB);
    return [boxA, boxB];
  },
});
