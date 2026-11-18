import Button from "./Button.js";

export default {
  components: { Button },
  props: {
    text: String,
    action: {
      type: Boolean,
      default: true,
    }
  },
  template: `
    <Button :text="text" :action="action"/>
  `
}

