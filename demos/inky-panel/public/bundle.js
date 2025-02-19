/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../anim-mixer/index.js":
/*!*********************************!*\
  !*** ../../anim-mixer/index.js ***!
  \*********************************/
/***/ (() => {

eval("/**\n * Plays animations on the model.\n * Refrences 'mesh' and 'animRoot' objects.\n * [Three.js AnimationMixer](https://threejs.org/docs/index.html#api/en/animation/AnimationMixer)\n */\nAFRAME.registerComponent('anim-mixer', {\n  schema: {\n    // Turns on \"loop\", \"ended\" events.\n    enableEvents: { default: false },\n    // Default clip to play on init\n    shouldPlayOnLoad: { default: true },\n    defaultClip: { default: 'Idle' },\n  },\n  /**\n   * Init handler. Similar to attachedCallback.\n   * Called during component initialization and is only run once.\n   * Components can use this to set initial state.\n   */\n  init() {\n    this.mixer = null; // https://threejs.org/docs/index.html#api/en/animation/AnimationMixer\n    this.action = null; // https://threejs.org/docs/index.html#api/en/animation/AnimationAction\n\n    // Listen for add/remove of key objects mesh and armature\n    this.el.addEventListener('object3dset', this);\n  },\n\n  /**\n   * Tick handler.\n   * Called on each tick of the scene render loop.\n   * Affected by play and pause.\n   *\n   * @param {number} time - Scene tick time.\n   * @param {number} timeDelta - Difference in current render time and previous render time.\n   */\n  tick(time, timeDelta) {\n    const deltaInSeconds = timeDelta / 1000;\n\n    if (this.mixer) {\n      this.mixer.update(deltaInSeconds);\n    }\n  },\n\n  /**\n   * Remove handler. Similar to detachedCallback.\n   * Called whenever component is removed from the entity (i.e., removeAttribute).\n   * Components can use this to reset behavior on the entity.\n   */\n  remove() {\n    this.el.removeEventListener('object3dset', this);\n  },\n\n\n  /**\n   * Called when a listening event is observed.\n   * @param  {Event} event the event that has been fired and needs to be processed.\n   * @return {undefined}\n   */\n  handleEvent(event) {\n    if (event.type !== 'object3dset') { return; }\n\n    // Animations require a mesh and an armature. wait until we have both.\n    const armature = this.el.getObject3D('armature');\n    const mesh = this.el.getObject3D('mesh');\n    if (!armature || !mesh) { return; }\n\n    const { defaultClip, shouldPlayOnLoad } = this.data;\n    // Now that we have a Mesh and an Armature, setup the animation mixer.\n    this.setupMixer();\n    // Playt the default animation\n    if (shouldPlayOnLoad) {\n      this.playAction(defaultClip);\n    }\n  },\n\n\n  /**\n   * Attempts to setup the AnimationMixer.\n   * Bails if Mesh or Armature are missing.\n   * See more: https://threejs.org/docs/index.html#api/en/animation/AnimationMixer\n  */\n  setupMixer() {\n    const armature = this.el.getObject3D('armature');\n    const mesh = this.el.getObject3D('mesh');\n    // Bail if we are missing anything.\n    if (!armature || !mesh) { return; }\n\n    const { enableEvents } = this.data;\n\n    // Create the mixer to use the new armature.\n    this.mixer = new THREE.AnimationMixer(armature);\n    // Listen to events.\n    if (enableEvents) {\n      this.mixer.addEventListener('loop', this);\n      this.mixer.addEventListener('finished', this);\n    }\n    // Tell the mesh to allow animations.\n    mesh.material.skinning = true;\n    mesh.material.needsUpdate = true;\n  },\n\n\n  /**\n   * Plays the Clip as a looping Action\n  */\n  playAction(clipName) {\n    // bail if we are already playing this clip\n    if (this.currentClipName === clipName) { return; }\n    this.currentClipName = clipName;\n\n    const prevAction = this.action;\n    const armature = this.el.getObject3D('armature');\n    if (!armature) { throw new Error(`Could not play clip \"${clipName}\". No armature found on entity.`); }\n    const clip = THREE.AnimationClip.findByName(armature.animations, clipName);\n    if (!clip) { throw new Error(`Clip \"${clipName}\" was not found in the animations array.\\nCheck for misspellings in the clipName, or missing animations in the model file.`); }\n\n    // Get the action for the clip. Actions are cached, so we also need to reset.\n    this.action = this.mixer.clipAction(clip).reset();\n\n    // Fade out the old action into the new one.\n    if (prevAction) {\n      this.action.crossFadeFrom(prevAction, 0.05);\n    }\n    // Start playing the new action.\n    this.action.play();\n  },\n});\n\n\n//# sourceURL=webpack://demo-characters/../../anim-mixer/index.js?");

/***/ }),

