<script setup lang="ts">
import { computed } from 'vue';
import { useTasksStore } from '../stores/tasksStore';
import HomeIcon from './icons/HomeIcon.vue';

const tasksStore = useTasksStore();

const emit = defineEmits<{
    (e: 'switchParentTask', parentId: string | null): void
}>();

const links = computed(() => {
    if (tasksStore.selectedParentTaskId === null) {
        return [];
    }

    let result: {
        id: string;
        name: string;
    }[] = [];

    let parentTaskIdPointer: string | null = tasksStore.selectedParentTaskId;

    while (parentTaskIdPointer !== null) {
        let task = tasksStore.findTaskById(parentTaskIdPointer);

        if (task === undefined) {
            break;
        }

        result.unshift({
            id: task.id,
            name: task.name,
        });

        parentTaskIdPointer = task.parentTaskId;
    }

    return result;
});

function switchParentTask(newParentId: string | null) {
    tasksStore.switchParentTask(newParentId);
}

</script>

<template>
    <div class="p-2 bg-white min-h-8 flex flex-row justify-start overflow-x-hidden">
        <div class="cursor-pointer" @click="switchParentTask(null)" title="Top Level">
            <HomeIcon />
        </div>

        <template v-for="link in links" :key="link.id">
            <span class="text-gray-400 unselectable">
                &nbsp;/&nbsp;
            </span>
            <span class="hover:underline cursor-pointer max-w-20 overflow-hidden text-ellipsis text-nowrap" :title="link.name"
                @click="switchParentTask(link.id)">
                {{ link.name }}
            </span>
        </template>
    </div>
</template>