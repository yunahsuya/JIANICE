<template>
  <div>
    <!-- Hero Section with Parallax -->
    <v-parallax
      class="h-screen"
      src="../assets/pexels-goumbik-349610.jpg"
    >
      <div class="d-flex align-center h-100">
        <div class="mx-auto mx-md-10" style="max-width: 800px; color: white;">
          <h1 class="text-h2 text-md-h1 font-weight-bold mb-4">
            不只是選擇餐廳
          </h1>
          <h2 class="text-h4 text-md-h3 font-weight-regular mb-6">
            解決選擇困難、營養缺口與回憶保存的飲食平台
          </h2>
          <p class="text-body-1 mb-8 opacity-90">
            在日常生活裡，吃飯本來應該是快樂的事，卻常常成為小小的壓力。<br>
            我們會因為選擇太多而猶豫，會因為缺少營養而擔心健康，也會因為沒有地方保存回憶，而覺得遺憾。
          </p>
          <v-btn
            class="text-white font-weight-bold"
            color="orange-darken-2"
            elevation="8"
            rounded="pill"
            size="x-large"
            @click="scrollToInfo"
          >
            <v-icon start>mdi-arrow-down</v-icon>
            探索更多功能
          </v-btn>
        </div>
      </div>
    </v-parallax>

    <!-- Features Section -->
    <section id="info" class="bg-grey-lighten-5">
      <v-container class="py-16">
        <div class="text-center mb-12">
          <h2 class="text-h3 text-md-h2 font-weight-bold text-grey-darken-3 mb-4">
            主要功能
          </h2>
          <v-divider class="mx-auto mb-4" color="orange-darken-2" thickness="4" width="80" />
          <p class="text-body-1 text-grey-darken-1" style="max-width: 600px; margin: 0 auto;">
            讓每一次用餐都成為美好的體驗
          </p>
        </div>

        <v-row class="justify-center">
          <v-col
            v-for="(feature, index) in features"
            :key="index"
            cols="12"
            lg="3"
            md="6"
          >
            <v-card
              class="h-100 transition-swing"
              :class="{ 'elevation-12': feature.hover }"
              elevation="4"
              rounded="xl"
              @mouseenter="feature.hover = true"
              @mouseleave="feature.hover = false"
            >
              <div class="text-center pa-6">
                <v-icon class="mb-4" color="orange-darken-2" :icon="feature.icon" size="48" />
                <v-card-title class="text-h6 font-weight-bold text-grey-darken-3 text-center">
                  {{ feature.title }}
                </v-card-title>
              </div>
              <v-card-text class="pt-0 px-6 pb-6">
                <v-list class="bg-transparent pa-0">
                  <v-list-item
                    v-for="(point, pointIndex) in feature.points"
                    :key="pointIndex"
                    class="px-0 py-2"
                  >
                    <template #prepend>
                      <v-icon color="success" size="small">mdi-check</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2 text-grey-darken-1">
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

    <!-- Stats Section -->
    <section class="bg-grey-darken-4 text-white">
      <v-container class="py-16">
        <v-row class="justify-center text-center">
          <v-col v-for="(stat, index) in stats" :key="index" cols="6" md="3">
            <div class="pa-4">
              <div class="text-h2 text-md-h1 font-weight-bold text-orange-darken-2 mb-2">
                {{ stat.number }}
              </div>
              <div class="text-body-1 opacity-90">
                {{ stat.label }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Vision Section -->
    <section class="bg-white">
      <v-container class="py-16">
        <div class="text-center mb-12">
          <h2 class="text-h3 text-md-h2 font-weight-bold text-grey-darken-3 mb-4">
            我們的願景
          </h2>
          <v-divider class="mx-auto mb-4" color="orange-darken-2" thickness="4" width="80" />
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
            <v-card class="overflow-hidden" elevation="8" rounded="xl">
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
    <section class="text-white bg-orange-darken-2">
      <v-container class="py-16 text-center">
        <h2 class="text-h3 text-md-h2 font-weight-bold mb-4">
          準備開始您的健康飲食之旅了嗎？
        </h2>
        <p class="text-body-1 mb-8 opacity-90">
          加入我們，讓每一次用餐都成為美好的回憶
        </p>
        <div class="d-flex justify-center flex-wrap ga-2">
          <v-btn
            class="text-orange-darken-2 font-weight-bold"
            color="white"
            elevation="8"
            rounded="pill"
            size="x-large"
            @click="$router.push('/register')"
          >
            立即註冊
          </v-btn>
          <v-btn
            color="white"
            rounded="pill"
            size="x-large"
            variant="outlined"
            @click="$router.push('/login')"
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
  const features = ref([
    {
      icon: 'mdi-dice-multiple',
      title: '隨機抽餐廳',
      points: [
        '不再為「要吃什麼？」煩惱',
        '透過轉盤或拉霸的方式，讓選擇多一點驚喜',
        '幫助快速決定，也讓用餐更有趣',
      ],
      hover: false,
    },
    {
      icon: 'mdi-nutrition',
      title: '營養管理',
      points: [
        '系統會根據你的紀錄，提醒缺少的營養素',
        '自動推薦對應的食物與餐廳',
        '讓健康飲食變得更直觀、更貼近生活',
      ],
      hover: false,
    },
    {
      icon: 'mdi-newspaper',
      title: '健康新聞',
      points: [
        '即時抓取健康署發布的最新健康新聞',
        '內容可靠，避免不正確的飲食資訊',
        '隨時掌握營養與健康的最新趨勢',
      ],
      hover: false,
    },
    {
      icon: 'mdi-book-heart',
      title: '回憶保存',
      points: [
        '不只是記錄「吃了什麼」，還能記錄「和誰、在什麼心情下吃」',
        '支援加密保護，讓某些回憶只屬於你',
        '打造專屬的飲食日記，讓每一次用餐都留下痕跡',
      ],
      hover: false,
    },
  ])

  const stats = [
    { number: '1000+', label: '合作餐廳' },
    { number: '50K+', label: '活躍用戶' },
    { number: '100K+', label: '美食回憶' },
    { number: '24/7', label: '貼心服務' },
  ]

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
</script>

<style scoped>
/* 只需要一個自定義樣式用於漸層背景 */
.bg-gradient-primary {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}

/* 行高調整 */
.line-height-1-7 {
  line-height: 1.7;
}
</style>

<route lang="yaml">
  meta:
    title: '首頁'
    login: 'login-only'
    admin: false
</route>
