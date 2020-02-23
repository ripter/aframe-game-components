import { KEY_MAP } from '../consts/key_map';

AFRAME.registerSystem('game', {
  schema: {
    indicator: { type: 'selector' },
  },

  init() {
    const { input } = this.sceneEl.systems;
    console.log('game.data', this.data);

    // Register custom keymap
    input.setKeyMap(KEY_MAP);

    this.activeEntity = null;
  },

  setActive(entity) {
    const { indicator } = this.data;

    this.activeEntity = entity;
    indicator.object3D.position.copy(entity.object3D.position);
  }
});
