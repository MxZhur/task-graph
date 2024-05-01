<script setup lang="ts">
import { reactive, ref } from 'vue';
import Graph from '../components/Graph.vue';
import Modal from '../components/Modal.vue';
import NewTaskForm from '../components/NewTaskForm.vue';
import TaskDetailsView from '../components/TaskDetailsView.vue';
import StatusBar from '../components/StatusBar.vue';
import MenuBar from '../components/MenuBar.vue';

const newTaskFormRef = ref<InstanceType<typeof NewTaskForm>>();

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
    <div class="h-full">
        <MenuBar />
        <div class="flex flex-row task-graph-container">
            <div class="w-2/3">
                <Graph @new-task-request="openNewTaskForm" />
            </div>
            <div class="w-1/3">
                <TaskDetailsView />
            </div>
        </div>
        <StatusBar />
    </div>
    <Modal :show="showNewTaskForm" @close="closeNewTaskForm">
        <NewTaskForm ref="newTaskFormRef" :new-task-point="newTaskPoint" @form-submit="closeNewTaskForm" />
    </Modal>
</template>

<style scoped>
.task-graph-container {
    height: calc(100% - 4rem);
}
</style>
