<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Task, useTasksStore } from '../stores/tasksStore';
import ArrowDownIcon from './icons/ArrowDownIcon.vue';
import TrashIcon from './icons/TrashIcon.vue';

const { t } = useI18n();

const tasksStore = useTasksStore();

const props = defineProps<{
    links: ({ source: Task, target: Task } | null)[]
}>();

function deleteLinks() {
    for (let i = 0; i < props.links.length; i++) {
        const link = props.links[i];

        if (link === null) {
            continue;
        }

        tasksStore.removeDependency(link.source.id, link.target.id);
    }

    tasksStore.updateLinkSelection([]);
}

</script>

<template>
    <div>
        <div class="text-xl mb-4">
            {{ t(links.length > 1 ? "titles.multipleLinks" : "titles.linkDetails") }}
        </div>

        <div class="mb-4">
            <ul>
                <li v-for="link in links" class="overflow-hidden text-ellipsis my-2">
                    <div class="overflow-hidden text-ellipsis" :title="link?.source.name">
                        {{ link?.source.name }}
                    </div>
                    <ArrowDownIcon />
                    <div class="overflow-hidden text-ellipsis" :title="link?.target.name">
                        {{ link?.target.name }}
                    </div>
                    <hr>
                </li>
            </ul>
        </div>

        <div class="mt-8">
            <button type="button"
                class="w-full flex flex-row rounded-md justify-center items-center text-white bg-red-700 hover:bg-red-900 px-2 py-1"
                @click="deleteLinks">
                <TrashIcon /> {{ t(links.length > 1 ? "buttons.unlinkAll" : "buttons.unlink") }}
            </button>
        </div>
    </div>
</template>
