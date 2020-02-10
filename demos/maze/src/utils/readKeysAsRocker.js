
/**
 * Helper to read two keys as a rocker switch.
 * if keyA is down, return 1
 * if keyB is down, reutrn -1
 * else return 0
*/
export function readKeysAsRocker(isKeyDown, keyA, keyB) {
  if (isKeyDown(keyA)) {
    return 1;
  } if (isKeyDown(keyB)) {
    return -1;
  }
  return 0;
}
