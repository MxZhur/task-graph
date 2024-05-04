<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Graph from '../components/Graph.vue';
import Modal from '../components/Modal.vue';
import NewTaskForm from '../components/NewTaskForm.vue';
import TaskDetailsView from '../components/TaskDetailsView.vue';
import StatusBar from '../components/StatusBar.vue';
import MenuBar from '../components/MenuBar.vue';
import Tabs, { TabNavData } from '../components/Tabs.vue';
import OutlineView from '../components/OutlineView/OutlineView.vue';
import { useMainPageStore } from '../stores/mainPageStore';

const { t } = useI18n();

const tabNavs: TabNavData[] = [
    {
        id: 'graph',
        name: t('tabs.graph'),
    },
    {
        id: 'outline',
        name: t('tabs.outline'),
    },
];

const mainPageStore = useMainPageStore();

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
                <Tabs :tab-navs="tabNavs" v-model:selected-tab="mainPageStore.selectedTab">
                    <Graph v-if="mainPageStore.selectedTab === 'graph'" @new-task-request="openNewTaskForm" />
                    <OutlineView v-if="mainPageStore.selectedTab === 'outline'" />
                </Tabs>
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
