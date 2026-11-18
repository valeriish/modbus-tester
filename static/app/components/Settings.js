import Input from "./Input.js"
import { store, setStore } from "../service/store.js";
import EditIcon from "../icons/Edit.js";
import XIcon from "../icons/X.js";
import CheckIcon from "../icons/Check.js";

export default {
  components: { Input, EditIcon, XIcon, CheckIcon },
  data() {
    return {
      isEditing: false,
      address: "",
      port: 0,
      timeout: 1000,
    }
  },
  methods: {
    reset() {
      this.address = store.address;
      this.port = store.port;
      this.timeout = store.timeout;
    },
    apply(e) {
      e.preventDefault();

      setStore({
        address: this.address,
        port: this.port,
        timeout: this.timeout,
      });

      this.isEditing = false;
    },
    toggleEdit() {
      if (this.isEditing) {
        this.reset();
      }
      this.isEditing = !this.isEditing
    }
  },
  mounted() {
    this.reset();
  },
  template: `
    <form @submit="apply">
      <fieldset class="[&_label]:w-40 border border-slate-200 p-4 rounded-md relative group">
        <legend class="px-2 text-slate-800 font-medium flex items-center justify-between w-full">
          <span>Settings</span>
          <span class="flex gap-1">
            <button
              v-if="isEditing"
              type="submit"
              class="ml-4 p-1 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Apply Changes"
            >
              <CheckIcon/>
            </button>
            <button
              @click.prevent="toggleEdit"
              type="button"
              class="ml-4 p-1 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              :title="isEditing ? 'Cancel editing' : 'Edit settings'"
            >
              <EditIcon v-if="!isEditing"/>
              <XIcon v-if="isEditing"/>
            </button>
          </span>
        </legend>

        <div class="mt-2 space-y-4">
          <Input name="address" label="Address" v-model="address" :disabled="!isEditing" :required="true"/>
          <Input name="port" label="Port" type="number" v-model="port" :disabled="!isEditing" :required="true"/>
          <Input name="timeout" label="Poll Timeout" type="number" v-model="timeout" :disabled="!isEditing" :required="true"/>
        </div>
      </fieldset>
    </form>
  `
}

