<script setup lang="ts">
import { reactive } from 'vue';
import { NewTaskFormFields, TASK_DIFFICULTIES, TASK_PRIORITIES, useTasksStore } from '../stores/tasksStore';
import PrioritySelector from './PrioritySelector.vue';
import DifficultySelector from './DifficultySelector.vue';

const tasksStore = useTasksStore();

const emit = defineEmits(['formSubmit']);

const props = defineProps<{
    parentId: string | null,
    newTaskPoint: {
        x: number;
        y: number;
    };
}>();

const formFields = reactive({
    name: '',
    description: '',
    priority: TASK_PRIORITIES.medium,
    difficulty: TASK_DIFFICULTIES.normal,
});

function onSubmit() {
    tasksStore.createTask(<NewTaskFormFields>{
        name: formFields.name,
        description: formFields.description,
        priority: formFields.priority,
        difficulty: formFields.difficulty,
        parentTaskId: props.parentId,
        nodeX: props.newTaskPoint.x,
        nodeY: props.newTaskPoint.y,
    });

    resetForm();

    emit('formSubmit');
}

function resetForm() {
    formFields.name = '';
    formFields.description = '';
    formFields.priority = TASK_PRIORITIES.medium;
    formFields.difficulty = TASK_DIFFICULTIES.normal;
}

defineExpose({
    resetForm
});

</script>

<template>
    <form @submit.prevent="onSubmit">
        <div class="text-2xl mb-4">Create Task</div>

        <div class="mb-4">
            <div>
                Name
            </div>
            <input type="text" class="w-full rounded-md border px-2 py-1 border-gray-500 text-base"
                v-model.trim="formFields.name" required placeholder="Name" />
        </div>

        <div class="mb-4">
            <div>
                Description
            </div>
            <textarea class="block w-full rounded-md border px-2 py-1 border-gray-500 text-base"
                v-model="formFields.description"></textarea>
        </div>

        <div class="flex flex-row gap-8">
            <div class="mb-4">
                <div>
                    Priority
                </div>
                <PrioritySelector v-model="formFields.priority" />
            </div>
    
            <div class="mb-4">
                <div>
                    Difficulty
                </div>
                <DifficultySelector v-model="formFields.difficulty" />
            </div>
        </div>

        <button type="submit" class="w-full rounded-md text-white bg-green-700 hover:bg-green-900 p-2">
            Create
        </button>
    </form>
</template>
