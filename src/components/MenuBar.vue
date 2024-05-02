<script setup lang="ts">
import { useI18n } from 'vue-i18n';
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

const { t } = useI18n();

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
                        {{ t('menu.file') }}
                    </div>
                </template>
                <template #menu>
                    <ul>
                        <li class="cursor-pointer my-2" @click="newFile">
                            {{ t('menu.fileNew') }}
                        </li>
                        <li class="cursor-pointer my-2" @click="openFile">
                            {{ t('menu.fileOpen') }}...
                        </li>
                        <li class="cursor-pointer my-2" :class="{ 'text-red-700': currentFileStore.isDirty }"
                            @click="saveFile">
                            {{ t('menu.fileSave') }}
                        </li>
                        <li class="cursor-pointer my-2" @click="saveFileAs">
                            {{ t('menu.fileSaveAs') }}...
                        </li>

                        <template v-if="recentFilesStore.files.length > 0">
                            <hr>
                            <li class="cursor-pointer my-2" v-for="file in recentFilesStore.files"
                                @click="openRecentFile(file)" :key="file">
                                {{ getFileBaseName(file) }}
                            </li>
                            <li class="cursor-pointer my-2" @click="clearRecentFiles">
                                {{ t('menu.clearRecent') }}
                            </li>
                        </template>
                    </ul>
                </template>
            </DropdownMenu>

            <router-link to="/about">
                {{ t('menu.about') }}
            </router-link>
        </div>
    </div>
</template>

<style scoped></style>
