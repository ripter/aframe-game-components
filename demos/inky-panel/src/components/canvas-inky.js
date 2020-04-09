const { Story } = inkjs; // inkjs loaded via script tag as iife

/**
 * Runs a [Ink](https://github.com/inkle/ink) story as a component.
 */
AFRAME.registerComponent('canvas-inky', {
  schema: {
    storyFile: { type: 'selector' },
    canvas: { type: 'selector' },
    backgroundColor: { default: '#0074D9' },
    color: { default: '#7FDBFF' },
    fontFamily: { default: 'monospace' },
    fontSize: { default: 20 },
  },

  /**
   * Init handler. Similar to attachedCallback.
   * Called during component initialization and is only run once.
   * Components can use this to set initial state.
   */
  init() {
    this.lines = [
      '1ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '2abcdefghijklmnopqrstuvwxyz',
      '3ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '4abcdefghijklmnopqrstuvwxyz',
      '5ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '6abcdefghijklmnopqrstuvwxyz',
      '7ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '8abcdefghijklmnopqrstuvwxyz',
      '9ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '10bcdefghijklmnopqrstuvwxyz',
    ];
  },

  /**
   * Update handler. Similar to attributeChangedCallback.
   * Called whenever component's data changes.
   * Also called on component initialization when the component receives initial data.
   *
   * @param {object} prevData - Previous attributes of the component.
   */
  update(prevData) {
    if (this.data.storyFile === prevData.storyFile) { return; }
    if (!this.data.canvas) { return; }
    const { canvas, fontSize, fontFamily } = this.data;
    const ctx = this.ctx = canvas.getContext('2d');

    if (this.data.storyFile !== prevData.storyFile) {
      this.renderStory();
    }

    // clear screen by re-drawing background.
    ctx.fillStyle = this.data.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the text.
    ctx.fillStyle = this.data.color;
    ctx.font = `${fontSize}px ${fontFamily}`;
    this.lines.forEach((line, i) => {
      ctx.fillText(line, 0, fontSize * (i+1));
    });
  },


  /**
   * DOM Event handler.
   * Called when a listening event is observed.
   * @param  {Event} event the event that has been fired and needs to be processed.
   * @return {undefined}
   */
  handleEvent(event) {
    this.update();
    // const { story } = this;
    // console.log('event', event.type, event.target);
    // switch (event.type) {
    //   case 'click':
    //     // Story choice!
    //     cosnole.log('Choice Click', event.target);
    //     // const choiceIndex = event.target.dataset.choiceIndex;
    //     // const choice = story.currentChoices[choiceIndex];
    //     // console.log('choice', choice);
    //     // story.ChooseChoiceIndex(choiceIndex);
    //     // this.renderStory();
    //     break;
    //   default:
    //     console.warn(`Unhandled event type: ${event.type}`, event); // eslint-disable-line
    // }
  },

  renderStory() {
    const { elText, elChoiceList } = this;
    const { choiceHeight, storyFile } = this.data;

    this.lines = [];
    const story = this.story = new Story(storyFile.data);
    console.log('story', this.story);
    while (story.canContinue) {
      this.lines.push(story.Continue());
    }

    // Render the choices
    // story.currentChoices.forEach((choice, index) => {
    //   const elChoice = document.createElement('a-entity');
    //   console.log('choice', choice);
    //   elChoice.setAttribute('text', {value: choice.text});
    //   elChoice.setAttribute('geometry', {primitive: 'plane', height: choiceHeight, width: 1});
    //   // elChoice.setAttribute('material', 'color: #FFDC00;');
    //   elChoice.object3D.position.y = -1 * index * choiceHeight;
    //
    //   elChoice.dataset.choiceIndex = index;
    //   elChoice.classList.add('clickable');
    //   elChoice.addEventListener('click', this);
    //   // elChoice.onclick = (evt) => {
    //   //   console.log('Click bitch', evt);
    //   // }
    //   // elChoice.addEventListener('click', (evt) => {
    //   //   console.log('Click bitch, two', evt);
    //   // });
    //
    //   elChoiceList.appendChild(elChoice);
    // });
  },
});
