<script setup lang="ts">
import { Task, useTasksStore } from '../stores/tasksStore';
import ArrowDownIcon from './icons/ArrowDownIcon.vue';
import TrashIcon from './icons/TrashIcon.vue';

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
        <div class="text-2xl mb-4">{{links.length > 1 ? "Multiple Links" : "Link Details"}}</div>

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
                <TrashIcon /> {{links.length > 1 ? "Unlink All" : "Unlink"}}
            </button>
        </div>
    </div>
</template>
