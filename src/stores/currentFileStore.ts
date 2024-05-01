import { ref } from "vue";
import { defineStore } from "pinia";

export const useCurrentFileStore = defineStore("currentFile", () => {
  const filePath = ref<string | null>(null);
  const isDirty = ref<boolean>(false);
  const isNewFile = ref<boolean>(true);

  function setToNewFile() {
    filePath.value = null;
    isDirty.value = false;
    isNewFile.value = true;
  }

  function setToDirtyFile() {
    isDirty.value = true;
  }

  function setToSavedFile(newFilePath?: string) {
    if (newFilePath !== undefined) {
      filePath.value = newFilePath;
    }

    isDirty.value = false;
    isNewFile.value = false;
  }

  function setToOpenedFile(newFilePath: string) {
    filePath.value = newFilePath;
    isDirty.value = false;
    isNewFile.value = false;
  }

  return {
    filePath,
    isDirty,
    isNewFile,
    setToNewFile,
    setToDirtyFile,
    setToSavedFile,
    setToOpenedFile,
  };
});
