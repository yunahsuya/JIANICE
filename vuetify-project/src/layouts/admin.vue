<template>
  <v-app>
    <!-- 頂部導航欄 -->
    <v-app-bar class="border-b" color="primary" elevation="2">
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />

      <v-app-bar-title class="d-flex align-center">
        <v-icon class="me-3" icon="mdi-shield-crown" size="28" />
        <span class="text-h6 font-weight-bold">管理後台</span>
      </v-app-bar-title>

      <v-spacer />

      <!-- 用戶資訊 -->
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" class="d-flex align-center" variant="text">
            <v-avatar class="me-2" size="32">
              <v-img
                :src="`https://api.dicebear.com/9.x/thumbs/png/seed=${user.account}`"
              />
            </v-avatar>
            <span class="text-body-2">{{ user.account }}</span>
            <v-icon class="ms-1 me-5" icon="mdi-chevron-down" />
          </v-btn>
        </template>

        <v-list width="150">
          <!-- 個人資料 -->
          <!-- <v-list-item
            prepend-icon="mdi-account"
            title="個人資料"
            @click="() => {}"
          /> -->

          <!-- 設定 -->
          <!-- <v-list-item
            prepend-icon="mdi-cog"
            title="設定"
            @click="() => {}"
          /> -->

          <!-- 分割線 -->
          <!-- <v-divider /> -->

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
      class="border-e d-flex flex-column"
      color="surface"
      elevation="3"
      :permanent="$vuetify.display.mdAndUp"
      :temporary="$vuetify.display.smAndDown"
    >
      <!-- 側邊欄標題 -->
      <div class="pa-4 flex-shrink-0">
        <div class="d-flex align-center">
          <v-icon
            class="me-3"
            color="primary"
            icon="mdi-shield-crown"
            size="32"
          />
          <div>
            <div class="text-h6 font-weight-bold text-primary">管理系統</div>
            <div class="text-caption text-medium-emphasis">
              Administration Panel
            </div>
          </div>
        </div>
      </div>

      <v-divider class="mx-2 mb-2 flex-shrink-0" />

      <!-- 導航選單 -->
      <v-list class="pa-3 flex-grow-1">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          active-class="bg-primary-lighten-4 text-primary font-weight-bold"
          class="rounded-lg"
          color="primary"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          variant="text"
        />
      </v-list>

      <!-- 底部快速連結 -->
      <div class="pa-4 flex-shrink-0">
        <v-divider class="mb-5" />
        <v-btn
          block
          class="text-body-1"
          color="primary"
          prepend-icon="mdi-home"
          to="/"
          variant="outlined"
        >
          返回前台
        </v-btn>
      </div>
    </v-navigation-drawer>

    <!-- 主要內容區域 -->
    <v-main class="bg-grey-lighten-4 min-vh-100">
      <v-container class="pa-6" fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const user = useUserStore();
const drawer = ref(true);
const router = useRouter();

// 登出處理函數
const handleLogout = async () => {
  try {
    // 清除用戶資料
    user.logout();

    // 導向登入頁面
    await router.push("/login");
  } catch (error) {
    console.error("登出失敗:", error);
  }
};

const navItems = [
  // {
  //   title: '儀表板',
  //   to: '/admin/dashboard',
  //   icon: 'mdi-view-dashboard'
  // },
  {
    title: "使用者管理",
    to: "/admin/users",
    icon: "mdi-account-group",
  },
  // {
  //   title: '餐廳管理',
  //   to: '/admin/restaurants',
  //   icon: 'mdi-silverware-fork-knife'
  // },
  // {
  //   title: '訂單管理',
  //   to: '/admin/orders',
  //   icon: 'mdi-clipboard-list'
  // },
  // {
  //   title: '產品管理',
  //   to: '/admin/products',
  //   icon: 'mdi-package-variant'
  // },
  // {
  //   title: '系統設定',
  //   to: '/admin/settings',
  //   icon: 'mdi-cog'
  // }
];
</script>