/***/ "./src/components/canvas-inky.js":
/*!***************************************!*\
  !*** ./src/components/canvas-inky.js ***!
  \***************************************/
/***/ (() => {

eval("const { Story } = inkjs; // inkjs loaded via script tag as iife\n\n/**\n * Runs a [Ink](https://github.com/inkle/ink) story as a component.\n */\nAFRAME.registerComponent('canvas-inky', {\n  schema: {\n    storyFile: { type: 'selector' },\n    canvas: { type: 'selector' },\n    backgroundColor: { default: '#0074D9' },\n    color: { default: '#7FDBFF' },\n    fontFamily: { default: 'monospace' },\n    fontSize: { default: 20 },\n  },\n\n  /**\n   * Init handler. Similar to attachedCallback.\n   * Called during component initialization and is only run once.\n   * Components can use this to set initial state.\n   */\n  init() {\n    this.lines = [\n      '1ABCDEFGHIJKLMNOPQRSTUVWXYZ',\n      '2abcdefghijklmnopqrstuvwxyz',\n      '3ABCDEFGHIJKLMNOPQRSTUVWXYZ',\n      '4abcdefghijklmnopqrstuvwxyz',\n      '5ABCDEFGHIJKLMNOPQRSTUVWXYZ',\n      '6abcdefghijklmnopqrstuvwxyz',\n      '7ABCDEFGHIJKLMNOPQRSTUVWXYZ',\n      '8abcdefghijklmnopqrstuvwxyz',\n      '9ABCDEFGHIJKLMNOPQRSTUVWXYZ',\n      '10bcdefghijklmnopqrstuvwxyz',\n    ];\n  },\n\n  /**\n   * Update handler. Similar to attributeChangedCallback.\n   * Called whenever component's data changes.\n   * Also called on component initialization when the component receives initial data.\n   *\n   * @param {object} prevData - Previous attributes of the component.\n   */\n  update(prevData) {\n    if (this.data.storyFile === prevData.storyFile) { return; }\n    if (!this.data.canvas) { return; }\n    const { canvas, fontSize, fontFamily } = this.data;\n    const ctx = this.ctx = canvas.getContext('2d');\n\n    if (this.data.storyFile !== prevData.storyFile) {\n      this.renderStory();\n    }\n\n    // clear screen by re-drawing background.\n    ctx.fillStyle = this.data.backgroundColor;\n    ctx.fillRect(0, 0, canvas.width, canvas.height);\n\n    // Draw the text.\n    ctx.fillStyle = this.data.color;\n    ctx.font = `${fontSize}px ${fontFamily}`;\n    this.lines.forEach((line, i) => {\n      ctx.fillText(line, 0, fontSize * (i + 1));\n    });\n  },\n\n  /**\n   * DOM Event handler.\n   * Called when a listening event is observed.\n   * @param  {Event} event the event that has been fired and needs to be processed.\n   * @return {undefined}\n   */\n  handleEvent() {\n    this.update();\n    // const { story } = this;\n    // console.log('event', event.type, event.target);\n    // switch (event.type) {\n    //   case 'click':\n    //     // Story choice!\n    //     cosnole.log('Choice Click', event.target);\n    //     // const choiceIndex = event.target.dataset.choiceIndex;\n    //     // const choice = story.currentChoices[choiceIndex];\n    //     // console.log('choice', choice);\n    //     // story.ChooseChoiceIndex(choiceIndex);\n    //     // this.renderStory();\n    //     break;\n    //   default:\n    //     console.warn(`Unhandled event type: ${event.type}`, event); // eslint-disable-line\n    // }\n  },\n\n  renderStory() {\n    const { storyFile } = this.data;\n\n    this.lines = [];\n    const story = this.story = new Story(storyFile.data);\n    while (story.canContinue) {\n      this.lines.push(story.Continue());\n    }\n\n    // Render the choices\n    // story.currentChoices.forEach((choice, index) => {\n    //   const elChoice = document.createElement('a-entity');\n    //   console.log('choice', choice);\n    //   elChoice.setAttribute('text', {value: choice.text});\n    //   elChoice.setAttribute('geometry', {primitive: 'plane', height: choiceHeight, width: 1});\n    //   // elChoice.setAttribute('material', 'color: #FFDC00;');\n    //   elChoice.object3D.position.y = -1 * index * choiceHeight;\n    //\n    //   elChoice.dataset.choiceIndex = index;\n    //   elChoice.classList.add('clickable');\n    //   elChoice.addEventListener('click', this);\n    //   // elChoice.onclick = (evt) => {\n    //   //   console.log('Click bitch', evt);\n    //   // }\n    //   // elChoice.addEventListener('click', (evt) => {\n    //   //   console.log('Click bitch, two', evt);\n    //   // });\n    //\n    //   elChoiceList.appendChild(elChoice);\n    // });\n  },\n});\n\n\n//# sourceURL=webpack://demo-characters/./src/components/canvas-inky.js?");

/***/ }),

