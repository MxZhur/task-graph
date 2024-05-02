<script setup lang="ts">
import { reactive } from 'vue';
import { NewTaskFormFields, TASK_DIFFICULTIES, TASK_PRIORITIES, useTasksStore } from '../stores/tasksStore';
import PrioritySelector from './PrioritySelector.vue';
import DifficultySelector from './DifficultySelector.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const tasksStore = useTasksStore();

const emit = defineEmits(['formSubmit']);

const props = defineProps<{
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
        parentTaskId: tasksStore.selectedParentTaskId,
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
        <div class="text-2xl mb-4">
            {{ t('titles.createTask')}}
        </div>

        <div class="mb-4">
            <div class="text-xs">
                {{ t('formFields.name') }}
            </div>
            <input type="text" class="w-full rounded-md border px-2 py-1 border-gray-500 text-base"
                v-model.trim="formFields.name" required :placeholder="t('formFields.name')" autocomplete="off" />
        </div>

        <div class="mb-4">
            <div class="text-xs">
                {{ t('formFields.description') }}
                
            </div>
            <textarea class="block w-full rounded-md border px-2 py-1 border-gray-500 text-base"
                v-model="formFields.description"></textarea>
        </div>

        <div class="flex flex-row gap-8">
            <div class="mb-4">
                <div class="text-xs">
                    {{ t('formFields.priority') }}
                    
                </div>
                <PrioritySelector v-model="formFields.priority" />
            </div>

            <div class="mb-4">
                <div class="text-xs">
                    {{ t('formFields.difficulty') }}
                    
                </div>
                <DifficultySelector v-model="formFields.difficulty" />
            </div>
        </div>

        <button type="submit" class="w-full rounded-md text-white bg-green-700 hover:bg-green-900 p-2">
            {{ t('create') }}
        </button>
    </form>
</template>
