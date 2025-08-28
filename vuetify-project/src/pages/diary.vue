<template>
  <v-container>

    <!-- 頁面標題區域 -->
    <v-row>
      <v-col cols="12">
        <h1 class="">回憶牆</h1>

        <v-divider class=" border-opacity-50" color="orange-darken-2" length="100" :thickness="5" />
        <!-- <p class="text-body-1 text-medium-emphasis mt-3">記錄生活中的美好時刻，分享您的快樂回憶</p> -->

      </v-col>
    </v-row>

    <!-- 篩選和搜尋區域 -->
    <v-row class="mb-4">

      <!-- 搜尋回憶 -->
      <v-col cols="12">
        <v-text-field
          v-model="searchQuery"
          clearable
          hide-details
          label="搜尋回憶"
        />
      </v-col>

    </v-row>

    <!-- 分類按鈕 -->
    <div class="mb-8">
      <div class="d-flex flex-wrap gap-3">
        <v-chip
          v-for="category in categoryOptions"
          :key="category"
          class="font-weight-medium transition-all hover-lift  mr-2"
          :color="selectedCategory === category ? 'primary' : 'default'"
          size="large"
          :variant="selectedCategory === category ? 'elevated' : 'outlined'"
          @click="selectCategory(category)"
        >
          <v-icon class="mr-2" :icon="getCategoryIcon(category)" />
          {{ category }}
        </v-chip>
      </div>
    </div>

    <!-- 載入中狀態 -->
    <v-row v-if="loading">
      <v-col class="text-center" cols="12">
        <v-progress-circular color="success" indeterminate size="64" />
        <p class="mt-4 text-body-1">載入回憶中...</p>
      </v-col>
    </v-row>

    <!-- 日記卡片網格 -->
    <v-row v-else-if="filteredDiarys.length > 0">
      <v-col
        v-for="diary in filteredDiarys"
        :key="diary._id"
        cols="12"
        lg="4"
        md="6"
        sm="6"
      >
        <DiaryCard :diary="diary" @click="openDiaryDetail(diary)" />
      </v-col>
    </v-row>

    <!-- 空狀態 -->
    <v-row v-else>
      <v-col class="text-center" cols="12">
        <v-icon class="mb-4" color="grey-lighten-1" size="64">mdi-book-heart-outline</v-icon>
        <h3 class="text-h5 text-grey-darken-1 mb-2">還沒有回憶</h3>
        <p class="text-body-1 text-grey">開始記錄您的美好時刻吧！</p>
        <v-btn
          v-if="user.isLogin"
          class="mt-4"
          color="success"
          @click="$router.push('/user/diary')"
        >
          新增回憶
        </v-btn>
      </v-col>
    </v-row>

    <!-- 日記詳情對話框 -->
    <v-dialog v-model="detailDialog.open" max-width="800">
      <v-card v-if="detailDialog.diary">
        <v-card-title class="d-flex align-center justify-space-between">
          <div>
            <!-- 標題 (左上角) 原本是分類 -->
            <span class="text-h5 text-primary-darken-1 font-weight-bold">{{ detailDialog.diary.title }}</span>
            <v-chip
              v-if="detailDialog.diary.date"
              class="ml-2"
              color="success"
              size="small"
            >
              {{ formatDate(detailDialog.diary.date) }}
            </v-chip>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="closeDiaryDetail" />
        </v-card-title>

        <v-card-text>
          <!-- 圖片輪播 -->
          <v-carousel
            v-if="detailDialog.diary.image && detailDialog.diary.image.length > 0"
            class="mb-4"
            height="400"
            hide-delimiter-background
            show-arrows="hover"
          >
            <v-carousel-item
              v-for="(image, index) in detailDialog.diary.image"
              :key="index"
            >
              <v-img
                class="rounded"
                cover
                height="100%"
                :src="image"
              />
            </v-carousel-item>
          </v-carousel>

          <!-- 描述內容 -->
          <div class="text-body-1">
            <h4 class="text-h6 mb-2">今日三件好事：</h4>
            <p
              class="text-body-1"
              style="white-space: pre-wrap !important; word-wrap: break-word !important; word-break: break-all !important; overflow-wrap: break-word !important; max-width: 100% !important; line-height: 1.6 !important; display: block !important; width: 100% !important; box-sizing: border-box !important;"
            >
              {{ detailDialog.diary.description }}
            </p>
          </div>

          <!-- 建立時間 -->
          <v-divider class="my-4" />
          <div class="text-caption text-grey">
            建立於：{{ formatDateTime(detailDialog.diary.createdAt) }}
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
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
  const selectedCategory = ref('全部')

  // 詳情對話框
  const detailDialog = ref({
    open: false,
    diary: null,
  })

  // 分類選項
  const categoryOptions = ['全部', '快樂',  '難過', '生氣', '平靜','問題','職訓局']

  // 取得分類圖標
  const getCategoryIcon = category => {
    const iconMap = {
      全部: 'mdi-book-heart',
      快樂: 'mdi-emoticon-happy',
      難過: 'mdi-emoticon-sad',
      生氣: 'mdi-emoticon-angry',
      平靜: 'mdi-emoticon-neutral',
      問題: 'mdi-help-circle',
      職訓局: 'mdi-school',
    }
    return iconMap[category] || 'mdi-book-heart'
  }

  // 選擇分類
  const selectCategory = category => {
    selectedCategory.value = category
  }

  // 計算屬性：篩選後的日記
  const filteredDiarys = computed(() => {
    let filtered = diarys.value

    // 按分類篩選
    if (selectedCategory.value && selectedCategory.value !== '全部') {
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

  // 頁面載入時取得資料
  onMounted(() => {
    getDiarys()
  })
</script>



<route lang="yaml">
  meta:
    title: '日記牆'
    login: ''
    admin: false
</route>
