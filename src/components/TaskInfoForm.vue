<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { Task, useTasksStore } from '../stores/tasksStore';
import PrioritySelector from './PrioritySelector.vue';
import DifficultySelector from './DifficultySelector.vue';
import CheckIcon from './icons/CheckIcon.vue';
import TrashIcon from './icons/TrashIcon.vue';

const tasksStore = useTasksStore();

const props = defineProps<{
    task: Task
}>();

const formFields = reactive({
    name: props.task.name,
    description: props.task.description,
    progress: props.task.progress,
    priority: props.task.priority,
    difficulty: props.task.difficulty,
});

const hasChildTasks = computed(() => {
    return tasksStore.findTasksByParent(props.task.id).length > 0;
});

watch(() => props.task,
    () => {
        formFields.name = props.task.name;
        formFields.description = props.task.description;
        formFields.progress = props.task.progress;
        formFields.priority = props.task.priority;
        formFields.difficulty = props.task.difficulty;
    }
);

function changeName() {
    if (formFields.name.length === 0) {
        return;
    }
    tasksStore.updateName(props.task.id, formFields.name);
}

function changeDescription() {
    tasksStore.updateDescription(props.task.id, formFields.description);
}

function changeProgress() {
    tasksStore.updateProgress(props.task.id, formFields.progress);
}

function markAsDone() {
    formFields.progress = 100;
    tasksStore.markTasksAsDone([props.task.id]);
}

function changePriority(newValue: number) {
    tasksStore.updatePriority(props.task.id, newValue);
}

function changeDufficulty(newValue: number) {
    tasksStore.updateDufficulty(props.task.id, newValue);
}

function deleteTask() {
    tasksStore.deleteTask(props.task.id);
    tasksStore.updateTaskSelection([]);
}

</script>

<template>
    <div>
        <div class="text-2xl mb-4">Task Details</div>

        <div class="mb-4">
            <div>
                Name
            </div>
            <input type="text" class="w-full rounded-md border px-2 py-1 border-gray-500 text-base"
                v-model.trim="formFields.name" @input="changeName" required placeholder="Name" />
        </div>

        <div class="mb-4">
            <div>
                Description
            </div>
            <textarea class="block w-full rounded-md border px-2 py-1 border-gray-500 text-base"
                v-model="formFields.description" @input="changeDescription"></textarea>
        </div>

        <div class="mb-4">
            <div>
                Progress
            </div>
            <div v-if="hasChildTasks">
                {{ formFields.progress }}%
            </div>
            <div v-else class="flex flex-row">
                <button type="button" title="Mark as done"
                    class="rounded-md text-white bg-green-700 hover:bg-green-900 px-2 py-1 h-8 mr-2"
                    @click="markAsDone">
                    <CheckIcon />
                </button>
                <div class="w-full">
                    <input :disabled="hasChildTasks" type="range" min="0" max="100" step="5" class="w-full"
                        v-model="formFields.progress" @input="changeProgress" />
                    <div>
                        {{ formFields.progress }}%
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-4">
            <div>
                Priority
            </div>
            <PrioritySelector v-model="formFields.priority" @change="changePriority" />
        </div>

        <div class="mb-4">
            <div>
                Difficulty
            </div>
            <DifficultySelector v-model="formFields.difficulty" @change="changeDufficulty" />
        </div>

        <div class="mt-8">
            <button type="button"
                class="w-full flex flex-row rounded-md justify-center items-center text-white bg-red-700 hover:bg-red-900 px-2 py-1"
                @click="deleteTask">
                <TrashIcon /> Delete
            </button>
        </div>
    </div>
</template>
