<template>
  <v-container class="h-100">
    <v-row align="center" class="h-100" justify="center">
      <v-col class="text-center" cols="12">
        <v-icon size="x-large">mdi-heart-cog-outline</v-icon>
        <h1>健康天地</h1>
        <p>💚歡迎來到 JIANOCE 健康天地！💚</p>
        <p>這裡，是你照顧自己的開始 💫</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="yaml">
  meta:
    layout: 'user'
    # 標題
    title: '健康天地'
    # 只能在登入的情況下看
    login: 'login-only'
</route>
