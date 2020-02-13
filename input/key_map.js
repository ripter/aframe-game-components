
// Define all known keys.
export const Key = {
  Forward: 'Key.Forward',
  Backward: 'Key.Backward',
  TurnLeft: 'Key.Turn.Left',
  TurnRight: 'Key.Turn.Right',
  PanLeft: 'Key.Camera.Pan.Left',
  PanRight: 'Key.Camera.Pan.Right',
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
  KeyQ: Key.PanLeft,
  KeyE: Key.PanRight,
};
