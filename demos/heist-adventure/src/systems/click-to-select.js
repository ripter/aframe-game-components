import { getBoundingBoxFromMesh } from '../utils/getBoundingBoxFromMesh';
/**
 * Click-to-Select allows toggling of the 'selected' entity.
 */
AFRAME.registerSystem('click-to-select', {
  schema: {
    elmIndicator: { type: 'selector' },
    offsetY: { default: 0.5 },
    componentName: { type: 'string' },
    propertyName: { default: 'enabled' },
  },
  /**
   * Init handler. Called during scene initialization and is only run once.
   * Systems can use this to set initial state.
   */
  init() {
    this.selected = null;
  },

  /**
   * Sets user-controls on the entity and removes it from the previous entity.
   */
  select(entity) {
    const { selected } = this;
    const {
      elmIndicator, offsetY, componentName, propertyName,
    } = this.data;

    // Toggle the user-controls on only the selected entity
    if (selected) {
      selected.setAttribute(componentName, propertyName, false);
    }
    entity.setAttribute(componentName, propertyName, true);

    // Move the indicator as a child of entity.
    entity.object3D.add(elmIndicator.object3D);
    // Position it above the new entity
    const box = getBoundingBoxFromMesh(entity).max;
    elmIndicator.object3D.position.y = box.y + offsetY;

    // Set the entity as the new selected and return it
    this.selected = entity;
    return entity;
  },
});
