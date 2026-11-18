export default {
  props: ["label", "name", "modelValue", "disabled", "id", "options"],
  emits: ["update:modelValue"],
  computed: {
    refId() {
      return this.id !== undefined ? `${this.name}-${this.id}` : this.name
    }
  },
	mounted() {
    if (this.modelValue === undefined && this.options.length) {
			this.$emit("update:modelValue", this.options[0].value);
		}
  },
  template: `
    <div class="mb-4 flex items-center gap-4">
      <label
        v-if="label"
        :for="refId"
        class="block font-medium text-slate-700"
      >
        {{ label }}
      </label>
      
      <select
        :id="refId"
        :name="name"
        :value="modelValue"
        :disabled="disabled || !options || !options.length"
        @change="$emit('update:modelValue', $event.target.value)"
        class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
      >
        <option
					v-for="(option, index) in options"
					:key="index"
					:value="option.value"
					:selected="modelValue === option.value"
				>
          {{ option.label }}
        </option>
      </select>
    </div>
  `
}

