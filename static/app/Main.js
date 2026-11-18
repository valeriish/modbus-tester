import { createApp } from "vue";
import Tabs from "./components/Tabs.js";
import Settings from "./components/Settings.js";
import Registers from "./components/Registers.js";
import Host from "./components/Host.js";
import AlertModal from "./components/AlertModal.js";
import { store } from "./service/store.js";
import { useErrorMessage } from "./composables/useErrorMessage.js";

const App = {
  components: { Tabs, Host, AlertModal },
  setup() {
    const { message } = useErrorMessage();

    return {
      alertMessage: message,
      store,
      tabs: [
        {
          title: "Registers",
          component: Registers
        }, {
          title: "Settings",
          component: Settings
        }
      ],
    }
  },
  template: `
    <div class="p-8">
      <Tabs :tabs="tabs"/>
      <div class="mt-6 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
        <Host :address="store.address" :port="store.port"/>
      </div>
      <AlertModal
        :open="Boolean(alertMessage)"
        title="Error"
        :message="alertMessage"
        @close="alertMessage = ''"
      />
    </div>
  `
};

createApp(App).mount("#app");

