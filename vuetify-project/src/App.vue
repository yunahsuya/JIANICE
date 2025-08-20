<template>
  <v-app>
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="cachedPages">
        <component :is="Component" :key="route.name" />
      </keep-alive>
    </router-view>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'

  // 需要快取的頁面組件名稱
  const cachedPages = ref(['Hpanews'])
</script>