/***/ "./src/components/click-to-select.js":
/*!*******************************************!*\
  !*** ./src/components/click-to-select.js ***!
  \*******************************************/
/***/ (() => {

eval("/**\n * Clicking on the entity will move the named component to this one.\n */\nAFRAME.registerComponent('click-to-select', {\n  /**\n   * Called to start any dynamic behavior (e.g., animation, AI, events, physics).\n   */\n  play() {\n    this.el.addEventListener('click', this);\n  },\n\n  /**\n   * Called to stop any dynamic behavior (e.g., animation, AI, events, physics).\n   */\n  pause() {\n    this.el.removeEventListener('click', this);\n  },\n\n  /**\n   * DOM Event handler.\n   * Called when a listening event is observed.\n   * @param  {Event} event the event that has been fired and needs to be processed.\n   * @return {undefined}\n   */\n  handleEvent(event) {\n    switch (event.type) {\n      case 'click':\n        this.system.select(this.el);\n        break;\n      default:\n        console.warn(`Unhandled event type: ${event.type}`, event, this); // eslint-disable-line\n    }\n  },\n});\n\n\n//# sourceURL=webpack://demo-characters/./src/components/click-to-select.js?");

/***/ }),

/***/ "./src/components/inky-panel.js":
/*!**************************************!*\
  !*** ./src/components/inky-panel.js ***!
  \**************************************/
