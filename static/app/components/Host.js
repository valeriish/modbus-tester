export default {
  props: ["address", "port"],
  template: `
    <div class="flex items-center gap-2.5">
      <span
        class="w-2.5 h-2.5 rounded-full"
        :class="address ? 'bg-emerald-500' : 'bg-gray-900'"
      ></span>
      <strong class="font-medium text-slate-600">Modbus Host:</strong>
      <span class="font-mono text-slate-900 bg-white px-2 py-0.5 border-slate-200">
        tcp://{{ address }}:{{ port }}
      </span>
    </div>
  `
}

