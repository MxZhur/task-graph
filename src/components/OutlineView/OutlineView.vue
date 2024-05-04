<script setup lang="ts">
import { computed, ref } from 'vue';
import { Task, useTasksStore } from '../../stores/tasksStore';
import OutlineItem from './OutlineItem.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const tasksStore = useTasksStore();

const showAgenda = ref<boolean>(false);

const availableTasks = computed(() => {
    let tasks: Task[];

    if (showAgenda.value) {
        tasks = [...tasksStore.agendaTasks];
    } else {
        tasks = [...tasksStore.tasks];
    }

    tasks.sort((a, b) => {
        if (a.priority < b.priority) {
            return -1;
        } else if (a.priority > b.priority) {
            return 1;
        }

        if (a.nodeX < b.nodeX) {
            return -1;
        } else if (a.nodeX > b.nodeX) {
            return 1;
        }

        if (a.nodeY < b.nodeY) {
            return -1;
        } else if (a.nodeY > b.nodeY) {
            return 1;
        }

        return 0;
    });

    return tasks;
});

const topLevelTasks = computed(() => {
    return availableTasks.value.filter(t => t.parentTaskId === null);
});

</script>

<template>
    <div class="h-full bg-white p-2 overflow-y-scroll">
        <template v-if="topLevelTasks.length > 0">
            <div class="flex flex-row justify-start items-center" :title="t('showAgendaTooltip')">
                <input type="checkbox" id="showAgendaCheckbox" v-model="showAgenda" />
                <label for="showAgendaCheckbox" class="text-sm">
                    &nbsp;{{ t('showAgenda') }}
                </label>
            </div>
            <hr>
            <OutlineItem v-for="topLevelTask in topLevelTasks" :key="topLevelTask.id" :task="topLevelTask"
                :available-tasks="availableTasks" />
        </template>

        <template v-else>
            <div class="h-full border border-dashed border-gray-500 rounded-3xl flex flex-col justify-center items-center p-4 text-center text-sm text-gray-700">
                <div>
                    {{ t('noTasks') }}
                </div>
            </div>
        </template>

    </div>
</template>