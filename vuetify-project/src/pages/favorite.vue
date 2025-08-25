<template>
  <div class="diary-wall">
    <!-- 背景裝飾 -->
    <div class="background-decoration">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>

    <v-container class="py-8">
      <!-- 頁面標題區域 -->
      <v-row class="mb-8">
        <v-col cols="12" class="text-center">
          <div class="title-section">
            <h1 class="main-title">
              <span class="title-icon">📖</span>
              回憶牆
            </h1>
            <p class="subtitle">記錄生活中的美好時刻，分享您的快樂回憶</p>
            <div class="title-decoration"></div>
          </div>
        </v-col>
      </v-row>

      <!-- 篩選和搜尋區域 -->
      <v-row class="mb-6">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchQuery"
            clearable
            hide-details
            label="搜尋回憶"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            class="search-field"
            bg-color="white"
            elevation="2"
          />
        </v-col>

        <v-col cols="12" md="6">
          <div class="category-filter">
            <v-chip-group
              v-model="selectedCategory"
              class="category-chips"
              selected-class="selected-category"
            >
              <v-chip
                class="category-chip"
                color="primary"
                filter
                size="large"
                variant="outlined"
                :value="''"
              >
                <v-icon start>mdi-view-grid</v-icon>
                全部
              </v-chip>

              <v-chip
                v-for="option in categoryOptions"
                :key="option"
                class="category-chip"
                :color="getCategoryColor(option)"
                filter
                size="large"
                variant="outlined"
                :value="option"
              >
                <v-icon start>{{ getCategoryIcon(option) }}</v-icon>
                {{ option }}
              </v-chip>
            </v-chip-group>
          </div>
        </v-col>
      </v-row>

      <!-- 載入中狀態 -->
      <v-row v-if="loading">
        <v-col class="text-center" cols="12">
          <div class="loading-container">
            <v-progress-circular
              color="primary"
              indeterminate
              size="80"
              width="8"
            />
            <p class="loading-text">載入回憶中...</p>
          </div>
        </v-col>
      </v-row>

      <!-- 日記卡片網格 -->
      <v-row v-else-if="filteredDiarys.length > 0" class="diary-grid">
        <v-col
          v-for="(diary, index) in filteredDiarys"
          :key="diary._id"
          cols="12"
          lg="4"
          md="6"
          sm="6"
          class="diary-col"
        >
          <div
            class="diary-card-wrapper"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <DiaryCard
              :diary="diary"
              @click="openDiaryDetail(diary)"
            />
          </div>
        </v-col>
      </v-row>

      <!-- 空狀態 -->
      <v-row v-else>
        <v-col class="text-center" cols="12">
          <div class="empty-state">
            <div class="empty-icon">
              <v-icon size="120" color="grey-lighten-1">mdi-book-heart-outline</v-icon>
            </div>
            <h3 class="empty-title">還沒有回憶</h3>
            <p class="empty-description">開始記錄您的美好時刻吧！</p>
            <v-btn
              v-if="user.isLogin"
              class="mt-6"
              color="primary"
              size="large"
              variant="elevated"
              @click="$router.push('/user/diary')"
            >
              <v-icon start>mdi-plus</v-icon>
              新增回憶
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- 日記詳情對話框 -->
    <v-dialog v-model="detailDialog.open" max-width="900" persistent>
      <v-card v-if="detailDialog.diary" class="detail-dialog">
        <v-card-title class="detail-header">
          <div class="detail-title">
            <v-icon
              :color="getCategoryColor(detailDialog.diary.category)"
              size="32"
              class="mr-3"
            >
              {{ getCategoryIcon(detailDialog.diary.category) }}
            </v-icon>
            <div>
              <h2 class="text-h4">{{ detailDialog.diary.category }}</h2>
              <v-chip
                v-if="detailDialog.diary.date"
                class="mt-2"
                color="success"
                size="small"
                variant="elevated"
              >
                <v-icon start size="16">mdi-calendar</v-icon>
                {{ formatDate(detailDialog.diary.date) }}
              </v-chip>
            </div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="large"
            @click="closeDiaryDetail"
          />
        </v-card-title>

        <v-card-text class="detail-content">
          <!-- 圖片輪播 -->
          <div v-if="detailDialog.diary.image && detailDialog.diary.image.length > 0" class="image-carousel">
            <v-carousel
              class="carousel"
              height="400"
              hide-delimiter-background
              show-arrows="hover"
              cycle
            >
              <v-carousel-item
                v-for="(image, index) in detailDialog.diary.image"
                :key="index"
              >
                <v-img
                  class="carousel-image"
                  cover
                  height="100%"
                  :src="image"
                />
              </v-carousel-item>
            </v-carousel>
            <div class="image-counter">
              {{ detailDialog.diary.image.length }} 張圖片
            </div>
          </div>

          <!-- 描述內容 -->
          <div class="description-section">
            <h4 class="description-title">
              <v-icon start color="primary">mdi-heart</v-icon>
              今日三件好事：
            </h4>
            <div class="description-content">
              {{ detailDialog.diary.description }}
            </div>
          </div>

          <!-- 建立時間 -->
          <v-divider class="my-6" />
          <div class="creation-info">
            <v-icon start color="grey">mdi-clock-outline</v-icon>
            建立於：{{ formatDateTime(detailDialog.diary.createdAt) }}
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import DiaryCard from '@/components/diary/DiaryCard.vue'
  import diaryService from '@/services/diary'
  import { useUserStore } from '@/stores/user'

  const user = useUserStore()

  // 響應式資料
  const diarys = ref([])
  const loading = ref(true)
  const searchQuery = ref('')
  const selectedCategory = ref('')

  // 詳情對話框
  const detailDialog = ref({
    open: false,
    diary: null,
  })

  // 分類選項
  const categoryOptions = ['快樂', '難過', '生氣', '平靜']

  // 計算屬性：篩選後的日記
  const filteredDiarys = computed(() => {
    let filtered = diarys.value

    // 按分類篩選
    if (selectedCategory.value) {
      filtered = filtered.filter(diary => diary.category === selectedCategory.value)
    }

    // 按搜尋關鍵字篩選
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(diary =>
        diary.description.toLowerCase().includes(query)
        || diary.category.toLowerCase().includes(query),
      )
    }

    return filtered
  })

  // 取得日記資料
  const getDiarys = async () => {
    try {
      loading.value = true
      const { data } = await diaryService.get()
      diarys.value = data.diarys || []
    } catch (error) {
      console.error('載入日記失敗:', error)
    } finally {
      loading.value = false
    }
  }

  // 開啟日記詳情
  const openDiaryDetail = diary => {
    detailDialog.value.diary = diary
    detailDialog.value.open = true
  }

  // 關閉日記詳情
  const closeDiaryDetail = () => {
    detailDialog.value.open = false
    detailDialog.value.diary = null
  }

  // 格式化日期
  const formatDate = dateString => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // 格式化日期時間
  const formatDateTime = dateString => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleString('zh-TW')
  }

  // 取得分類顏色
  const getCategoryColor = category => {
    const colors = {
      快樂: 'orange',
      難過: 'blue',
      生氣: 'red',
      平靜: 'grey',
    }
    return colors[category] || 'primary'
  }

  // 取得分類圖標
  const getCategoryIcon = category => {
    const icons = {
      快樂: 'mdi-emoticon-happy',
      難過: 'mdi-emoticon-sad',
      生氣: 'mdi-emoticon-angry',
      平靜: 'mdi-emoticon-neutral',
    }
    return icons[category] || 'mdi-heart'
  }

  // 頁面載入時取得資料
  onMounted(() => {
    getDiarys()
  })
