<template>
  <!--
      <v-app-bar>：頁面頂端的導覽列

      這是一個綠色的上方工具列（color="#01523f"）
      裡面放置網站名稱和按鈕，讓使用者可以切換不同頁面
  -->
  <v-app-bar color="#36652A">
    <v-container class="d-flex align-center">
      <v-app-bar-title class="cursor-pointer" @click="$router.push('/')">JIANICE</v-app-bar-title>

      <!-- 桌面版導航按鈕 - 只在 md 以上螢幕顯示 -->
      <div class="d-none d-md-flex align-center">
        <template v-for="item of navItems" :key="item.to">
          <v-btn
            v-if="item.show"
            :prepend-icon="item.icon"
            :to="item.to"
            variant="text"
            class="text-white"
          >
            {{ item.title }}
            <v-badge v-if="item.to === '/cart' && user.cartTotal > 0" color="red" :content="user.cartTotal" floating />
          </v-btn>
        </template>

        <!-- 登出按鈕 -->
        <v-btn
          v-if="user.isLoggedIn"
          prepend-icon="mdi-logout"
          @click="logout"
          variant="text"
          class="text-white"
        >
          登出
        </v-btn>
      </div>

      <!-- 手機版漢堡選單按鈕 - 移到右邊 -->
      <v-app-bar-nav-icon
        class="d-md-none ms-auto"
        @click="drawer = !drawer"
      />
    </v-container>
  </v-app-bar>

  <!-- 手機版側邊導航欄 -->
  <v-navigation-drawer
    v-model="drawer"
    :temporary="$vuetify.display.smAndDown"
    color="#36652A"
    class="d-md-none"
    location="right"
  >
    <v-list class="pa-4">
      <v-list-item
        v-for="item of navItems"
        :key="item.to"
        :to="item.to"
        :prepend-icon="item.icon"
        class="text-white mb-2"
        @click="drawer = false"
      >
        <v-list-item-title class="text-white">{{ item.title }}</v-list-item-title>
      </v-list-item>

      <!-- 登出按鈕 -->
      <v-list-item
        v-if="user.isLoggedIn"
        prepend-icon="mdi-logout"
        @click="logout"
        class="text-white mb-2"
      >
        <v-list-item-title class="text-white">登出</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>


  <!--
      <v-main> 與 <router-view>
      <v-main> 是主要內容區域

      <router-view :key="$route.fullPath" /> 是 Vue Router 的佔位元件，會根據目前路由顯示對應頁面
  -->
  <!--
      fullPath 是 Vue Router 提供的路由屬性
      它是目前頁面的完整路徑（包含查詢字串）

      例如：網址是 https://example.com/news?category=health，那 fullPath 就是 /news?category=health

      這個屬性常用來作為 <router-view> 的 key，是為了讓路由切換時，畫面能夠重新渲染，確保內容更新不會卡住或錯亂

      簡單說：fullPath 就是目前「整個頁面路徑」的文字描述～
  -->
  <v-main>
    <router-view :key="$route.fullPath" />
  </v-main>
</template>

<script setup>
  // computed：建立計算屬性
  import { computed, ref } from 'vue'

  // useRouter：操作路由導向
  import { useRouter } from 'vue-router'

  // useSnackbar：顯示彈跳訊息（小提示）
  import { useSnackbar } from 'vuetify-use-dialog'

  import FloatingactionButtons from '@/components/FloatingactionButtons.vue'

  // userService：跟後端溝通的使用者相關功能（例如登出）
  import userService from '@/services/user'

  // useUserStore：Pinia 狀態管理，取得使用者資料
  import { useUserStore } from '@/stores/user'

  /*
    user：拿到使用者狀態
    可以看到 user.isLoggedIn、user.cartTotal、user.isAdmin 等資訊
  */
  const user = useUserStore()

  const createSnackbar = useSnackbar()
  const router = useRouter()

  // 手機版側邊欄控制
  const drawer = ref(false)

  /*
    navItems 是一個計算屬性 (computed)
    它是一個陣列，裡面每個物件代表一個導覽按鈕

    title：按鈕文字
    to：點按後會導航到的路由路徑
    icon：按鈕左邊的小圖示（使用 Material Design Icons）
    show：是否顯示這個按鈕，會根據使用者狀態（登入、管理員）決定
  */
  const navItems = computed(() => [
    { title: '首頁', to: '/', icon: 'mdi-home', show: true },
    { title: '餐廳', to: '/restaurant', icon: 'mdi-silverware-fork-knife', show: true },

    // { title: '產品', to: '/product', icon: 'mdi-silverware-fork-knife', show: true },

    // { title: '口袋名單', to: '/favorite', icon: 'mdi-heart', show: user.isLoggedIn },
    { title: '健康新聞', to: '/hpanews', icon: 'mdi-newspaper-variant-outline', show: true },

    { title: '營養管理', to: '/nutrition', icon: 'mdi-nutrition', show: user.isLoggedIn },

    { title: '日記牆', to: '/diary', icon: 'mdi-robot-love-outline', show: user.isLoggedIn },

    { title: '關於JIANICE', to: '/about', icon: 'mdi-account-box-outline', show: true },

    // { title: '註冊', to: '/register', icon: 'mdi-account-plus', show: !user.isLoggedIn },
    { title: '註冊/登入', to: '/login', icon: 'mdi-login', show: !user.isLoggedIn },
    // { title: '購物車', to: '/cart', icon: 'mdi-cart', show: user.isLoggedIn },
    // { title: '訂單', to: '/orders', icon: 'mdi-invoice-list-outline', show: user.isLoggedIn },
    { title: '管理者後台', to: '/admin', icon: 'mdi-cog', show: user.isLoggedIn && user.isAdmin },

    { title: '健康天地', to: '/user', icon: 'mdi-heart-cog-outline', show: user.isLoggedIn },

  ])

  /*
    logout 函式
    先呼叫 userService.logout()，跟後端說我想登出（清掉 token）

    呼叫 user.logout() 清除本地使用者資料

    導航回首頁

    用 createSnackbar 顯示「登出成功！」的綠色提示
  */
  const logout = async () => {
    try {
      await userService.logout()
    } catch (error) {
      console.error(error)
    }
    user.logout()
    router.push('/')
    createSnackbar({
      text: '登出成功！',
      snackbarProps: {
        color: 'green',
      },
    })
  }
</script>

<!--
    如果 item.show === false，想讓這個東西「只在 false 時顯示」，

    可以這樣寫：
    v-if="!item.show"

    這裡的 ! 是「取反」的意思，就是說「當 item.show 是假（false）時，才會顯示這個元素」。
-->
