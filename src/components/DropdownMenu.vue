<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const dropdown = ref<HTMLElement|null>(null);

const show = ref<boolean>(false);

function toggleDropdown() {
    show.value = !show.value;
}

function closeDropdown(event: MouseEvent) {
    if (!dropdown.value?.contains(event.target as Node)) {
        show.value = false;
    }
}

onMounted(() => {
    window.addEventListener('click', closeDropdown);
});
onBeforeUnmount(() => {
    window.removeEventListener('click', closeDropdown);
});

</script>

<template>
    <div class="z-50 relative">
        <div class="cursor-pointer mr-4" ref="dropdown" @click="toggleDropdown">
            <slot name="item"></slot>
        </div>

        <div v-if="show" class="bg-white absolute top-full left-0 p-4 rounded-sm shadow-md text-nowrap w-auto">
            <slot name="menu"></slot>
        </div>
    </div>
</template>
