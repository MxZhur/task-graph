<script setup lang="ts">

export type TabNavData = {
    id: string;
    name: string;
};

const selectedTab = defineModel<string>('selectedTab');

defineProps<{
    tabNavs: TabNavData[];
}>();

function switchTab(newTab: string) {
    selectedTab.value = newTab;
}

</script>

<template>
    <div class="tabs-container">
        <div class="min-h-6 flex flex-row justify-start items-end">
            <div v-for="tabNav in tabNavs" :key="tabNav.id" @click="switchTab(tabNav.id)"
                class="px-2 rounded-t-lg bg-gray-300 cursor-pointer hover:underline"
                :class="{ active_tab: selectedTab === tabNav.id }">
                {{ tabNav.name }}
            </div>
        </div>
        <div class="tabs-content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.active_tab {
    background-color: white;
}

.tabs-container {
    height: calc(100% - 1.5rem);
}

.tabs-content {
    height: 100%;
}
</style>
