import { KEY_MAP } from '../consts/key_map';

AFRAME.registerSystem('game', {
  init() {
    const { input } = this.sceneEl.systems;

    input.setKeyMap(KEY_MAP);
  },
});
