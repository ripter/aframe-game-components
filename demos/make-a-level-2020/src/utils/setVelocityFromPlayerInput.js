import { Key } from '../consts/key_map';
import { readKeysAsRocker } from '../../../../utils/readKeysAsRocker';




/**
 * Sets velocity to match the player's inputed velocity
*/
export function setVelocityFromPlayerInput(isKeyDown, velocity) {
  // Reset the velocity back to 0
  velocity.set(0, 0, 0);

  velocity.x = readKeysAsRocker(isKeyDown, Key.Forward, Key.Backward);

  if (isKeyDown(Key.Jump)) {
    velocity.y = -1;
  }
}
