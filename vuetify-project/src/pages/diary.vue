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
    <v-row v-else-if="currentPageDiarys.length > 0">
      <v-col
        v-for="diary in currentPageDiarys"
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
          v-if="user.isLoggedIn"
          class="mt-4"
          color="success"
          @click="$router.push('/user/diary')"
        >
          新增回憶
        </v-btn>
      </v-col>
    </v-row>

    <!-- 分頁 -->
    <div v-if="totalPages > 1 && !loading" class="d-flex justify-center mt-10">
      <v-pagination
        v-model="page"
        :length="totalPages"
        rounded="circle"
        :total-visible="7"
      />
    </div>

    <!-- 日記詳情對話框 -->
    <v-dialog v-model="detailDialog.open" max-width="800">
      <v-card v-if="detailDialog.diary">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="d-flex align-center mr-3" style="flex: 1; min-width: 0;">
            <!-- 標題 -->
            <div v-if="!editMode" class="d-flex align-center gap-3">
              <span class="text-h5 text-primary-darken-1 font-weight-bold">
                {{ detailDialog.diary.title || '無標題' }}
              </span>
              <!-- 日期標籤 -->
              <v-chip
                v-if="detailDialog.diary.date"
                color="success"
                size="small"
                class="ml-2"

              >
                {{ formatDate(detailDialog.diary.date) }}
              </v-chip>
            </div>
            <!-- 編輯模式的標題輸入框 -->
            <div v-else class="d-flex align-center gap-3" style="flex: 1;">
              <v-text-field
                 v-model="editForm.title"
                 class="title-input"
                 density="compact"
                 hide-details
                 placeholder="輸入標題"
                 variant="outlined"
                 :style="{
                   width: Math.max(200, Math.min(400, (editForm.title?.length || 0) * 12 + 100)) + 'px',
                   maxWidth: '400px',
                   minWidth: '100px'
                 }"

              />
              <!-- 編輯模式下的日期標籤 -->
              <v-chip
                v-if="detailDialog.diary.date"
                color="success"
                size="small"
                class="ml-2"
              >
                {{ formatDate(detailDialog.diary.date) }}
              </v-chip>
            </div>
          </div>
          <div class="d-flex align-center gap-2 ml-4">
            <!-- 編輯按鈕 -->
            <v-btn
              v-if="!editMode && canEdit"
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="startEdit"
            />
            <!-- 保存和取消按鈕 -->
            <v-btn
              v-if="editMode"
              :disabled="saving"
              icon="mdi-check"
              size="small"
              variant="text"
              @click="saveEdit"
            />
            <v-btn
              v-if="editMode"
              icon="mdi-close"
              size="small"
              variant="text"
              @click="cancelEdit"
            />
            <!-- 關閉按鈕 -->
            <v-btn
              v-if="!editMode"
              icon="mdi-close"
              variant="text"
              @click="closeDiaryDetail"
            />
          </div>
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

          <!-- 日期編輯 -->
          <div v-if="editMode" class="mb-4">
            <v-label class="text-body-2 font-weight-medium mb-2">回憶日期</v-label>
            <v-text-field
              v-model="editForm.date"
              density="compact"
              hide-details
              type="datetime-local"
              variant="outlined"
            />
          </div>

          <!-- 分類編輯 -->
          <div v-if="editMode" class="mb-4">
            <v-label class="text-body-2 font-weight-medium mb-2">分類</v-label>
            <v-select
              v-model="editForm.category"
              density="compact"
              hide-details
              :items="categoryOptionsForEdit"
              variant="outlined"
            />
          </div>

          <!-- 描述內容 -->
          <div class="text-body-1">
            <h4 class="text-h6 mb-2">今日三件好事：</h4>
            <v-textarea
              v-if="editMode"
              v-model="editForm.description"
              hide-details
              placeholder="輸入您的回憶內容..."
              rows="6"
              variant="outlined"
            />
            <p
              v-else
              class="text-body-1"
              style="white-space: pre-wrap !important; word-wrap: break-word !important; word-break: break-all !important; overflow-wrap: break-word !important; max-width: 100% !important; line-height: 1.6 !important; display: block !important; width: 100% !important; box-sizing: border-box !important;"
            >
              {{ detailDialog.diary.description }}
            </p>
          </div>

          <!-- 公開/私人狀態編輯 -->
          <div v-if="editMode" class="mt-4">
            <v-label class="text-body-2 font-weight-medium mb-2">顯示狀態</v-label>
            <v-switch
              v-model="editForm.sell"
              color="success"
              hide-details
              :label="editForm.sell ? '公開' : '私人'"
            />
          </div>

          <!-- 建立時間 -->
          <v-divider class="my-4" />
          <div class="text-caption text-grey">
            建立於：{{ formatDateTime(detailDialog.diary.createdAt) }}
          </div>
        </v-card-text>

        <!-- 保存按鈕區域 -->
        <v-card-actions v-if="editMode" class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="outlined"
            @click="cancelEdit"
          >
            取消
          </v-btn>
          <v-btn
            class="ml-3"
            color="success"
            :loading="saving"
            variant="flat"
            @click="saveEdit"
          >
            保存變更
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import DiaryCard from '@/components/diary/DiaryCard.vue'
  import diaryService from '@/services/diary'
  import { useUserStore } from '@/stores/user'
  import { useSnackbar } from 'vuetify-use-dialog'

  const user = useUserStore()
  const createSnackbar = useSnackbar()

  // 響應式資料
  const diarys = ref([])
  const loading = ref(true)
  const searchQuery = ref('')
  const selectedCategory = ref('全部')
  const page = ref(1)

  // 詳情對話框
  const detailDialog = ref({
    open: false,
    diary: null,
  })

  // 編輯模式相關
  const editMode = ref(false)
  const saving = ref(false)
  const editForm = ref({
    title: '',
    description: '',
    category: '',
    date: '',
    sell: true,
  })

  // 分類選項
  const categoryOptions = ['全部', '快樂',  '難過', '生氣', '平靜','問題','職訓局']
  const categoryOptionsForEdit = ['快樂', '難過', '生氣', '平靜', '問題', '職訓局']

  // 計算屬性：檢查是否可編輯（只有登入用戶才能編輯）
  const canEdit = computed(() => {
    return user.isLoggedIn
  })

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
    page.value = 1 // 重置分頁到第一頁
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

  // 分頁相關計算屬性
  const ITEMS_PER_PAGE = 12
  const totalPages = computed(() => {
    return Math.ceil(filteredDiarys.value.length / ITEMS_PER_PAGE)
  })

  const currentPageDiarys = computed(() => {
    const start = (page.value - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredDiarys.value.slice(start, end)
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
    editMode.value = false
  }

  // 關閉日記詳情
  const closeDiaryDetail = () => {
    detailDialog.value.open = false
    detailDialog.value.diary = null
    editMode.value = false
  }

  // 開始編輯
  const startEdit = () => {
    if (!detailDialog.value.diary) return

    const diary = detailDialog.value.diary
    editForm.value = {
      title: diary.title || '',
      description: diary.description || '',
      category: diary.category || '快樂',
      date: diary.date ? formatDateForInput(diary.date) : '',
      sell: diary.sell !== undefined ? diary.sell : true,
    }
    editMode.value = true
  }

  // 取消編輯
  const cancelEdit = () => {
    editMode.value = false
    editForm.value = {
      title: '',
      description: '',
      category: '',
      date: '',
      sell: true,
    }
  }

  // 保存編輯
  const saveEdit = async () => {
    if (!detailDialog.value.diary) return

    saving.value = true
    try {
      const fd = new FormData()
      fd.append('title', editForm.value.title)
      fd.append('description', editForm.value.description)
      fd.append('category', editForm.value.category)
      fd.append('date', editForm.value.date)
      fd.append('sell', editForm.value.sell)

      // 保留現有圖片
      if (detailDialog.value.diary.image && detailDialog.value.diary.image.length > 0) {
        fd.append('existingImages', JSON.stringify(detailDialog.value.diary.image))
      }

      await diaryService.update(detailDialog.value.diary._id, fd)

      // 更新本地資料
      const diaryIndex = diarys.value.findIndex(d => d._id === detailDialog.value.diary._id)
      if (diaryIndex !== -1) {
        diarys.value[diaryIndex] = {
          ...diarys.value[diaryIndex],
          title: editForm.value.title,
          description: editForm.value.description,
          category: editForm.value.category,
          date: editForm.value.date,
          sell: editForm.value.sell,
        }
        // 更新對話框中的日記資料
        detailDialog.value.diary = diarys.value[diaryIndex]
      }

      createSnackbar({
        text: '回憶更新成功',
        snackbarProps: {
          color: 'success',
        },
      })

      editMode.value = false
    } catch (error) {
      console.error('更新回憶失敗:', error)
      createSnackbar({
        text: error?.response?.data?.message || '更新失敗，請稍後再試',
        snackbarProps: {
          color: 'error',
        },
      })
    } finally {
      saving.value = false
    }
  }

  // 格式化日期供輸入框使用
  const formatDateForInput = dateString => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
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

  // 監聽搜尋變化，重置分頁
  watch(searchQuery, () => {
    page.value = 1
  })

  // 頁面載入時取得資料
  onMounted(() => {
    getDiarys()
  })
</script>

<route lang="yaml">
  meta:
    title: '日記牆'
    login: 'login-only'  # 修改：需要登入
    admin: false
</route>
