<script setup lang="ts">
import { useTasksStore } from '../stores/tasksStore';

const tasksStore = useTasksStore();

</script>

<template>
    <div class="h-8 border-t text-sm px-2 border-gray-300 bg-white flex flex-row justify-between items-center">
        Project Progress: {{ tasksStore.overallProjectProgress.toString() }}%
    </div>
</template>

<style scoped></style>