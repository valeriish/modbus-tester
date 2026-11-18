import { useTemplateRef } from "vue";
import Register from "./Register.js";
import ActionButton from "./ActionButton.js";
import PlusMinusIcon from "../icons/PlusMinus.js";
import { useRegisters } from "../composables/useRegisters.js";

export default {
  components: { Register, ActionButton, PlusMinusIcon },
  setup() {
    const {
      registers,
      inProgress,
      data,
      isPolling,
      reset,
      fetchData,
      startPoll,
      stopPoll,
      send,
      addNew,
      removeItem,
    } = useRegisters();

    const form = useTemplateRef("form");

    const poll = () => {
      if (!form || !form.value?.reportValidity()) {
        return;
      }

      isPolling.value ? stopPoll() : startPoll();
    }

    return {
      registers,
      inProgress,
      data,
      isPolling,
      reset,
      fetchData,
      poll,
      send,
      addNew,
      removeItem,
    }
  },
  methods: {
    apply(e) {
      e.preventDefault();
      this.send();
    },
    getData(address) {
      if (address?.num && this.data?.has(address.num)) {
        return this.data.get(address.num);
      }

      return "";
    }
  },
  mounted() {
    this.reset();
  },
  template: `
    <form class="flex flex-col gap-1 relative" @submit="apply" ref="form">
      <div class="absolute right-0 flex flex-col gap-4 w-32">
        <ActionButton type="submit" text="Read" :disabled="inProgress || isPolling"/>
        <ActionButton
          type="button"
          @click="poll"
          :text="isPolling ? 'Stop Polling' : 'Poll'"
          :disabled="!isPolling && inProgress"
          :action="false"
          :active="true"
        />
      </div>
      <Register
        v-for="(address, index) in registers"
        :id="index"
        :key="index"
        v-model="registers[index]"
        :data="getData(address)"
        :isNew="index === registers.length - 1"
        :canRemove="index > 0 && index < registers.length"
        @removeItem="() => { removeItem(index) }"
      />
      <div>
        <button
          type="button"
          class="w-7 h-7 inline-flex items-center justify-center rounded-full border border-slate-300 text-slate-600 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
          @click="addNew"
        >
          <PlusMinusIcon class="w-4 h-4" />
        </button>
      </div>
    </form>
  `
}