/***/ (() => {

eval("const { Story } = inkjs; // inkjs loaded via script tag as iife\n\n/**\n * Runs a [Ink](https://github.com/inkle/ink) story as a component.\n */\nAFRAME.registerComponent('inky-panel', {\n  schema: {\n    storyFile: { type: 'selector' },\n    choiceHeight: { default: 0.0254 * 2 },\n  },\n\n  /**\n   * Init handler. Similar to attachedCallback.\n   * Called during component initialization and is only run once.\n   * Components can use this to set initial state.\n   */\n  init() {\n    this.lines = [\n      '1ABCDEFGHIJKLMNOPQRSTUVWXYZ',\n      '2abcdefghijklmnopqrstuvwxyz',\n      '3ABCDEFGHIJKLMNOPQRSTUVWXYZ',\n      '4abcdefghijklmnopqrstuvwxyz',\n      '5ABCDEFGHIJKLMNOPQRSTUVWXYZ',\n      '6abcdefghijklmnopqrstuvwxyz',\n      '7ABCDEFGHIJKLMNOPQRSTUVWXYZ',\n      '8abcdefghijklmnopqrstuvwxyz',\n      '9ABCDEFGHIJKLMNOPQRSTUVWXYZ',\n      '10bcdefghijklmnopqrstuvwxyz',\n    ];\n  },\n\n  /**\n   * Update handler. Similar to attributeChangedCallback.\n   * Called whenever component's data changes.\n   * Also called on component initialization when the component receives initial data.\n   *\n   * @param {object} prevData - Previous attributes of the component.\n   */\n  update(prevData) {\n    if (this.data.storyFile !== prevData.storyFile) {\n      this.story = new Story(this.data.storyFile.data);\n      this.renderStory();\n    }\n  },\n\n  /**\n   * DOM Event handler.\n   * Called when a listening event is observed.\n   * @param  {Event} event the event that has been fired and needs to be processed.\n   * @return {undefined}\n   */\n  handleEvent(event) {\n    const { story } = this;\n    const { choiceIndex } = event.target.dataset;\n\n    switch (event.type) {\n      case 'click':\n        // Story choice!\n        story.ChooseChoiceIndex(choiceIndex);\n        this.renderStory();\n        break;\n      default:\n        console.warn(`Unhandled event type: ${event.type}`, event); // eslint-disable-line\n    }\n  },\n\n  renderStory() {\n    const { story } = this;\n\n    let message = '';\n    while (story.canContinue) {\n      message += `${story.Continue()}\\n`;\n    }\n    this.el.setAttribute('text', { value: message });\n  },\n});\n\n\n//# sourceURL=webpack://demo-characters/./src/components/inky-panel.js?");

/***/ }),

/***/ "./src/components/match-mesh.js":
/*!**************************************!*\
  !*** ./src/components/match-mesh.js ***!
  \**************************************/
/***/ (() => {

eval("/**\n * TODO: Documentation\n */\nAFRAME.registerComponent('match-mesh', {\n  schema: {\n    target: { type: 'selector' },\n    meshName: { type: 'string' },\n  },\n\n  /**\n   * Init handler. Similar to attachedCallback.\n   * Called during component initialization and is only run once.\n   * Components can use this to set initial state.\n   */\n  init() {\n    this.el.addEventListener('model-loaded', this);\n  },\n\n  /**\n   * Update handler. Similar to attributeChangedCallback.\n   * Called whenever component's data changes.\n   * Also called on component initialization when the component receives initial data.\n   *\n   * @param {object} prevData - Previous attributes of the component.\n   */\n  update(/* prevData */) {\n    const { target, meshName } = this.data;\n    if (!target || !meshName) { return; }\n    const mesh = this.el.object3D.getObjectByName(meshName);\n    if (!mesh) { return; }\n    const targetMesh = target.getObject3D('mesh');\n    if (!targetMesh) { return; }\n\n    // Replace the target geometry with the the mesh's geometry\n    targetMesh.geometry.copy(mesh.geometry);\n    // Match the position & rotation\n    targetMesh.position.copy(mesh.position);\n    targetMesh.quaternion.copy(mesh.quaternion);\n    targetMesh.scale.copy(mesh.scale);\n\n    // Turn off the mesh we are copying.\n    mesh.visible = false;\n  },\n\n  /**\n   * DOM Event handler.\n   * Called when a listening event is observed.\n   * @param  {Event} event the event that has been fired and needs to be processed.\n   * @return {undefined}\n   */\n  handleEvent(/* event */) {\n    this.update();\n  },\n});\n\n\n//# sourceURL=webpack://demo-characters/./src/components/match-mesh.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _anim_mixer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../anim-mixer */ \"../../anim-mixer/index.js\");\n/* harmony import */ var _anim_mixer__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_anim_mixer__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _gltf_model_2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../gltf-model-2 */ \"../../gltf-model-2/index.js\");\n/* harmony import */ var _gltf_model_2__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_gltf_model_2__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components_inky_panel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/inky-panel */ \"./src/components/inky-panel.js\");\n/* harmony import */ var _components_inky_panel__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_components_inky_panel__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _components_canvas_inky__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/canvas-inky */ \"./src/components/canvas-inky.js\");\n/* harmony import */ var _components_canvas_inky__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_components_canvas_inky__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _components_click_to_select__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/click-to-select */ \"./src/components/click-to-select.js\");\n/* harmony import */ var _components_click_to_select__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_components_click_to_select__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _components_match_mesh__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/match-mesh */ \"./src/components/match-mesh.js\");\n/* harmony import */ var _components_match_mesh__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_components_match_mesh__WEBPACK_IMPORTED_MODULE_5__);\n// import 'aframe-troika-text';\n\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack://demo-characters/./src/index.js?");

/***/ }),

