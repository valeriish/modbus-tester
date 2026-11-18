import Input from "./Input.js"
import Select from "./Select.js"
import TypeRadio from "./TypeRadio.js";
import PlusMinusIcon from "../icons/PlusMinus.js";

const options = [0, 1, 3, 4].map((i) => ({
  value: i, label: i,
}));

export default {
  components: { Input, Select, TypeRadio, PlusMinusIcon },
  props: ["id", "modelValue", "data", "isNew", "canRemove"],
  emits: ["update:modelValue", "removeItem"],
  data() {
    return {
      options,
      readingType: "UINT16",
    }
  },
  computed: {
    type: {
      get() {
        const val = String(this.modelValue?.num || "");
        return val ? val[0] : 0; 
      },
      set(newType) {
        let val = String(this.modelValue?.num || "0");
        if (val.length < 2) {
          val += "0";
        }
        val = String(newType) + val.slice(1);
        this.$emit("update:modelValue", { ...this.modelValue, num: val });
      }
    },
    num: {
      get() {
        const val = String(this.modelValue?.num || "");
        return val.length > 1 ? parseInt(val.slice(1)) : 0;
      },
      set(newNum) {
        const val = String(this.modelValue?.num || "0");
        this.$emit(
          "update:modelValue",
          { ...this.modelValue, num: val.length < 2 ? val + parseInt(newNum) : val[0] + parseInt(newNum) }
        );
      }
    },
    label: {
      get() {
        return this.modelValue?.label || "";
      },
      set(newLabel) {
        this.$emit(
          "update:modelValue",
          { ...this.modelValue, label: newLabel }
        );
      }
    },
    formattedData() {
      if (this.readingType === "BIN") {
        return (this.data >>> 0).toString(2).padStart(16, '0');
      }
      if (this.readingType === "HEX") {
        return (this.data >>> 0).toString(16).padStart(4, '0');
      }
      return this.data;
    }
  },
  template: `
    <div class="flex gap-4 [&>div]:!flex-col [&>div]:!items-start [&>div]:!gap-1">
      <Select :id="id" name="type" label="Memory Type" :options="options" v-model="type"/>
      <Input :id="id" name="address" label="Address" type="number" v-model="num" :required="true" class="w-20"/>
      <Input :id="id" name="label" label="Label" v-model="label"/>
      <div class="pt-8 w-7">
        <button
          v-if="canRemove"
          type="button"
          class="w-7 h-7 inline-flex items-center justify-center rounded-full border border-slate-300 text-slate-600 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
          @click="$emit('removeItem')"
        >
          <PlusMinusIcon :minus="true" class="w-4 h-4" />
        </button>
      </div>
      <div v-if="data !== ''" class="flex">
        <TypeRadio :id="modelValue?.num ?? 'id'" v-model="readingType"/>
        <span>{{ formattedData }}</span>
      </div>
    </div>
  `
}

