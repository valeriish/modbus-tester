import TabTrigger from "./Button.js";

export default {
  components: { TabTrigger },
  props: ["tabs"],
  data() {
    return {
      activeIndex: 0
    }
  },
  template: `
    <div class="flex w-full min-h-[300px]">
      <ul class="w-48 flex flex-col space-y-2 border-r border-gray-200 pr-4">
        <li v-for="(tab, index) in tabs" :key="index">
          <TabTrigger :text="tab.title" @click="activeIndex = index" :active="activeIndex === index"/>
        </li>
      </ul>
      <div class="flex-1 pl-6">
        <div class="p-6 bg-white border border-gray-100 rounded shadow-sm h-full">
          <component :is="tabs[activeIndex].component"></component>
        </div>
      </div>
    </div>
  `
}

