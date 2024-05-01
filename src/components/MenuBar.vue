<script setup lang="ts">
import { useCurrentFileStore } from '../stores/currentFileStore';
import { useRecentFilesStore } from '../stores/recentFilesStore';
import {
    commandFileNew,
    commandFileOpen,
    commandFileOpenRecent,
    commandFileSave,
    commandFileSaveAs,
    getFileBaseName
} from '../utils/file';
import DropdownMenu from './DropdownMenu.vue';

const currentFileStore = useCurrentFileStore();
const recentFilesStore = useRecentFilesStore();

function newFile() {
    commandFileNew();
}

function openFile() {
    commandFileOpen();
}

function saveFile() {
    commandFileSave();
}

function saveFileAs() {
    commandFileSaveAs();
}

function openRecentFile(filePath: string) {
    commandFileOpenRecent(filePath);
}

function clearRecentFiles() {
    recentFilesStore.clearRecentFiles();
}

</script>

<template>
    <div class="h-8 border-b text-sm px-2 border-gray-300 bg-white flex flex-row justify-between items-center">
        <div class="flex flex-row justify-start items-center">
            <DropdownMenu>
                <template #item>
                    <div>
                        File
                    </div>
                </template>
                <template #menu>
                    <ul>
                        <li class="cursor-pointer my-2" @click="newFile">
                            New
                        </li>
                        <li class="cursor-pointer my-2" @click="openFile">
                            Open...
                        </li>
                        <li class="cursor-pointer my-2" :class="{ 'text-red-700': currentFileStore.isDirty }"
                            @click="saveFile">
                            Save
                        </li>
                        <li class="cursor-pointer my-2" @click="saveFileAs">
                            Save As...
                        </li>

                        <template v-if="recentFilesStore.files.length > 0">
                            <hr>
                            <li class="cursor-pointer my-2" v-for="file in recentFilesStore.files"
                                @click="openRecentFile(file)" :key="file">
                                {{ getFileBaseName(file) }}
                            </li>
                            <li class="cursor-pointer my-2" @click="clearRecentFiles">
                                Clear Recent Files
                            </li>
                        </template>
                    </ul>
                </template>
            </DropdownMenu>

            <router-link to="/about">
                About
            </router-link>
        </div>
    </div>
</template>

<style scoped></style>