/***/ "../../gltf-model-2/index.js":
/*!***********************************!*\
  !*** ../../gltf-model-2/index.js ***!
  \***********************************/
/***/ (() => {

eval("/**\n * Version of gltf-model that sets 'mesh' to the frist SkinnedMesh, Mesh or root object.\n * sets `mesh` and `armature` references\n * `setObject3D('mesh', SkinnedMesh || Mesh)`\n * `setObject3D('armature', {Object3D animations=[]})`\n */\nAFRAME.registerComponent('gltf-model-2', {\n  schema: { type: 'asset' },\n\n  /**\n   * Init handler. Similar to attachedCallback.\n   * Called during component initialization and is only run once.\n   * Components can use this to set initial state.\n   */\n  init() {\n    // QUESTION: Should the loader be on the system, and shared with the components?\n    const dracoLoader = this.el.sceneEl.systems['gltf-model'].getDRACOLoader();\n    this.loader = new THREE.GLTFLoader();\n    if (dracoLoader) {\n      this.loader.setDRACOLoader(dracoLoader);\n    }\n  },\n\n  /**\n   * Update handler. Similar to attributeChangedCallback.\n   * Called whenever component's data changes.\n   * Also called on component initialization when the component receives initial data.\n   *\n   * @param {object} prevData - Previous attributes of the component.\n   */\n  update(oldSrc) {\n    const src = this.data;\n\n    // remove the old version when the source changes.\n    if (src !== oldSrc) {\n      this.remove();\n    }\n\n    // abort if there is no model to load.\n    if (!src) { return; }\n\n    // Load the model.\n    this.loader.load(\n      src,\n      this.onLoad.bind(this),\n      this.onProgress.bind(this),\n      this.onError.bind(this),\n    );\n  },\n\n  /**\n   * Remove handler. Similar to detachedCallback.\n   * Called whenever component is removed from the entity (i.e., removeAttribute).\n   * Components can use this to reset behavior on the entity.\n   */\n  remove() {\n    if (!this.model) { return; }\n    this.el.removeObject3D('mesh');\n    this.el.removeObject3D('armature');\n    this.model.dispose();\n    this.model = null;\n    this.loader = null;\n  },\n\n  /**\n   * Called when a model is loaded.\n   */\n  onLoad(gltfData) {\n    const { el } = this;\n    const { animations } = gltfData;\n\n    // Get the root model aka scene from the file\n    // Save it with the animations array.\n    this.model = gltfData.scene || gltfData.scenes[0];\n    this.model.animations = animations;\n\n    // Find the mesh object\n    const mesh = this.getMesh(this.model);\n\n    // Set the object references\n    el.setObject3D('mesh', mesh);\n    el.setObject3D('armature', this.model);\n    // Emit load finished\n    el.emit('model-loaded', { format: 'gltf', model: this.model });\n  },\n\n  /**\n   * Called when model fails to load.\n   */\n  onError(error) {\n    const { el, data: src } = this;\n    const message = (error && error.message) ? error.message : 'Failed to load glTF model';\n    el.emit('model-error', { format: 'gltf', src });\n    throw new Error(message);\n  },\n\n  /**\n   * Called while the model is loading.\n   */\n  onProgress() {\n    // do nothing\n  },\n\n  /**\n   * Returns the first SkinnedMesh or Mesh found.\n   */\n  getMesh(model) {\n    let mesh;\n    // Look for a Skinned Mesh\n    mesh = model.getObjectByProperty('type', 'SkinnedMesh');\n    if (mesh) {\n      return mesh;\n    }\n\n    // Look for a base Mesh\n    mesh = model.getObjectByProperty('type', 'Mesh');\n    if (mesh) {\n      return mesh;\n    }\n\n    // default to the root\n    return model;\n  },\n});\n\n\n//# sourceURL=webpack://demo-characters/../../gltf-model-2/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;