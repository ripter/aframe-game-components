
// import { KEY_MAP } from './key_map';

/**
 * Maps key presses to InputAction, allowsing components to repond to user input.
 *
*/
AFRAME.registerSystem('input', {
  /**
   * Init handler. Called during scene initialization and is only run once.
   * Systems can use this to set initial state.
   */
  init() {
    this.keyMap = {};
    this.keysDown = {};
    this.bindEvents();
  },

  setKeyMap(map) {
    this.keyMap = map;
  },

  /**
   * Returns true if the Key is currenly pressed.
  */
  isKeyDown(key) {
    return this.keysDown[key] || false;
  },

  /**
   * Called to start any dynamic behavior (e.g., animation, AI, events, physics).
   */
  bindEvents() {
    window.addEventListener('keydown', this);
    window.addEventListener('keyup', this);
  },

  /**
   * Called to stop any dynamic behavior (e.g., animation, AI, events, physics).
   */
  unBindEvents() {
    window.removeEventListener('keydown', this);
    window.removeEventListener('keyup', this);
  },

  /**
   * DOM Event handler.
   * Called when a listening event is observed.
   * @param  {Event} event the event that has been fired and needs to be processed.
   * @return {undefined}
   */
  handleEvent(event) {
    const keyCode = event.code;
    const mappedKey = this.keyMap[keyCode];

    // Ignore keys not in the mapping.
    if (!mappedKey) { return; }

    // Change the state of the mapped key based on the event type.
    switch (event.type) {
      case 'keydown':
        this.keysDown[mappedKey] = true;
        break;
      case 'keyup':
        this.keysDown[mappedKey] = false;
        break;
      default:
        console.warn(`Unhandled event type: ${event.type}`, event, this); // eslint-disable-line
    }
  },
});
