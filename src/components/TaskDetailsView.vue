<script setup lang="ts">
import { useTasksStore } from '../stores/tasksStore';
import MultiLinkInfoForm from './MultiLinkInfoForm.vue';
import MultiTaskInfoForm from './MultiTaskInfoForm.vue';
import TaskInfoForm from './TaskInfoForm.vue';

const tasksStore = useTasksStore();

</script>

<template>
    <div class="bg-white w-full h-full p-3 border-l border-gray-300">
        <template v-if="tasksStore.selectedTasks.length === 1">
            <TaskInfoForm :task="tasksStore.selectedTasks[0]!" />
        </template>
        <template v-else-if="tasksStore.selectedTasks.length > 1">
            <MultiTaskInfoForm :tasks="tasksStore.selectedTasks" />
        </template>
        <template v-else-if="tasksStore.selectedLinks.length > 0">
            <MultiLinkInfoForm :links="tasksStore.selectedLinks" />
        </template>
        <template v-else>
            <div class="h-full border border-dashed border-gray-500 rounded-3xl flex flex-col justify-center items-center">
                Select a task on the graph.
            </div>
        </template>
    </div>
</template>
