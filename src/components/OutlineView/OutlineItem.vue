<script setup lang="ts">
import { computed } from 'vue';
import { Task, useTasksStore } from '../../stores/tasksStore';

const tasksStore = useTasksStore();

const props = defineProps<{
    availableTasks: Task[];
    task: Task;
}>();

const childTasks = computed(() => {
    return props.availableTasks.filter(t => t.parentTaskId === props.task.id);
});

function selectTask() {
    tasksStore.updateTaskSelection([props.task.id]);
    tasksStore.switchParentTask(props.task.parentTaskId);
}

const isSelected = computed(() => {
    return tasksStore.selectedTasksIds.includes(props.task.id);
});

</script>

<template>
    <div class="pl-1">
        <div class="py-1 my-1 pl-3 cursor-pointer overflow-x-hidden text-ellipsis" :class="{active_task: isSelected}" @click="selectTask()">
            {{ task.name }}
        </div>
        <div class="ml-4 border-l border-gray-400">
            <OutlineItem v-for="childTask in childTasks" :key="childTask.id" :task="childTask"
            :available-tasks="availableTasks" />
        </div>
    </div>
</template>

<style scoped>
.active_task {
    border-radius: 0.5rem;
    color: white;
    background-color: #2a68b9;
}
</style>