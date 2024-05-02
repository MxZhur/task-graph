<script setup lang="ts">
import { useRouter } from 'vue-router';
import { APP_AUTHOR, APP_RELEASE_YEAR, APP_VERSION } from '../utils/appInfo';
import AppLogo from '../components/AppLogo.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const router = useRouter()

const goBack = () => {
    router.go(-1)
    APP_AUTHOR
}
</script>

<template>
    <div class="h-full bg-white flex flex-col justify-center items-center">
        <div class="mb-4">
            <AppLogo />
        </div>

        <div class="mb-4">
            {{ t('aboutPage.version') }} {{ APP_VERSION }}
        </div>

        <div>
            {{ APP_RELEASE_YEAR }} &#169; {{ APP_AUTHOR }}
        </div>

        <div>
            {{ t('aboutPage.madeWith') }}
            <a href="https://vuejs.org/" target="_blank">
                Vue
            </a>
            +
            <a href="https://tauri.app" target="_blank">
                Tauri
            </a>
        </div>

        <div>
            <a href="https://github.com/MxZhur/task-graph" target="_blank">
                {{ t('aboutPage.githubPage') }}
            </a>
        </div>

        <div class="mt-4">
            <button @click="goBack"
                class="flex flex-row rounded-md justify-center items-center text-white bg-sky-500 hover:bg-sky-700 px-2 py-1">
                {{ t('back') }}
            </button>
        </div>
    </div>
</template>

<style scoped>
a {
    color: #0055ff;
}
</style>
