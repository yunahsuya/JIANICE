<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">健康新聞</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="yaml">
  meta:
    # 標題
    title: '健康新聞'
    # 只能在登入的情況下看
    login: 'login-only'
    # 只有管理員能看
    admin: false
</route>
