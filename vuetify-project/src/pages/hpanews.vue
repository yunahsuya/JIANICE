<template>
  <v-row>
    <v-col cols="12">

      <!-- 健康新聞區塊 -->
      <v-container>
        <v-row>
          <v-col cols="12">
            <h1 class="mb-2">最新健康新聞</h1>

            <v-divider class="mb-5 border-opacity-50" color="orange-darken-2" length="150" :thickness="5" />

            <!-- 搜尋控制項 -->
            <v-row>
              <v-col cols="12" md="10">
                <v-text-field
                  v-model="searchKeyword"
                  clearable
                  label="搜尋關鍵字"
                  placeholder="例如：營養、健康、癌症、兒童"
                  @keyup.enter="searchNews"
                />
              </v-col>
              <v-col class="pa-4" cols="12" md="2">
                <v-btn
                  block
                  color="primary"
                  height="50"
                  :loading="loading"
                  @click="searchNews"
                >
                  搜尋
                </v-btn>
              </v-col>
            </v-row>

            <!-- 分類按鈕 -->
            <v-chip-group class="mb-4">
              <v-chip
                v-for="topic in healthTopics"
                :key="topic"
                color="primary"
                filter
                text="全部"
                @click="searchByTopic(topic)"
              >
                {{ topic }}
              </v-chip>
            </v-chip-group>

            <!-- 載入中 -->
            <v-row v-if="loading">
              <v-col class="text-center" cols="12">
                <v-progress-circular
                  color="primary"
                  indeterminate
                  size="64"
                />
                <p class="mt-4">正在載入健康新聞...</p>
              </v-col>
            </v-row>

            <!-- 錯誤訊息 -->
            <v-alert
              v-if="error"
              closable
              type="error"
              @click:close="error = ''"
            >
              {{ error }}
            </v-alert>

            <!-- 新聞列表 -->
            <v-row v-if="newsData.length > 0">
              <v-col
                v-for="news in newsData"
                :key="news.標題"
                cols="12"
                lg="4"
                md="6"
              >
                <v-card
                  v-lazy
                  class="h-100"
                  elevation="2"
                  hover
                  style="cursor: pointer;"
                  @click="openNewsLink(news.連結網址)"
                >
                  <v-card-title class="text-h6">
                    {{ news.標題 }}
                  </v-card-title>

                  <v-card-text class="pb-2">
                    <!-- 使用v-html來渲染HTML內容 -->
                    <div
                      class="text-body-2 news-content"
                      v-html="truncateContent(news.內容, 130)"
                    />

                    <div class="d-flex justify-space-between align-center mt-2">
                      <v-chip
                        color="info"
                        size="small"
                        variant="outlined"
                      >
                        {{ formatDate(news.發布日期) }}
                      </v-chip>
                      <v-chip
                        v-if="news.修改日期 && news.修改日期 !== news.發布日期"
                        color="warning"
                        size="small"
                        variant="outlined"
                      >
                        更新: {{ formatDate(news.修改日期) }}
                      </v-chip>
                    </div>
                  </v-card-text>

                  <v-card-actions @click.stop>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      variant="elevated"
                      @click="openNewsLink(news.連結網址)"
                    >
                      閱讀更多
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <!-- 無資料 -->
            <v-row v-else-if="!loading && newsData.length === 0">
              <v-col class="text-center" cols="12">
                <v-icon color="grey" size="64">mdi-newspaper-variant-outline</v-icon>
                <p class="text-h6 mt-4">沒有找到相關的健康新聞</p>
                <p class="text-body-2 text-grey">請嘗試其他關鍵字或日期範圍</p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

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
    </v-col>
  </v-row>
</template>

<script setup>
  import { onActivated, onDeactivated, onMounted, ref } from 'vue'
  import cacheService from '@/services/cache'
  import hpaNewsService from '@/services/hpanews'

  // 定義組件名稱，用於 keep-alive
  defineOptions({
    name: 'Hpanews',
  })

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
  const selectedMonth = ref(null)
  const selectedTopic = ref('全部')

  // 快取鍵值
  const CACHE_KEYS = {
    LATEST_NEWS: 'hpanews_latest',
    SEARCH_PREFIX: 'hpanews_search_',
  }

  // 健康主題選項
  const healthTopics = [
    '全部',
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
    '補助',
    '檢查',
  ]

  // 搜尋新聞
  const searchNews = async () => {
    loading.value = true
    error.value = ''

    try {
      // 檢查搜尋快取
      const searchCacheKey = `${CACHE_KEYS.SEARCH_PREFIX}${searchKeyword.value}`
      const cachedData = cacheService.get(searchCacheKey)

      if (searchKeyword.value && cachedData) {
        newsData.value = cachedData
        loading.value = false
        return
      }

      const response = await hpaNewsService.searchThisYear(searchKeyword.value)
      const data = response.data.data || []
      newsData.value = data

      // 儲存搜尋結果到快取
      if (searchKeyword.value) {
        cacheService.set(searchCacheKey, data)
      }
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
    selectedTopic.value = topic

    if (topic === '全部') {
      searchKeyword.value = ''
      selectedMonth.value = null
      await loadLatestNews()
    } else {
      searchKeyword.value = topic
      selectedMonth.value = null
      await searchNews()
    }
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
      // 檢查快取是否有效
      const cachedData = cacheService.get(CACHE_KEYS.LATEST_NEWS)

      if (cachedData) {
        newsData.value = cachedData
        loading.value = false
        return
      }

      const response = await hpaNewsService.getLatestThisYear()
      const data = response.data.data || []
      newsData.value = data

      // 儲存到快取
      cacheService.set(CACHE_KEYS.LATEST_NEWS, data)
    } catch (error_) {
      console.error('載入最新新聞失敗:', error_)
      error.value = '載入最新新聞時發生錯誤，請稍後再試'
      newsData.value = []
    } finally {
      loading.value = false
    }
  }

  // 頁面載入時執行
  onMounted(() => {
    loadLatestNews()
  })

  // 當組件被重新啟用時（從其他頁面返回）
  // 優化的頁面重新啟用邏輯
  // 極簡化的頁面重新啟用邏輯
  onActivated(() => {
    // 只在沒有資料時才載入，避免不必要的檢查
    if (newsData.value.length === 0) {
      const cachedData = cacheService.get(CACHE_KEYS.LATEST_NEWS)
      if (cachedData) {
        newsData.value = cachedData
      } else {
        loadLatestNews()
      }
    }
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
    title: '健康新聞'
    login: 'login-only'
    admin: false
</route>
