[make-a-level 2020](https://itch.io/jam/make-a-level)

## Setup & Run
```
make server
```


# Gameplay
This is a strategy platformer! How INCONGRUOUS is that? 😁Platforming inspired by The Lost Vikings and Doki Doki Penguin. While the strategy is inspired by Fire Emblem.

You goal is to rescue all of the Eggs by controlling the Vikings. Each Viking has a unique ability.




## Turn System
[Code](./src/systems/game.js)

* Playable Character is selected.
* Activate/Update [turn-planner](./src/components/move-planner.js)
* turn-planner displays icons in move-able spaces.
* User clicks Playable Character, reset back to step 1.
* User clicks move icon, submit the turn to turn system.
* Turn system moves the Character.
* Turn finishes, user is able to click again.
