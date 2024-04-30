<script setup lang="ts">
import { useTasksStore } from '../stores/tasksStore';

const tasksStore = useTasksStore();

</script>

<template>
    <div class="bg-white w-full h-full p-3 border-l border-gray-300">
        <template v-if="tasksStore.selectedTasks.length === 1">
            <div class="h-full border border-dashed border-gray-500 rounded-3xl flex flex-col justify-center items-center">
                Task Info
            </div>
        </template>
        <template v-else-if="tasksStore.selectedTasks.length > 1">
            <div class="h-full border border-dashed border-gray-500 rounded-3xl flex flex-col justify-center items-center">
                Multiple Task Info
            </div>
        </template>
        <template v-else>
            <div class="h-full border border-dashed border-gray-500 rounded-3xl flex flex-col justify-center items-center">
                Select a task on the graph.
            </div>
        </template>
    </div>
</template>
