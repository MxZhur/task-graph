<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useCurrentFileStore } from '../stores/currentFileStore';
import { useTasksStore } from '../stores/tasksStore';
import { commandFileSave } from '../utils/file';

const { t } = useI18n();

const tasksStore = useTasksStore();

const currentFileStore = useCurrentFileStore();

function saveChanges() {
    commandFileSave();
}

</script>

<template>
    <div class="h-8 border-t text-sm px-2 border-gray-300 bg-white flex flex-row justify-between items-center">
        <div>
            {{ t('projectProgress') }}: {{ tasksStore.overallProjectProgress.toString() }}%
        </div>
        <div>
            <div @click="saveChanges" v-if="currentFileStore.isDirty" class="text-red-700 cursor-pointer unselectable">
                {{ t('unsavedChanges') }}
            </div>
        </div>
    </div>
</template>

<style scoped></style>
