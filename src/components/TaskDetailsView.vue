<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useTasksStore } from '../stores/tasksStore';
import MultiLinkInfoForm from './MultiLinkInfoForm.vue';
import MultiTaskInfoForm from './MultiTaskInfoForm.vue';
import TaskInfoForm from './TaskInfoForm.vue';
import Modal from './Modal.vue';
import { ref } from 'vue';
import ReparentForm from './ReparentForm/ReparentForm.vue';

const tasksStore = useTasksStore();

const { t } = useI18n();

const showReparentForm = ref<boolean>(false);

function openReparentForm() {
    showReparentForm.value = true;
}

function closeReparentForm() {
    showReparentForm.value = false;
}

</script>

<template>
    <div class="bg-white w-full h-full p-3 border-l border-gray-300">
        <template v-if="tasksStore.selectedTasks.length === 1">
            <TaskInfoForm :task="tasksStore.selectedTasks[0]!" @reparentRequest="openReparentForm" />
        </template>
        <template v-else-if="tasksStore.selectedTasks.length > 1">
            <MultiTaskInfoForm :tasks="tasksStore.selectedTasks" @reparentRequest="openReparentForm" />
        </template>
        <template v-else-if="tasksStore.selectedLinks.length > 0">
            <MultiLinkInfoForm :links="tasksStore.selectedLinks" />
        </template>
        <template v-else>
            <div
                class="h-full border border-dashed border-gray-500 rounded-3xl flex flex-col justify-center items-center p-4 text-center text-sm text-gray-700">
                <div>
                    {{ t('selectTaskHint.selectTask') }}
                </div>
                <div>
                    {{ t('selectTaskHint.holdShift') }}
                </div>
                <div class="mt-4">
                    {{ t('selectTaskHint.doubleClick') }}
                </div>
            </div>
        </template>

        <Modal :show="showReparentForm" @close="closeReparentForm">
            <ReparentForm @form-submit="closeReparentForm" />
        </Modal>
    </div>
</template>
