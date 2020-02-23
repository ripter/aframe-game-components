import { KEY_MAP } from '../consts/key_map';

AFRAME.registerSystem('game', {
  schema: {
    indicator: { type: 'selector' },
  },

  init() {
    const { input } = this.sceneEl.systems;

    // Register custom keymap
    input.setKeyMap(KEY_MAP);

    this.activeEntity = null;
  },

  setActive(entity) {
    const planner = this.data.indicator.components['move-planner'];

    this.activeEntity = entity;
    planner.activate(this.activeEntity.object3D.position);
  },

  // Submit the move action for the activeEntity
  submitMove(offset) {
    const planner = this.data.indicator.components['move-planner'];
    const { position } = this.activeEntity.object3D;

    // Turn off the indicator
    planner.deactivate();

    // Simple moving with animation.
    AFRAME.ANIME({
      targets: position,
      x: `+=${offset.x}`,
      duration: 250,
      easing: 'easeOutCubic',
      // complete: () => {
      //   console.log('animation done');
      // },
    });
  },
});
