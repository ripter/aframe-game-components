
// Define all known keys.
export const Key = {
  Jump: 'Key.Jump',
  Forward: 'Key.Forward',
  Backward: 'Key.Backward',
};

/**
 * Map key codes to our custom keys
 */
export const KEY_MAP = {
  ArrowUp: Key.Jump,
  KeyW: Key.Jump,
  KeyD: Key.Forward,
  ArrowRight: Key.Forward,
  KeyA: Key.Backward,
  ArrowLeft: Key.Backward,
};
