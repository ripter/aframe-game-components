const { Story } = inkjs; // inkjs loaded via script tag as iife

// console.log('Story Loaded', Story);
/**
 * Runs a [Ink](https://github.com/inkle/ink) story as a component.
 */
AFRAME.registerComponent('inky-panel', {
  schema: {
    storyFile: { type: 'selector' },
    choiceHeight: { default: 0.0254 * 2 },
  },

  /**
   * Init handler. Similar to attachedCallback.
   * Called during component initialization and is only run once.
   * Components can use this to set initial state.
   */
  init() {
    // const { storyFile } = this.data;
    // this.story = new Story(storyFile.data);
    // console.log('%c, 'font-weight: bold;', this.story.ContinueMaximally());
    this.elText = this.el.querySelector('[inky-panel-text]');
    if (!this.elText) { throw new Error('inky-panel requres a child with the attribute "inky-panel-text".'); }
    this.elChoiceList = this.el.querySelector('[inky-panel-choice-list]');
  },

  /**
   * Update handler. Similar to attributeChangedCallback.
   * Called whenever component's data changes.
   * Also called on component initialization when the component receives initial data.
   *
   * @param {object} prevData - Previous attributes of the component.
   */
  update(prevData) {
    if (this.data.storyFile !== prevData.storyFile) {
      this.story = new Story(this.data.storyFile.data);
      this.renderStory();
    }
    console.log('update', this.data);
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
  },

  /**
   * Called to start any dynamic behavior (e.g., animation, AI, events, physics).
   */
  play() {
  },

  /**
   * Called to stop any dynamic behavior (e.g., animation, AI, events, physics).
   */
  pause() {
  },


  /**
   * Remove handler. Similar to detachedCallback.
   * Called whenever component is removed from the entity (i.e., removeAttribute).
   * Components can use this to reset behavior on the entity.
   */
  remove() {
  },

  /**
   * DOM Event handler.
   * Called when a listening event is observed.
   * @param  {Event} event the event that has been fired and needs to be processed.
   * @return {undefined}
   */
  handleEvent(event) {
    const { story } = this;
    console.log('event', event.type, event.target);
    switch (event.type) {
      case 'click':
        // Story choice!
        const choiceIndex = event.target.dataset.choiceIndex;
        const choice = story.currentChoices[choiceIndex];
        console.log('choice', choice);
        story.ChooseChoiceIndex(choiceIndex);
        this.renderStory();
        break;
      default:
        console.warn(`Unhandled event type: ${event.type}`, event); // eslint-disable-line
    }
  },

  renderStory() {
    const { elText, elChoiceList, story } = this;
    const { choiceHeight } = this.data;

    // Get the full text and display it.
    this.storyBody = story.ContinueMaximally();
    elText.setAttribute('text', {value: this.storyBody});

    // Remove any old children
    elChoiceList.getChildren().forEach(item => item.remove());
    // elChoiceList.children.forEach(item => item.remove());


    // Render the choices
    story.currentChoices.forEach((choice, index) => {
      const elChoice = document.createElement('a-entity');
      console.log('choice', choice);
      elChoice.setAttribute('text', {value: choice.text});
      elChoice.setAttribute('geometry', {primitive: 'plane', height: choiceHeight, width: 1});
      // elChoice.setAttribute('material', 'color: #FFDC00;');
      elChoice.object3D.position.y = -1 * index * choiceHeight;

      elChoice.dataset.choiceIndex = index;
      elChoice.classList.add('clickable');
      elChoice.addEventListener('click', this);
      // elChoice.onclick = (evt) => {
      //   console.log('Click bitch', evt);
      // }
      // elChoice.addEventListener('click', (evt) => {
      //   console.log('Click bitch, two', evt);
      // });

      elChoiceList.appendChild(elChoice);
    });


  },
});
