<script setup lang="ts">
import { TASK_DIFFICULTIES } from '../stores/tasksStore';
import SignalFullIcon from './icons/SignalFullIcon.vue';
import SignalLowIcon from './icons/SignalLowIcon.vue';
import SignalMediumIcon from './icons/SignalMediumIcon.vue';

defineProps<{
    value: number;
}>();

const emit = defineEmits<{
    (e: 'change', newValue: number): void
}>();

function setValue(newValue: number) {
    emit('change', newValue);
}

</script>

<template>
    <div>
        <button type="button" @click.prevent="setValue(TASK_DIFFICULTIES.easy)" title="Easy"
            class="border border-gray-400 rounded-s-lg p-2" :class="{ active: value === TASK_DIFFICULTIES.easy }">
            <span class="text-sky-300">
                <SignalLowIcon />
            </span>
        </button>

        <button type="button" @click.prevent="setValue(TASK_DIFFICULTIES.normal)" title="Normal"
            class="border-t border-b border-gray-400 p-2" :class="{ active: value === TASK_DIFFICULTIES.normal }">
            <span class="text-green-600">
                <SignalMediumIcon />
            </span>
        </button>

        <button type="button" @click.prevent="setValue(TASK_DIFFICULTIES.hard)" title="Hard"
            class="border border-gray-400 rounded-e-lg p-2" :class="{ active: value === TASK_DIFFICULTIES.hard }">
            <span class="text-red-600">
                <SignalFullIcon />
            </span>
        </button>
    </div>
</template>

<style scoped>
.active {
    background-color: #c0c0c0;
}
</style>