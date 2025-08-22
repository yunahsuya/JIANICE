<template>
  <v-row>
    <v-col cols="12">
      <!-- 視差 -->
      <v-parallax
        src="../assets/pexels-goumbik-349610.jpg"
      >
        <div class="d-flex flex-column h-screen justify-center" style="color: #0E6200;">
          <p style="font-size: 48px; font-weight: bold; padding-left: 90px;">不只是選擇餐廳</p>

          <p style="font-size: 48px; padding-left: 90px; line-height: 45px; margin-bottom: 25px;">解決選擇困難、營養缺口與回憶保存的飲食平台</p>

          <p style="font-size: 24px; padding-left: 90px; line-height: 35px; font-weight:400"> 在日常生活裡，吃飯本來應該是快樂的事，卻常常成為小小的壓力。<br>
            我們會因為選擇太多而猶豫，會因為缺少營養而擔心健康，也會因為沒有地方保存回憶，而覺得遺憾。</p>

          <v-btn
            class="text-white"
            color="orange-darken-2"
            rounded
            style="width:200px; margin-left: 90px; margin-top: 30px; height: 50px;"
            @click="info"
          >瞭解更多功能</v-btn>
        </div>
      </v-parallax>

      <v-container id="info">
        <AboutCard />
      </v-container>

      <!-- 原有的卡片和頁尾 -->
      <v-card class="mx-auto" rounded="0">
        <v-img
          cover
          height="100%"
          src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
        >
          <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h1 class="text-h1 font-weight pl-4 ">
              Vuetify
            </h1>
            <h4 class="text-h4 pl-10">
              Build your application today!
            </h4>
          </div>
        </v-img>

        <!-- 頁尾 -->
        <v-footer class="text-center d-flex flex-column ga-2 " color="indigo-lighten-1">
          <div class="d-flex ga-3">
            <v-btn
              v-for="icon in icons"
              :key="icon"
              density="comfortable"
              :icon="icon"
              variant="text"
            />
          </div>

          <v-divider class="my-2" thickness="2" width="50" />

          <div class="text-caption font-weight-regular opacity-60">
            Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet. Mauris cursus commodo interdum. Praesent ut risus eget metus luctus accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim a sit amet dui. Duis commodo vitae velit et faucibus. Morbi vehicula lacinia malesuada. Nulla placerat augue vel ipsum ultrices, cursus iaculis dui sollicitudin. Vestibulum eu ipsum vel diam elementum tempor vel ut orci. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          </div>

          <v-divider />

          <div>
            <v-divider class="pt-5" />

            {{ new Date().getFullYear() }} — <strong> © Yuna 版權所有</strong>
          </div>
        </v-footer>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import AboutCard from '@/components/InfoCard.vue'
  // import hpaNewsService from '@/services/hpanews11'

  const icons = [
    'mdi-github',
    'mdi-google',
    'mdi-linkedin',
    'mdi-instagram',
  ]

  // 響應式資料
  const newsData = ref([])
  const loading = ref(false)
  const error = ref('')
  const searchKeyword = ref('')
  const startDate = ref('')
  const endDate = ref('')

  // 健康主題選項
  const healthTopics = [
    '營養',
    '健康',
    '癌症',
    '糖尿病',
    '高血壓',
    '肥胖',
    '運動',
    '飲食',
    '兒童',
    '戒菸',
  ]

  // 搜尋新聞
  const searchNews = async () => {
    loading.value = true
    error.value = ''

    try {
      const response = await hpaNewsService.searchNews(
        searchKeyword.value,
        startDate.value,
        endDate.value,
      )
      newsData.value = response.data.data || []
    } catch (error_) {
      console.error('搜尋新聞失敗:', error_)
      error.value = '載入新聞時發生錯誤，請稍後再試'
      newsData.value = []
    } finally {
      loading.value = false
    }
  }

  // 根據主題搜尋
  const searchByTopic = async topic => {
    searchKeyword.value = topic
    await searchNews()
  }

  // 格式化日期
  const formatDate = dateString => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-TW')
    } catch {
      return dateString
    }
  }

  // 截斷內容並移除HTML標籤
  const truncateContent = (htmlContent, maxLength) => {
    if (!htmlContent) return ''

    // 移除HTML標籤
    const textContent = htmlContent.replace(/<[^>]*>/g, '')

    // 截斷文字
    if (textContent.length <= maxLength) {
      return htmlContent
    }

    // 截斷並加上省略號
    const truncatedText = textContent.slice(0, Math.max(0, maxLength)) + '...'
    return truncatedText
  }

  // 開啟新聞連結
  const openNewsLink = url => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  // 頁面載入時取得最新新聞
  const loadLatestNews = async () => {
    loading.value = true
    error.value = ''

    try {
      const response = await hpaNewsService.getLatestNews()
      newsData.value = response.data.data || []
    } catch (error_) {
      console.error('載入最新新聞失敗:', error_)
      error.value = '載入最新新聞時發生錯誤，請稍後再試'
      newsData.value = []
    } finally {
      loading.value = false
    }
  }

  const info = () => {
    const el = document.querySelector('#info')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // 頁面載入時執行
  onMounted(() => {
    loadLatestNews()
  })
</script>

<style scoped>
.news-content {
  line-height: 1.6;
  max-height: 120px;
  overflow: hidden;
}

.news-content :deep(p) {
  margin-bottom: 0.5rem;
}

.news-content :deep(strong) {
  font-weight: bold;
}
</style>

<route lang="yaml">
  meta:
    title: '關於我們'
    login: 'login-only'
    admin: false
</route>
