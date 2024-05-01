import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { getFileBaseName } from "../utils/file";

const MAX_RECENT_FILES = 10;

export const useRecentFilesStore = defineStore("recentFiles", () => {
  const files = ref<string[]>([]);

  const filesNames = computed(() => {
    return files.value.map(f => getFileBaseName(f));
  });

  function loadRecentFiles() {
    const recentFilesJson = localStorage.getItem("recentFiles");

    if (recentFilesJson !== null) {
      files.value = JSON.parse(recentFilesJson);
    }
  }

  function storeRecentFiles() {
    localStorage.setItem("recentFiles", JSON.stringify(files.value));
  }

  function pushNewRecentFile(newFile: string) {
    if (files.value.includes(newFile)) {
      files.value = files.value.filter((fp) => fp !== newFile);
    }

    files.value.unshift(newFile);
    files.value = files.value.slice(0, MAX_RECENT_FILES);

    storeRecentFiles();
  }

  function clearRecentFiles() {
    files.value = [];

    storeRecentFiles();
  }

  return {
    files,
    filesNames,
    loadRecentFiles,
    storeRecentFiles,
    pushNewRecentFile,
    clearRecentFiles,
  };
});
