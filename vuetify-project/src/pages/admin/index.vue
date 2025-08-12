<template>
  <v-container class="h-100">
    <v-row align="center" class="h-100" justify="center">
      <v-col class="text-center" cols="12">
        <v-icon size="x-large">mdi-cog</v-icon>
        <h1>管理首頁</h1>
        <p>歡迎來到管理後台！</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="yaml">
  meta:
    layout: 'admin'
    # 標題
    title: '管理首頁'
    # 只能在登入的情況下看
    login: 'login-only'
    # 只有管理員能看
    admin: true
</route>
