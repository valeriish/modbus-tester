export default {
  props: ["type", "label", "name", "modelValue", "disabled", "required", "id"],
  emits: ["update:modelValue"],
  computed: {
    refId() {
      return this.id !== undefined ? `${this.name}-${this.id}` : this.name
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
      
      <input 
        :id="refId"
        :name="name"
        :type="type || 'text'" 
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        @input="$emit('update:modelValue', $event.target.value)"
        class="px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 w-full"
      />
    </div>
  `
}

