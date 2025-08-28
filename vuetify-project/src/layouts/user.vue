<template>
  <v-app>
    <!-- 頂部導航欄 -->
    <v-app-bar
      color="orange-darken-4"
      elevation="2"
      class="border-b"
    >
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        class="d-md-none"
      />

      <v-app-bar-title class="d-flex align-center">
        <v-icon
          icon="mdi-account-circle"
          size="28"
          class="me-3"
        />
        <span class="text-h6 font-weight-bold">用戶中心</span>
      </v-app-bar-title>

      <v-spacer />

      <!-- 用戶資訊 -->
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            class="d-flex align-center"
          >
            <v-avatar
              size="32"
              class="me-2"
            >
              <v-img :src="`https://api.dicebear.com/9.x/thumbs/png/seed=${user.account}`" />
            </v-avatar>
            <span class="text-body-2">{{ user.account }}</span>
            <v-icon icon="mdi-chevron-down" class="ms-1 me-5" />
          </v-btn>
        </template>

        <v-list width="150">
          <!-- 登出 -->
          <v-list-item
            prepend-icon="mdi-logout"
            title="登出"
            @click="handleLogout"
          />
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- 側邊導航欄 -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="$vuetify.display.mdAndUp"
      :temporary="$vuetify.display.smAndDown"
      color="surface"
      class="border-e d-flex flex-column"
      elevation="3"
    >
      <!-- 側邊欄標題 -->
      <div class="pa-4 flex-shrink-0">
        <div class="d-flex align-center">
          <v-icon
            icon="mdi-account-circle"
            size="32"
            color="orange-darken-2"
            class="me-3"
          />
          <div>
            <div class="text-h6 font-weight-bold text-orange-darken-2">用戶中心</div>
            <div class="text-caption text-medium-emphasis">User Center</div>
          </div>
        </div>
      </div>

      <v-divider class="mx-2 mb-2 flex-shrink-0" />

      <!-- 導航選單 -->
      <v-list class="pa-3 flex-grow-1">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          class="rounded-lg"
          variant="text"
          color="orange-darken-3"
          active-class="bg-orange-lighten-4 text-orange-darken-2 font-weight-black"
        />
      </v-list>

      <!-- 底部快速連結 -->
      <div class="pa-4 flex-shrink-0">
        <v-divider class="mb-5" />
        <v-btn
          block
          variant="outlined"
          color="orange-darken-2"
          prepend-icon="mdi-home"
          to="/"
          class="text-body-1"
        >
          返回前台
        </v-btn>
      </div>
    </v-navigation-drawer>

    <!-- 主要內容區域 -->
    <v-main class="bg-grey-lighten-4">
  <v-container fluid class="pa-6">
    <router-view />
  </v-container>
</v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const user = useUserStore()
const drawer = ref(true)
const router = useRouter()

// 登出處理函數
const handleLogout = async () => {
  try {
    // 清除用戶資料
    user.logout()

    // 導向登入頁面
    await router.push('/login')
  } catch (error) {
    console.error('登出失敗:', error)
  }
}

const navItems = [
  {
    title: '基本資訊管理',
    to: '/user/info',
    icon: 'mdi-account-edit'
  },
  // {
  //   title: '餐廳收藏查詢',
  //   to: '/user/collect',
  //   icon: 'mdi-silverware-fork-knife'
  // },
  {
    title: '回憶錄管理',
    to: '/user/diary',
    icon: 'mdi-book-heart-outline'
  }
]
</script>
