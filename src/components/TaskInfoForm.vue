<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { Task, useTasksStore } from '../stores/tasksStore';
import PrioritySelector from './PrioritySelector.vue';
import DifficultySelector from './DifficultySelector.vue';
import CheckIcon from './icons/CheckIcon.vue';
import TrashIcon from './icons/TrashIcon.vue';
import DiveInIcon from './icons/DiveInIcon.vue';
import { useI18n } from 'vue-i18n';
import { useMainPageStore } from '../stores/mainPageStore';
import ReparentIcon from './icons/ReparentIcon.vue';

const { t } = useI18n();

const tasksStore = useTasksStore();
const mainPageStore = useMainPageStore();

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

const emit = defineEmits(['reparentRequest']);

function reparentRequest() {
    emit('reparentRequest');
}

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

function diveIn() {
    tasksStore.switchParentTask(props.task.id);
}

function deleteTask() {
    tasksStore.deleteTask(props.task.id);
    tasksStore.updateTaskSelection([]);
}

</script>

<template>
    <div class="h-full overflow-y-scroll">
        <div class="text-xl mb-4">
            {{ t('titles.taskDetails') }}
        </div>

        <div class="mb-4">
            <div class="text-xs">
                {{ t('formFields.name') }}
            </div>
            <input type="text" class="w-full rounded-md border px-2 py-1 border-gray-500 text-base"
                v-model.trim="formFields.name" autocomplete="off" @input="changeName" required
                :placeholder="t('formFields.name')" />
        </div>

        <div class="mb-4">
            <div class="text-xs">
                {{ t('formFields.description') }}
            </div>
            <textarea class="block w-full rounded-md border px-2 py-1 border-gray-500 text-base"
                v-model="formFields.description" @input="changeDescription"></textarea>
        </div>

        <div class="mb-4">
            <div class="text-xs">
                {{ t('formFields.progress') }}
            </div>
            <div v-if="hasChildTasks">
                {{ formFields.progress }}%
            </div>
            <div v-else class="flex flex-row">
                <button type="button" :title="t('buttons.markAsDone')"
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
            <div class="text-xs">
                {{ t('formFields.priority') }}
            </div>
            <PrioritySelector v-model="formFields.priority" @change="changePriority" />
        </div>

        <div class="mb-4">
            <div class="text-xs">
                {{ t('formFields.difficulty') }}
            </div>
            <DifficultySelector v-model="formFields.difficulty" @change="changeDufficulty" />
        </div>

        <div class="mt-4" v-if="mainPageStore.selectedTab === 'graph'">
            <button type="button"
                class="w-full flex flex-row rounded-md justify-center items-center text-white bg-sky-700 hover:bg-sky-900 px-2 py-1"
                @click="diveIn">
                <DiveInIcon /> {{ t('buttons.diveIn') }}
            </button>
        </div>
                
        <div class="mt-4">
            <button type="button"
                class="w-full flex flex-row rounded-md justify-center items-center text-white bg-sky-700 hover:bg-sky-900 px-2 py-1"
                @click="reparentRequest">
                <ReparentIcon /> {{ t('buttons.reparent') }}
            </button>
        </div>

        <div class="mt-8">
            <button type="button"
                class="w-full flex flex-row rounded-md justify-center items-center text-white bg-red-700 hover:bg-red-900 px-2 py-1"
                @click="deleteTask">
                <TrashIcon /> {{ t('delete') }}
            </button>
        </div>
    </div>
</template>
