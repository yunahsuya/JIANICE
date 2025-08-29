<template>
  <div>
    <!-- Hero Section with Parallax -->
    <v-parallax
      class="h-screen"
      src="../assets/pexels-goumbik-349610.jpg"
    >
      <div class="d-flex flex-column h-screen justify-center" style="color: #0E6200;">
        <!-- <div class="mx-auto mx-md-10" style="max-width: 800px; "> -->

        <p style="font-size: 48px; font-weight: bold; padding-left: 90px;">不只是選擇餐廳</p>

        <p style="font-size: 48px; padding-left: 90px; line-height: 45px; margin-bottom: 25px;">解決選擇困難、營養缺口與回憶保存的飲食平台</p>

        <p style="font-size: 24px; padding-left: 90px; line-height: 35px; font-weight:400"> 在日常生活裡，吃飯本來應該是快樂的事，卻常常成為小小的壓力。<br>
          我們會因為選擇太多而猶豫，會因為缺少營養而擔心健康，也會因為沒有地方保存回憶，而覺得遺憾。</p>
        <v-btn
          class="text-white"
          color="orange-darken-2"
          rounded
          style="width:200px; margin-left: 90px; margin-top: 30px; height: 50px;"
          @click="scrollToInfo"
        >
          <v-icon start>mdi-arrow-down</v-icon>
          探索更多功能
        </v-btn>
        <!-- </div> -->
      </div>
    </v-parallax>

    <!-- Features Section -->
    <section id="info" class="bg-grey-lighten-5 h-screen">
      <v-container class="py-16">
        <div class="text-center mb-12">
          <h2 class="text-h3 text-md-h2 font-weight-bold text-grey-darken-3 mb-4">
            主要功能
          </h2>
          <v-divider class="mx-auto mb-4 border-opacity-100" color="orange-darken-2" thickness="6" width="100" />

          <p class="text-body-1 text-grey-darken-1" style="max-width: 600px; margin: 0 auto;">
            讓每一次用餐都成為美好的體驗
          </p>
        </div>

        <v-row class="justify-center ga-6" style="flex-wrap: nowrap;">
          <v-col
            v-for="(feature, index) in features"
            :key="index"
            cols="12"
            lg="3"
            md="6"
          >
            <v-card
              class="h-100 transition-swing feature-card"
              :class="{ 'elevation-12': feature.hover }"
              elevation="4"
              rounded="xl"
              @click="navigateToFeature(feature.route)"
              @mouseenter="feature.hover = true"
              @mouseleave="feature.hover = false"
            >
              <div class="text-center pt-6">
                <v-img size="10" :src="feature.image" width="50px" />
                <v-icon color="orange-darken-2" :icon="feature.icon" size="48" />
                <v-card-title class="text-h6 font-weight-bold text-grey-darken-3 text-center">
                  {{ feature.title }}
                </v-card-title>
              </div>
              <v-card-text class="pt-0 px-6 pb-6  mt-3">
                <v-list class="bg-transparent pa-0">
                  <v-list-item
                    v-for="(point, pointIndex) in feature.points"
                    :key="pointIndex"
                    class="px-0 py-1 "
                  >
                    <template #prepend>
                      <v-icon class="feature-check-icon" color="success" size="small">mdi-check</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2 text-grey-darken-1 feature-point-text">
                      {{ point }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Vision Section -->
    <section class="bg-white">
      <v-container class="py-16">
        <div class="text-center mb-12">
          <h2 class="text-h3 text-md-h2 font-weight-bold text-grey-darken-3 mb-4">
            JIANICE 的願景
          </h2>
          <v-divider class="mx-auto mb-4 border-opacity-100" color="orange-darken-2" thickness="6" width="100" />

        </div>

        <v-row class="align-center">
          <v-col cols="12" md="6">
            <div class="pr-md-8">
              <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">
                讓健康飲食成為生活的一部分
              </h3>
              <p class="text-body-1 text-grey-darken-1 mb-6 line-height-1-7">
                我們相信，健康飲食不必是嚴肅的限制，而是一種充滿選擇、樂趣與回憶的生活方式。
                JiaNice 希望陪伴每個人在餐桌上找到平衡，既能吃得健康，也能吃得開心，並把這些片刻，化成值得收藏的故事。
              </p>

              <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">
                JIANICE 的由來
              </h3>
              <p class="text-body-1 text-grey-darken-1">
                「JiaNice」 的靈感來自 「吃飯（Jia）」與「讚（Nice）」 的結合。
                寓意是：「吃得健康、吃得開心，就是一件很 Nice 的事！」
              </p>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="overflow-hidden mb-10" elevation="6" rounded="xl">
              <v-img
                class="transition-swing"
                cover
                height="400"
                src="../assets/pexels-craytive-1565982.jpg"
              />
              <v-card-text class="pa-6">
                <h4 class="text-h5 font-weight-bold text-grey-darken-3 mb-3">
                  您的飲食生活夥伴
                </h4>
                <p class="text-body-1 text-grey-darken-1">
                  透過簡單的方法，讓每一次用餐都充滿驚喜與溫暖
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA Section -->
    <section v-if="!userStore.isLoggedIn" class="text-white" style="padding: 10rem 0; background-color: #FF9A1A;">
      <v-container class="py-16 text-center">
        <h2 class="text-h3 text-md-h2 font-weight-bold mb-8">
          準備開始您的健康飲食之旅了嗎？
        </h2>
        <p class="text-body-1 mb-8 opacity-90">
          加入我們，讓每一次用餐都成為美好的回憶
        </p>
        <div class="d-flex justify-center flex-wrap ga-4">
          <v-btn
            class="text-orange-darken-2 font-weight-bold"
            color="white"
            elevation="8"
            rounded="pill"
            size="x-large"
            @click="router.push('/register')"
          >
            立即註冊
          </v-btn>
          <v-btn
            color="white"
            rounded="pill"
            size="x-large"
            variant="outlined"
            @click="router.push('/login')"
          >
            登入帳號
          </v-btn>
        </div>
      </v-container>
    </section>

    <!-- Footer -->
    <v-footer class="bg-grey-darken-4 text-white">
      <v-container class="py-8">
        <v-row class="justify-center">
          <v-col class="text-center" cols="12" md="8">
            <div class="d-flex justify-center mb-6">
              <v-btn
                v-for="icon in socialIcons"
                :key="icon.name"
                class="mx-2"
                color="white"
                :icon="icon.icon"
                size="large"
                variant="text"
              />
            </div>

            <v-divider class="mb-6" color="white" opacity="0.3" />

            <p class="text-body-1 mb-4 opacity-80">
              JiaNice 致力於為您提供最佳的飲食體驗，讓健康與美味並存
            </p>

            <p class="text-caption opacity-60">
              © {{ new Date().getFullYear() }} JiaNice. 版權所有
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router'

  import { useUserStore } from '../stores/user'
  const userStore = useUserStore()

  const router = useRouter()

  const features = ref([
    {
      image: 'https://cdn-icons-gif.flaticon.com/11686/11686496.gif',
      icon: 'mdi-dice-multiple',
      title: '隨機抽餐廳',
      route: '/restaurant',
      points: [
        '不再為「要吃什麼？」煩惱',
        '透過轉盤或拉霸的方式，讓選擇多一點驚喜',
        '幫助快速決定，也讓用餐更有趣',
      ],
      hover: false,
    },
    {
      image: 'https://cdn-icons-gif.flaticon.com/15578/15578646.gif',
      image: 'https://cdn-icons-gif.flaticon.com/11779/11779519.gif',

      icon: 'mdi-nutrition',
      title: '營養管理',
      route: '/nutrition',
      points: [
        '系統會根據你的紀錄，提醒缺少的營養素',
        '自動推薦對應的食物與餐廳',
        '讓健康飲食變得更直觀、更貼近生活',
      ],
      hover: false,
    },
    {
      image: 'https://cdn-icons-gif.flaticon.com/15747/15747266.gif',
      icon: 'mdi-newspaper',
      title: '健康新聞',
      route: '/hpanews',
      points: [
        '即時抓取健康署發布的最新健康新聞',
        '內容可靠，避免不正確的飲食資訊',
        '隨時掌握營養與健康的最新趨勢',
      ],
      hover: false,
    },
    {
      image: 'https://cdn-icons-gif.flaticon.com/12743/12743782.gif',
      icon: 'mdi-book-heart',
      title: '回憶保存',
      route: '/diary',
      points: [
        '不只是記錄「吃了什麼」，還能記錄「和誰、在什麼心情下吃」',
        '支援加密保護，讓某些回憶只屬於你',
        '打造專屬的飲食日記，讓每一次用餐都留下痕跡',
      ],
      hover: false,
    },
  ])

  const socialIcons = [
    { name: 'github', icon: 'mdi-github' },
    { name: 'instagram', icon: 'mdi-instagram' },
    { name: 'facebook', icon: 'mdi-facebook' },
    { name: 'twitter', icon: 'mdi-twitter' },
  ]

  const scrollToInfo = () => {
    const el = document.querySelector('#info')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // 修正：使用 useRouter() 來獲取路由實例
  const navigateToFeature = route => {
    router.push(route)
  }
</script>

<style scoped>

/* 新增：讓卡片具有可點擊的視覺效果 */
.feature-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

/* 修復主要功能卡片文字截斷問題 */
.feature-point-text {
  white-space: normal !important;
  line-height: 1.5 !important;
}

/* 讓勾勾圖示顏色更深 */
.feature-check-icon {
  opacity: 1 !important;
}

/* 確保卡片高度自適應 */
.v-card {
  min-width: 300px;
}
</style>

<route lang="yaml">
  meta:
    title: '首頁'
    admin: false
</route>