</script>

<!-- <style scoped>
.diary-wall {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 10%;
  right: 10%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.title-section {
  position: relative;
  z-index: 1;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.title-icon {
  font-size: 4rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  font-weight: 300;
}

.title-decoration {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  margin: 0 auto;
  border-radius: 2px;
}

.search-field {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.search-field:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.category-filter {
  display: flex;
  justify-content: center;
}

.category-chips {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 8px;
  backdrop-filter: blur(10px);
}

.category-chip {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.category-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.selected-category {
  background: white !important;
  color: var(--v-primary-base) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-text {
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
}

.diary-grid {
  position: relative;
  z-index: 1;
}

.diary-col {
  margin-bottom: 2rem;
}

.diary-card-wrapper {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-state {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.empty-icon {
  margin-bottom: 1.5rem;
}

.empty-title {
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.empty-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.detail-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.detail-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-title {
  display: flex;
  align-items: center;
}

.detail-content {
  padding: 2rem;
}

.image-carousel {
  position: relative;
  margin-bottom: 2rem;
}

.carousel {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.carousel-image {
  border-radius: 12px;
}

.image-counter {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.description-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.description-title {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.description-content {
  color: #666;
  line-height: 1.8;
  white-space: pre-line;
  word-wrap: break-word;
  font-size: 1rem;
}

.creation-info {
  color: #888;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }

  .title-icon {
    font-size: 3rem;
  }

  .category-filter {
    margin-top: 1rem;
  }

  .category-chips {
    flex-wrap: wrap;
    justify-content: center;
  }

  .detail-header {
    padding: 1.5rem;
  }

  .detail-content {
    padding: 1.5rem;
  }
}
</style> -->

<route lang="yaml">
  meta:
    title: '回憶牆'
    login: ''
    admin: false
</route>
