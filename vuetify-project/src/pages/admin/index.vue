<template>
  <v-container class="h-100">
    <v-row align="center" class="h-100" justify="center">
      <v-col class="text-center" cols="12">
        <v-progress-circular
          indeterminate
          color="orange-darken-2"
          size="64"
        />
        <p class="mt-4">正在載入...</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // 自動重定向到基本資訊管理頁面
  router.replace('/admin/users')
})
</script>

<route lang="yaml">
  meta:
    layout: 'user'
    # 標題
    title: '管理者後台'
    # 只能在登入的情況下看
    login: 'login-only'
</route>
