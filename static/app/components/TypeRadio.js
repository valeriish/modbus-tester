export default {
  props: ["id", "modelValue", "disabled"],
  emits: ["update:modelValue"],
  computed: {
    selectedType: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit("update:modelValue", newValue);
      }
    }
  },
  template: `
    <span class="[&>input]:ml-2">
      <strong>Type:</strong>
      <input type="radio" :name="'type-' + id" v-model="selectedType" :id="id + '-BIN'" value="BIN"/>
      <label :for="id + '-BIN'">BIN</label>
      <input type="radio" :name="'type-' + id" v-model="selectedType" :id="id + '-UINT16'" value="UINT16"/>
      <label :for="id + '-UINT16'">UINT16</label>
      <input type="radio" :name="'type-' + id" v-model="selectedType" :id="id + '-HEX'" value="HEX"/>
      <label :for="id + '-HEX'">HEX</label>
    </span>
  `
}

