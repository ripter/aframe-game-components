/**
 * TODO: Documentation
 */
AFRAME.registerComponent('match-mesh', {
  schema: {
    target: { type: 'selector' },
    meshName: { type: 'string' },
  },

  /**
   * Init handler. Similar to attachedCallback.
   * Called during component initialization and is only run once.
   * Components can use this to set initial state.
   */
  init() {
    this.el.addEventListener('model-loaded', this);
  },

  /**
   * Update handler. Similar to attributeChangedCallback.
   * Called whenever component's data changes.
   * Also called on component initialization when the component receives initial data.
   *
   * @param {object} prevData - Previous attributes of the component.
   */
  update(prevData) {
    const { target, meshName } = this.data;
    if (!target || !meshName) { return; }
    const mesh = this.el.object3D.getObjectByName(meshName);
    if (!mesh) { return; }
    const targetMesh = target.getObject3D('mesh');
    if (!targetMesh) { return; }

    // Replace the target geometry with the the mesh's geometry
    targetMesh.geometry.copy(mesh.geometry);
    // Match the position & rotation
    targetMesh.position.copy(mesh.position);
    targetMesh.quaternion.copy(mesh.quaternion);
    targetMesh.scale.copy(mesh.scale);

    // Turn off the mesh we are copying.
    mesh.visible = false;
  },

  /**
   * DOM Event handler.
   * Called when a listening event is observed.
   * @param  {Event} event the event that has been fired and needs to be processed.
   * @return {undefined}
   */
  handleEvent(event) {
    this.update();
  },
});
