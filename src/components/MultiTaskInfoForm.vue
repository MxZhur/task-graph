<script setup lang="ts">
import { computed } from 'vue';
import { Task, useTasksStore } from '../stores/tasksStore';
import CheckIcon from './icons/CheckIcon.vue';
import TrashIcon from './icons/TrashIcon.vue';
import { useI18n } from 'vue-i18n';
import ReparentIcon from './icons/ReparentIcon.vue';

const { t } = useI18n();

const tasksStore = useTasksStore();

const props = defineProps<{
    tasks: (Task | undefined)[]
}>();

const tasksNames = computed(() => {
    return props.tasks.map(t => {
        if (t !== undefined) {
            return t.name;
        } else {
            return '';
        }
    })
});

function linkInChain() {
    for (let i = 1; i < props.tasks.length; i++) {
        const depTask = props.tasks[i - 1];
        const task = props.tasks[i];

        if (depTask === undefined || task === undefined) {
            continue;
        }
        tasksStore.addDependency(depTask.id, task.id);
    }
}

function markAsDone() {
    tasksStore.markTasksAsDone(props.tasks.map(t => {
        if (t !== undefined) {
            return t.id;
        } else {
            return '';
        }
    }));
}

function deleteTasks() {
    for (let i = 0; i < props.tasks.length; i++) {
        const task = props.tasks[i];

        if (task === undefined) {
            continue;
        }

        tasksStore.deleteTask(task.id);
    }

    tasksStore.updateTaskSelection([]);
}

const emit = defineEmits(['reparentRequest']);

function reparentRequest() {
    emit('reparentRequest');
}


</script>

<template>
    <div>
        <div class="text-xl mb-4">
            {{ t('titles.multipleTasks') }}
        </div>

        <div class="mb-4">
            <ul>
                <li v-for="taskName in tasksNames" class="overflow-hidden text-ellipsis" :title="taskName">
                    {{ taskName }}
                </li>
            </ul>
        </div>

        <div class="mt-4">
            <button type="button"
                class="w-full flex flex-row rounded-md justify-center items-center text-white bg-sky-700 hover:bg-sky-900 px-2 py-1"
                @click="linkInChain">
                {{ t(tasks.length === 2 ? "buttons.linkTasks" : "buttons.linkTasksInChain") }}
            </button>
        </div>

        <div class="mt-4">
            <button type="button"
                class="w-full flex flex-row rounded-md justify-center items-center text-white bg-green-700 hover:bg-green-900 px-2 py-1"
                @click="markAsDone">
                <CheckIcon /> {{ t('buttons.markAllAsDone') }}
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
                @click="deleteTasks">
                <TrashIcon /> {{ t('buttons.deleteAll') }}
            </button>
        </div>
    </div>
</template>
