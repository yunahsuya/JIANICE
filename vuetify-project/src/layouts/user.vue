<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item :prepend-avatar="`https://api.dicebear.com/9.x/thumbs/png/seed=${user.account}`" :title="user.account" />
    </v-list>
    <v-divider />
    <v-list>
      <v-list-item
        v-for="item of navItems"
        :key="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
      />
    </v-list>
  </v-navigation-drawer>
  <v-main>
    <router-view />
  </v-main>
</template>

<script setup>
  import { useUserStore } from '@/stores/user'

  const user = useUserStore()

  const navItems = [
    { title: '基本資訊管理', to: '/user/info', icon: 'mdi-account-edit' },
    { title: '餐廳收藏查詢', to: '/user/collect', icon: 'mdi-silverware-fork-knife' },
    { title: '回憶錄管理', to: '/user/diary', icon: 'mdi-book-heart-outline' },
    { title: '前端首頁', to: '/', icon: 'mdi-home' },
  ]
</script>
