<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useTasksStore } from '../../stores/tasksStore';
import ReparentFormItem from './ReparentFormItem.vue';

const { t } = useI18n();

const tasksStore = useTasksStore();

const emit = defineEmits(['formSubmit']);

function reparentTask(newParentId: string | null) {
    tasksStore.reparentTasks(tasksStore.selectedTasksIds, newParentId);

    emit('formSubmit');
}

</script>

<template>
    <div>
        <div class="text-2xl mb-4">
            {{ t('buttons.reparent') }}
        </div>

        <div class="mb-4 text-sm text-gray-500">
            {{ t('selectNewParentTask') }}
        </div>

        <div class="mb-4 overflow-y-scroll">
            <ReparentFormItem :task="null" @select="reparentTask" />
        </div>
    </div>
</template>
