export default {
  props: {
    open: Boolean,
    title: { type: String, default: "Alert" },
    message: String
  },
  emits: ["close"],
  template: `
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="$emit('close')"
    >
      <div class="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <p class="mt-2 text-sm text-gray-600">{{ message }}</p>

        <div class="mt-4 flex justify-end">
          <button
            type="button"
            class="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 cursor-pointer"
            @click="$emit('close')"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  `
};

