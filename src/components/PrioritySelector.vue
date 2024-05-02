<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { TASK_PRIORITIES } from '../stores/tasksStore';
import FireIcon from './icons/FireIcon.vue';
import FlagIcon from './icons/FlagIcon.vue';
import WarningIcon from './icons/WarningIcon.vue';

const { t } = useI18n();

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
        <button type="button" @click.prevent="setValue(TASK_PRIORITIES.none)" :title="t('priorities.none')"
            class="border border-gray-400 rounded-s-lg p-2" :class="{ active: model === TASK_PRIORITIES.none }">
            <span class="text-gray-500">
                <FlagIcon />
            </span>
        </button>

        <button type="button" @click.prevent="setValue(TASK_PRIORITIES.low)" :title="t('priorities.low')"
            class="border-t border-b border-gray-400 p-2" :class="{ active: model === TASK_PRIORITIES.low }">
            <span class="text-sky-300">
                <FlagIcon />
            </span>
        </button>

        <button type="button" @click.prevent="setValue(TASK_PRIORITIES.medium)" :title="t('priorities.medium')"
            class="border border-gray-400 p-2" :class="{ active: model === TASK_PRIORITIES.medium }">
            <span class="text-green-600">
                <FlagIcon />
            </span>
        </button>

        <button type="button" @click.prevent="setValue(TASK_PRIORITIES.high)" :title="t('priorities.high')"
            class="border-t border-b border-gray-400 p-2" :class="{ active: model === TASK_PRIORITIES.high }">
            <span class="text-yellow-500">
                <WarningIcon />
            </span>
        </button>

        <button type="button" @click.prevent="setValue(TASK_PRIORITIES.critical)" :title="t('priorities.critical')"
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