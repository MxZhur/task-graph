<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Task, useTasksStore } from '../../stores/tasksStore';
import { computed } from 'vue';

const { t } = useI18n();

const tasksStore = useTasksStore();

const props = defineProps<{
    task: Task | null;
}>();

const emit = defineEmits<{
    (e: 'select', newParentId: string | null): void
}>();

function select(newParentId: string | null) {
    emit('select', newParentId);
}

const isSelectable = computed(() => {
    if (props.task === null) {
        return true;
    }

    return !tasksStore.selectedTasksIds.includes(props.task.id);
});

const childTasks = computed(() => {
    if (!isSelectable.value) {
        return [];
    }

    return tasksStore.findTasksByParent(props.task?.id ?? null);
});

</script>

<template>
    <div v-if="isSelectable">
        <div class="hover:underline cursor-pointer" @click="select(props.task?.id ?? null)">
            {{ task?.name ?? t('topLevel') }}
        </div>
        <div class="border-l border-gray-400 pl-4">
            <ReparentFormItem v-for="child in childTasks" :task="child" @select="select" />
        </div>
    </div>
</template>
