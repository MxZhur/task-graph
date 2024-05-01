<template>
    <div class="app-logo-container">
        <div class="app-logo-image">
            <!-- <img src="../assets/icon.svg" height="200" /> -->
        </div>
        <div class="app-logo-text">
            <div>Task</div>
            <div>Graph</div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-logo-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.app-logo-image {
    margin-right: 15px;
}

.app-logo-text {
    font-size: 3rem;
    color: #258fe6;
    line-height: 3.5rem;
}
</style>