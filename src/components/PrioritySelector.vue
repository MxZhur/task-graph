<script setup lang="ts">
import { TASK_PRIORITIES } from '../stores/tasksStore';
import FireIcon from './icons/FireIcon.vue';
import FlagIcon from './icons/FlagIcon.vue';
import WarningIcon from './icons/WarningIcon.vue';

const model = defineModel<number>({ required: true });

const emit = defineEmits<{
    (e: 'change', newValue: number): void
}>();

function setValue(newValue: number) {
    model.value = newValue;

    emit('change', newValue);
}

</script>

<template>
    <div>
        <button type="button" @click.prevent="setValue(TASK_PRIORITIES.none)" title="None"
            class="border border-gray-400 rounded-s-lg p-2" :class="{ active: model === TASK_PRIORITIES.none }">
            <span class="text-gray-500">
                <FlagIcon />
            </span>
        </button>

        <button type="button" @click.prevent="setValue(TASK_PRIORITIES.low)" title="Low"
            class="border-t border-b border-gray-400 p-2" :class="{ active: model === TASK_PRIORITIES.low }">
            <span class="text-sky-300">
                <FlagIcon />
            </span>
        </button>

        <button type="button" @click.prevent="setValue(TASK_PRIORITIES.medium)" title="Meduim"
            class="border border-gray-400 p-2" :class="{ active: model === TASK_PRIORITIES.medium }">
            <span class="text-green-600">
                <FlagIcon />
            </span>
        </button>

        <button type="button" @click.prevent="setValue(TASK_PRIORITIES.high)" title="High"
            class="border-t border-b border-gray-400 p-2" :class="{ active: model === TASK_PRIORITIES.high }">
            <span class="text-yellow-500">
                <WarningIcon />
            </span>
        </button>

        <button type="button" @click.prevent="setValue(TASK_PRIORITIES.critical)" title="Critical"
            class="border border-gray-400 rounded-e-lg p-2" :class="{ active: model === TASK_PRIORITIES.critical }">
            <span class="text-red-600">
                <FireIcon />
            </span>
        </button>
    </div>
</template>

<style scoped>
.active {
    background-color: #c0c0c0;
}
</style>