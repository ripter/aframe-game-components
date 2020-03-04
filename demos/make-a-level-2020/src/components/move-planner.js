/**
 * TODO: Documentation
 */
AFRAME.registerComponent('move-planner', {
  schema: {
    // clipName: { default: 'Idle' },
  },

  /**
   * Init handler. Similar to attachedCallback.
   * Called during component initialization and is only run once.
   * Components can use this to set initial state.
   */
  init() {
    const POOL_COUNT = 6;

    // Create a pool boxes to use as clickable UI
    this.poolBoxes = Array(POOL_COUNT).fill().map(() => {
      // Create entities instead of Meshes so we can add them to the raycaster.
      // The raycaster is looking for entities with .clickable on them.
      const entity = document.createElement('a-entity');
      entity.setAttribute('geometry', 'primitive: octahedron; radius: 0.25');
      entity.setAttribute('material', 'color: #FFDC00;');
      entity.classList.add('clickable');
      this.el.appendChild(entity);
      return entity;
    });

    // Position the icons in a circle around the center.
    

    // Position the boxes in a line
    this.poolBoxes.forEach((entity, i) => {
      entity.object3D.position.x += -2 + (1 * (i * 1));
    });
  },



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


  activate(position) {
    this.el.object3D.visible = true;
    this.el.object3D.position.copy(position);
  },

  deactivate() {
    this.el.object3D.visible = false;
  },


  handleClick: (() => {
    const vec3 = new THREE.Vector3();

    return function handleClick(iconEntity) {
      const { game } = this.el.sceneEl.systems;

      // The icon position is local, so it's also the offset we need.
      vec3.copy(iconEntity.object3D.position);

      // Submit the new position.
      game.submitMove(vec3);
    };
  })(),

  /**
   * DOM Event handler.
   * Called when a listening event is observed.
   * @param  {Event} event the event that has been fired and needs to be processed.
   * @return {undefined}
   */
  handleEvent(event) {
    switch (event.type) {
      case 'click':
        return this.handleClick(event.target);
      default:
        console.warn(`Unhandled event type: ${event.type}`, event); // eslint-disable-line
    }

    return false;
  },
});