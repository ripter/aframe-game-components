/**
 * Plays animations on the model.
 * Refrences 'mesh' and 'animRoot' objects.
 * [Three.js AnimationMixer](https://threejs.org/docs/index.html#api/en/animation/AnimationMixer)
 */
AFRAME.registerComponent('anim-mixer', {
  schema: {
    // Turns on "loop", "ended" events.
    enableEvents: { default: false },
    // Default clip to play on init
    shouldPlayOnLoad: { default: true },
    defaultClip: { default: 'Idle' },
  },
  /**
   * Init handler. Similar to attachedCallback.
   * Called during component initialization and is only run once.
   * Components can use this to set initial state.
   */
  init() {
    this.mixer = null; // https://threejs.org/docs/index.html#api/en/animation/AnimationMixer
    this.action = null; // https://threejs.org/docs/index.html#api/en/animation/AnimationAction

    // Listen for add/remove of key objects mesh and armature
    this.el.addEventListener('object3dset', this);
  },

  /**
   * Tick handler.
   * Called on each tick of the scene render loop.
   * Affected by play and pause.
   *
   * @param {number} time - Scene tick time.
   * @param {number} timeDelta - Difference in current render time and previous render time.
   */
  tick(time, timeDelta) {
    const deltaInSeconds = timeDelta / 1000;

    if (this.mixer) {
      this.mixer.update(deltaInSeconds);
    }
  },

  /**
   * Remove handler. Similar to detachedCallback.
   * Called whenever component is removed from the entity (i.e., removeAttribute).
   * Components can use this to reset behavior on the entity.
   */
  remove() {
    this.el.removeEventListener('object3dset', this);
  },


  /**
   * Called when a listening event is observed.
   * @param  {Event} event the event that has been fired and needs to be processed.
   * @return {undefined}
   */
  handleEvent(event) {
    if (event.type !== 'object3dset') { return; }

    // Animations require a mesh and an armature. wait until we have both.
    const armature = this.el.getObject3D('armature');
    const mesh = this.el.getObject3D('mesh');
    if (!armature || !mesh) { return; }

    const { defaultClip, shouldPlayOnLoad } = this.data;
    // Now that we have a Mesh and an Armature, setup the animation mixer.
    this.setupMixer();
    // Playt the default animation
    if (shouldPlayOnLoad) {
      this.playAction(defaultClip);
    }
  },


  /**
   * Attempts to setup the AnimationMixer.
   * Bails if Mesh or Armature are missing.
   * See more: https://threejs.org/docs/index.html#api/en/animation/AnimationMixer
  */
  setupMixer() {
    const armature = this.el.getObject3D('armature');
    const mesh = this.el.getObject3D('mesh');
    // Bail if we are missing anything.
    if (!armature || !mesh) { return; }

    const { enableEvents } = this.data;

    // Create the mixer to use the new armature.
    this.mixer = new THREE.AnimationMixer(armature);
    // Listen to events.
    if (enableEvents) {
      this.mixer.addEventListener('loop', this);
      this.mixer.addEventListener('finished', this);
    }
    // Tell the mesh to allow animations.
    mesh.material.skinning = true;
    mesh.material.needsUpdate = true;
  },


  /**
   * Plays the Clip as a looping Action
  */
  playAction(clipName) {
    // bail if we are already playing this clip
    if (this.currentClipName === clipName) { return; }
    this.currentClipName = clipName;

    const prevAction = this.action;
    const armature = this.el.getObject3D('armature');
    if (!armature) { throw new Error(`Could not play clip "${clipName}". No armature found on entity.`); }
    const clip = THREE.AnimationClip.findByName(armature.animations, clipName);
    if (!clip) { throw new Error(`Clip "${clipName}" was not found in the animations array.\nCheck for misspellings in the clipName, or missing animations in the model file.`); }

    // Get the action for the clip. Actions are cached, so we also need to reset.
    this.action = this.mixer.clipAction(clip).reset();

    // Fade out the old action into the new one.
    if (prevAction) {
      this.action.crossFadeFrom(prevAction, 0.05);
    }
    // Start playing the new action.
    this.action.play();
  },
});
