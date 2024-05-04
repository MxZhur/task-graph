import { ref } from "vue";
import { defineStore } from "pinia";

export const useMainPageStore = defineStore("mainPage", () => {
  const selectedTab = ref<string>('graph');
  
  function switchTab(newTab: string) {
    selectedTab.value = newTab;
  }

  return {
    selectedTab,
    switchTab,
  };
});
