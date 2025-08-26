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
    { title: '餐廳管理', to: '/admin/products', icon: 'mdi-silverware-fork-knife' },
    { title: '餐廳管理2', to: '/admin/restaurants', icon: 'mdi-silverware-fork-knife' },
    { title: '使用者', to: '/admin/orders', icon: 'mdi-account-edit' },
    { title: '使用者管理', to: '/admin/users', icon: 'mdi-account-edit' },

    { title: '前端首頁', to: '/', icon: 'mdi-home' },
  ]
</script>
