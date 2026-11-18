export default {
  props: ["text", "active", "action"],
  template: `
    <button
      class="px-4 py-2 rounded w-full border-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      :class="
        action ? 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600' :
        active ? 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600' : 
        'border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100'
      "
    >
      {{ text }}
    </button>
  `
}

