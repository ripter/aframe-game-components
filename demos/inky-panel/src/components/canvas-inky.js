const { Story } = inkjs; // inkjs loaded via script tag as iife

// console.log('Story Loaded', Story);
/**
 * Runs a [Ink](https://github.com/inkle/ink) story as a component.
 */
AFRAME.registerComponent('canvas-inky', {
  schema: {
    storyFile: { type: 'selector' },
    canvas: { type: 'selector' },
  },

  /**
   * Init handler. Similar to attachedCallback.
   * Called during component initialization and is only run once.
   * Components can use this to set initial state.
   */
  init() {
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
    const { canvas } = this.data;
    const ctx = this.ctx = canvas.getContext('2d');

    // ctx.fillStyle = 'rgb(200, 0, 0)';
    ctx.fillStyle = '#0074D9'; // blue
    ctx.fillRect(0, 0, 50, 50);

    // ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
    ctx.fillStyle = '#FF851B'; // orange
    ctx.fillRect(78, 78, 50, 50);

    ctx.fillStyle = 'black';
    ctx.font = "20px Georgia";
    ctx.fillText("Hello World!", 10, 50);
    ctx.font = "30px Verdana";
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
