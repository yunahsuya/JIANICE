<!-- 健康新聞 -->
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
            <v-row class="align-center mb-1">
              <v-col class="pa-2" cols="12" md="8">
                <v-text-field
                  v-model="searchKeyword"
                  clearable
                  hide-details
                  label="搜尋關鍵字"
                  placeholder="例如：營養、健康、癌症、兒童"
                  variant="outlined"
                  @keyup.enter="searchNews"
                />
              </v-col>
              <v-col class="pa-3" cols="12" md="2">
                <v-select
                  v-model="sortOrder"
                  hide-details
                  :items="sortOptions"
                  label="排序方式"
                  variant="outlined"
                  @update:model-value="applySorting"
                >
                  <template #prepend-inner>
                    <v-icon>mdi-sort</v-icon>
                  </template>
                </v-select>
              </v-col>

              <!-- 統計資訊 -->
              <v-col class="pa-2" cols="12" md="2">
                <span class="text-body-2 text-grey-darken-1">
                  共找到 {{ newsData.length }} 篇新聞
                </span>
              </v-col>

              <!-- 可以不用多次發請求 -->
              <!-- <v-col cols="12" md="2" class="pa-2">
                <v-btn
                  block
                  class="text-body-1 font-weight-bold"
                  color="primary"
                  height="50"
                  :loading="loading"
                  @click="searchNews"
                >
                  搜尋
                </v-btn>
              </v-col> -->
            </v-row>

            <!-- 分類按鈕 -->
            <div class="mb-6">
              <div class="d-flex flex-wrap gap-3">
                <v-chip
                  v-for="topic in healthTopics"
                  :key="topic"
                  class="font-weight-medium transition-all hover-lift mt-2 mr-2"
                  :color="selectedTopic === topic ? 'primary' : 'default'"
                  :loading="loading && selectedTopic === topic"
                  size="large"
                  :variant="selectedTopic === topic ? 'elevated' : 'outlined'"
                  @click="searchByTopic(topic)"
                >
                  <v-icon class="mr-2" :icon="getTopicIcon(topic)" />
                  {{ topic }}
                </v-chip>
              </div>
            </div>

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
            <v-row v-if="currentPageNews.length > 0">
              <v-col
                v-for="news in currentPageNews"
                :key="news.標題"
                cols="12"
                lg="4"
                md="6"
              >
                <v-card
                  v-lazy
                  class="h-100 mb-3 cursor-pointer"
                  elevation="2"
                  hover
                  @click="openNewsLink(news.連結網址)"
                >
                  <v-card-title class="text-h6">
                    {{ news.標題 }}
                  </v-card-title>

                  <v-card-text class="pb-2">
                    <!-- 使用v-html來渲染HTML內容 -->
                    <div
                      class="text-body-2 text-truncate-3"
                      style="line-height: 1.6; max-height: 120px; overflow: hidden;"
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
                      class="mt-3 mr-2"
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
            <v-row v-else-if="!loading && currentPageNews.length === 0">
              <v-col class="text-center" cols="12">
                <v-icon color="grey" size="64">mdi-newspaper-variant-outline</v-icon>
                <p class="text-h6 mt-4">沒有找到相關的健康新聞</p>
                <p class="text-body-2 text-grey">請嘗試其他關鍵字或日期範圍</p>
              </v-col>
            </v-row>

            <!-- 分頁 -->
            <div v-if="totalPages > 1 && !loading" class="d-flex justify-center mt-10">
              <v-pagination
                v-model="page"
                :length="totalPages"
                rounded="circle"
                show-first-last-page
                :total-visible="7"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>

      <!-- 頁尾 -->
      <v-footer class="text-center d-flex flex-column ga-2 mt-7" color="indigo-lighten-1">
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
  import { computed, onActivated, onDeactivated, onMounted, ref, watch } from 'vue'
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
  const allNewsData = ref([]) // 儲存所有新聞資料
  const loading = ref(false)
  const error = ref('')
  const searchKeyword = ref('')
  const selectedMonth = ref(null)
  const selectedTopic = ref('全部')
  const page = ref(1)
  const sortOrder = ref('newest') // 新增排序狀態

  // 排序選項
  const sortOptions = [
    { title: '最新發布', value: 'newest' },
    { title: '最舊發布', value: 'oldest' },
    { title: '最近更新', value: 'recently_updated' },
  ]

  // 分頁設定
  const ITEMS_PER_PAGE = 12

  // 計算屬性 - 過濾和排序後的新聞資料
  const filteredAndSortedNewsData = computed(() => {
    let filtered = [...allNewsData.value]

    // 按搜尋關鍵字過濾
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      const query = searchKeyword.value.toLowerCase()
      filtered = filtered.filter(news =>
        news.標題?.toLowerCase().includes(query)
        || news.內容?.toLowerCase().includes(query),
      )
    }

    // 排序
    switch (sortOrder.value) {
      case 'newest': {
        return filtered.sort((a, b) => {
          const dateA = new Date(a.發布日期 || 0)
          const dateB = new Date(b.發布日期 || 0)
          return dateB - dateA // 最新的在前
        })
      }
      case 'oldest': {
        return filtered.sort((a, b) => {
          const dateA = new Date(a.發布日期 || 0)
          const dateB = new Date(b.發布日期 || 0)
          return dateA - dateB // 最舊的在前
        })
      }
      case 'recently_updated': {
        return filtered.sort((a, b) => {
          const dateA = new Date(a.修改日期 || a.發布日期 || 0)
          const dateB = new Date(b.修改日期 || b.發布日期 || 0)
          return dateB - dateA // 最近更新的在前
        })
      }
      default: {
        return filtered
      }
    }
  })

  // 計算屬性
  const totalPages = computed(() => {
    return Math.ceil(filteredAndSortedNewsData.value.length / ITEMS_PER_PAGE)
  })

  const currentPageNews = computed(() => {
    const start = (page.value - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredAndSortedNewsData.value.slice(start, end)
  })

  // 顯示的新聞數量（用於統計資訊）
  const newsData = computed(() => filteredAndSortedNewsData.value)

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
    '膽固醇',
    '肥胖',
    '運動',
    '飲食',
    '兒童',
    '戒菸',
    '補助',
    '檢查',
  ]

  // 取得主題圖標
  const getTopicIcon = topic => {
    const iconMap = {
      全部: 'mdi-newspaper-variant',
      營養: 'mdi-food-apple',
      健康: 'mdi-heart',
      癌症: 'mdi-hospital',
      糖尿病: 'mdi-spoon-sugar',
      高血壓: 'mdi-heart-pulse',
      肥胖: 'mdi-weight',
      運動: 'mdi-run',
      飲食: 'mdi-food-fork-drink',
      兒童: 'mdi-baby-face',
      戒菸: 'mdi-smoking-off',
      補助: 'mdi-cash',
      檢查: 'mdi-stethoscope',
    }
    return iconMap[topic] || 'mdi-newspaper-variant'
  }

  // 應用排序
  const applySorting = () => {
    page.value = 1 // 重置分頁到第一頁
  }

  // 搜尋新聞（現在用於載入資料到快取）
  const searchNews = async () => {
    if (!searchKeyword.value || searchKeyword.value.trim() === '') {
      return
    }

    loading.value = true
    error.value = ''

    try {
      // 檢查搜尋快取
      const searchCacheKey = `${CACHE_KEYS.SEARCH_PREFIX}${searchKeyword.value}`
      const cachedData = cacheService.get(searchCacheKey)

      if (cachedData) {
        // 將搜尋結果合併到所有資料中（避免重複）
        const existingTitles = new Set(allNewsData.value.map(item => item.標題))
        const newItems = cachedData.filter(item => !existingTitles.has(item.標題))
        allNewsData.value = [...allNewsData.value, ...newItems]
        return
      }

      const response = await hpaNewsService.searchThisYear(searchKeyword.value)
      const data = response.data.data || []

      // 將搜尋結果合併到所有資料中（避免重複）
      const existingTitles = new Set(allNewsData.value.map(item => item.標題))
      const newItems = data.filter(item => !existingTitles.has(item.標題))
      allNewsData.value = [...allNewsData.value, ...newItems]

      // 儲存搜尋結果到快取
      cacheService.set(searchCacheKey, data)
    } catch (error_) {
      console.error('搜尋新聞失敗:', error_)
      error.value = '載入新聞時發生錯誤，請稍後再試'
    } finally {
      loading.value = false
    }
  }

  // 根據主題搜尋
  const searchByTopic = async topic => {
    selectedTopic.value = topic
    page.value = 1 // 重置分頁

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
    page.value = 1 // 重置分頁

    try {
      // 檢查快取是否有效
      const cachedData = cacheService.get(CACHE_KEYS.LATEST_NEWS)

      if (cachedData) {
        allNewsData.value = cachedData
        loading.value = false
        return
      }

      const response = await hpaNewsService.getLatestThisYear()
      const data = response.data.data || []
      allNewsData.value = data

      // 儲存到快取
      cacheService.set(CACHE_KEYS.LATEST_NEWS, data)
    } catch (error_) {
      console.error('載入最新新聞失敗:', error_)
      error.value = '載入最新新聞時發生錯誤，請稍後再試'
      allNewsData.value = []
    } finally {
      loading.value = false
    }
  }

  // 監聽排序變化，重置分頁
  watch(sortOrder, () => {
    page.value = 1
  })

  // 監聽搜尋關鍵字變化，重置分頁
  watch(searchKeyword, () => {
    page.value = 1
  })

  // 頁面載入時執行
  onMounted(() => {
    loadLatestNews()
  })

  // 當組件被重新啟用時（從其他頁面返回）
  onActivated(() => {
    // 只在沒有資料時才載入，避免不必要的檢查
    if (allNewsData.value.length === 0) {
      const cachedData = cacheService.get(CACHE_KEYS.LATEST_NEWS)
      if (cachedData) {
        allNewsData.value = cachedData
      } else {
        loadLatestNews()
      }
    }
  })

</script>

<route lang="yaml">
  meta:
    title: '健康新聞'
    admin: false
</route>
