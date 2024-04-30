<script setup lang="ts">
import { reactive, ref } from 'vue';
import Graph from '../components/Graph.vue';
import Modal from '../components/Modal.vue';
import NewTaskForm from '../components/NewTaskForm.vue';
import TaskDetailsView from '../components/TaskDetailsView.vue';

const parentTaskId = ref<string | null>(null);

const newTaskFormRef = ref<InstanceType<typeof NewTaskForm>>();

function switchParentTask(newParentTaskId: string | null) {
    parentTaskId.value = newParentTaskId;
}

const showNewTaskForm = ref<boolean>(false);

const newTaskPoint = reactive({
    x: 0,
    y: 0,
});

function openNewTaskForm(nodeX: number, nodeY: number) {
    showNewTaskForm.value = true;
    newTaskPoint.x = nodeX;
    newTaskPoint.y = nodeY;
}

function closeNewTaskForm() {
    showNewTaskForm.value = false;

    newTaskFormRef.value?.resetForm();
}

</script>

<template>
    <div class="flex flex-row h-full">
        <div class="w-2/3">
            <Graph :parentTaskId="parentTaskId" @new-task-request="openNewTaskForm"
                @switch-parent-task="switchParentTask" />
        </div>
        <div class="w-1/3">
            <TaskDetailsView />
        </div>

    </div>
    <Modal :show="showNewTaskForm" @close="closeNewTaskForm">
        <NewTaskForm ref="newTaskFormRef" :parent-id="parentTaskId" :new-task-point="newTaskPoint"
            @form-submit="closeNewTaskForm" />
    </Modal>
</template>
