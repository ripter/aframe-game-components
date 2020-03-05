
// Define all known keys.
export const Key = {
  Jump: 'Key.Jump',
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
  // Player movement
  ArrowUp: Key.Forward,
  KeyW: Key.Forward,
  ArrowDown: Key.Backward,
  KeyS: Key.Backward,
  KeyD: Key.TurnRight,
  ArrowRight: Key.TurnRight,
  KeyA: Key.TurnLeft,
  ArrowLeft: Key.TurnLeft,
  Space: Key.Jump,
  // Camera movement
  KeyQ: Key.PanRight,
  KeyE: Key.PanLeft,
};
