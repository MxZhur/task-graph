<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { useRecentFilesStore } from './stores/recentFilesStore';
import { appWindow } from '@tauri-apps/api/window';
import { FILE_EXTENSION, askFileConfirmation, commandFileOpenRecent, commandFileSave } from './utils/file';
import { UnlistenFn, listen } from '@tauri-apps/api/event';

const listenToCloseRequest = async () => {
  return appWindow.onCloseRequested(async (event) => {

    const askFileConfirmationResult = await askFileConfirmation();

    if (askFileConfirmationResult === "cancel") {
      event.preventDefault();
      return;
    }

    if (askFileConfirmationResult === "yes") {
      if (!(await commandFileSave())) {
        event.preventDefault();
        return;
      }
    }
  });
};

let unlistenCloseRequest: Promise<UnlistenFn>;
let unlistenFileDrop: Promise<UnlistenFn>;

onMounted(() => {
  const recentFilesStore = useRecentFilesStore();
  recentFilesStore.loadRecentFiles();

  unlistenCloseRequest = listenToCloseRequest();
  unlistenFileDrop = listen<string[]>(
      "tauri://file-drop",
      async (event) => {
        const filePath: string = event.payload[0];

        const fileExtension = filePath.slice(filePath.lastIndexOf("."));

        if (fileExtension !== "." + FILE_EXTENSION) {
          return;
        }

        await commandFileOpenRecent(filePath);
      }
    );
});

onBeforeUnmount(() => {
  listenToCloseRequest()

  unlistenCloseRequest.then((f) => f());
  unlistenFileDrop.then((f) => f());
});

</script>

<template>
  <div class="app-container">
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
