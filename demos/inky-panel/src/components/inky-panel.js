const { Story } = inkjs; // inkjs loaded via script tag as iife

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
    if (this.data.storyFile !== prevData.storyFile) {
      this.story = new Story(this.data.storyFile.data);
      this.renderStory();
    }
  },

  /**
   * DOM Event handler.
   * Called when a listening event is observed.
   * @param  {Event} event the event that has been fired and needs to be processed.
   * @return {undefined}
   */
  handleEvent(event) {
    const { story } = this;
    const { choiceIndex } = event.target.dataset;

    switch (event.type) {
      case 'click':
        // Story choice!
        story.ChooseChoiceIndex(choiceIndex);
        this.renderStory();
        break;
      default:
        console.warn(`Unhandled event type: ${event.type}`, event); // eslint-disable-line
    }
  },

  renderStory() {
    const { story } = this;

    let message = '';
    while (story.canContinue) {
      message += `${story.Continue()}\n`;
    }
    this.el.setAttribute('text', { value: message });
  },
});
