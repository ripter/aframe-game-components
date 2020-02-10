# user-controls component
#### Inspired by [Unity Character Controller](https://docs.unity3d.com/Manual/class-CharacterController.html)

This component allows the user to control a model with WASD keys. The model will animate with AABB collision detection.


### How it works:

1. `velocity` and `rotation` are created based on user input.
2. Collisions are checked, updating the `velocity`.
3. Animation is updated based on `velocity`.
4. Entity is moved in world space. based on `velocity` and `rotation`.


## Input System
The `input` system listens to keyboard input and translates it into
custom keys. [KEY_MAP](./src/consts/key_map.js) provides a mapping from
[KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
to a custom named key.

Components should reference the system and read Key status from the `isKeyDown` method.

*Example usage:*
```
import { Key } from './consts/key_map';

// Inside a component
const { input } = this.el.sceneEl.systems;
if (input.isKeyDown(Key.Forward)) {
  // Forward key is down.
}
```


## Click To Select
A Component/System combo to allow the user to select a single model as active. The active entity will have an Indicator above it.

Active entity will have a component property set to true, while the de-activated entities will have the property set to false.

In the demo, this component is used to toggle `user-controls` `enabled` property.



## Collision system
The `collision` component creates a simple Bounding Box to use for collision. It keeps the box updated based on the entity mesh position and rotation.

The `collision` system keeps track of all the AABB bounding boxes and provides methods to check for collisions.
