
export const Key = {
  Forward: 'key_forward',
  Backward: 'key_backward',
  TurnLeft: 'key_turn_left',
  TurnRight: 'key_turn_right',
};

/**
 * Map key codes to our custom keys
 */
export const KEY_MAP = {
  ArrowUp: Key.Forward,
  KeyW: Key.Forward,
  ArrowDown: Key.Backward,
  KeyS: Key.Backward,
  ArrowLeft: Key.TurnLeft,
  KeyA: Key.TurnLeft,
  ArrowRight: Key.TurnRight,
  KeyD: Key.TurnRight,
};
