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
      <v-col cols="12" lg="8" md="6">
        <v-text-field
          v-model="searchQuery"
          clearable
          hide-details
          label="搜尋回憶"
          variant="outlined"
        />
      </v-col>

      <!-- 排序選項 -->
      <v-col class="d-flex align-center" cols="12" lg="2" md="2">
        <v-select
          v-model="sortBy"
          clearable
          density="comfortable"
          hide-details
          :items="sortOptions"
          label="排序方式"
          prepend-inner-icon="mdi-sort"
          variant="outlined"
        />
      </v-col>

      <!-- 新增回憶按鈕 -->
      <v-col class="d-flex align-center" cols="12" lg="2" md="4">
        <v-btn
          v-if="user.isLoggedIn"
          block
          class="text-none"
          color="success"
          elevation="2"
          prepend-icon="mdi-plus"
          size="large"
          @click="openNewMemoryDialog"
        >
          新增回憶
        </v-btn>
      </v-col>
    </v-row>

     <!-- 新增：新增回憶對話框 -->
     <v-dialog v-model="newMemoryDialog.open" max-width="800" persistent>
      <v-form @submit.prevent="submitNewMemory">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between pa-6">
            <div class="d-flex align-center">
              <v-icon
                class="mr-3"
                color="success"
                icon="mdi-plus"
                size="large"
              />
              <span class="text-h5 font-weight-medium">新增回憶</span>
            </div>
            <v-btn
              class="text-none"
              icon="mdi-close"
              variant="text"
              @click="closeNewMemoryDialog"
            />
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-6">
            <v-row>
              <!-- 日期和時間 -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newMemoryForm.date"
                  density="comfortable"
                  :error-messages="newMemoryErrors.date"
                  label="日期和時間"
                  prepend-inner-icon="mdi-calendar-clock"
                  type="datetime-local"
                  variant="outlined"
                />
              </v-col>

              <!-- 分類 -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="newMemoryForm.category"
                  density="comfortable"
                  :error-messages="newMemoryErrors.category"
                  :items="categoryOptionsWithAddNew"
                  label="分類"
                  prepend-inner-icon="mdi-tag"
                  variant="outlined"
                  @update:model-value="handleCategoryChange"
                />
              </v-col>


              <!-- 標題 -->
              <v-col cols="12">
                <v-text-field
                  v-model="newMemoryForm.title"
                  density="comfortable"
                  :error-messages="newMemoryErrors.title"
                  label="回憶標題"
                  placeholder="為您的回憶取個標題..."
                  prepend-inner-icon="mdi-format-title"
                  variant="outlined"
                />
              </v-col>

              <!-- 描述 -->
              <v-col cols="12">
                <v-textarea
                  v-model="newMemoryForm.description"
                  auto-grow
                  density="comfortable"
                  :error-messages="newMemoryErrors.description"
                  label="每日發生的三件好事"
                  placeholder="記錄今天發生的三件好事..."
                  prepend-inner-icon="mdi-text"
                  rows="4"
                  variant="outlined"
                />
              </v-col>

              <!-- 圖片上傳 -->
              <v-col cols="12">
                <v-card class="pa-4" variant="outlined">
                  <div class="d-flex align-center mb-3">
                    <v-icon class="mr-2" color="success" icon="mdi-image" />
                    <span class="text-subtitle-1 font-weight-medium">回憶圖片</span>
                  </div>
                  <VueFileAgent
                    ref="fileAgent"
                    v-model="fileRecords"
                    v-model:raw-model-value="rawFileRecords"
                    accept="image/jpeg,image/png"
                    deletable
                    :error-text="{ type: '檔案格式不正確', size: '檔案大小不得超過 1MB' }"
                    help-text="選擇或拖曳圖片檔案到此處"
                    :max-files="5"
                    max-size="1MB"
                    multiple
                    theme="grid"
                    :url-resolver="(file) => {
                      if (file.url) return file.url
                      if (file.data) return file.data
                      if (file.preview) return file.preview
                      return null
                    }"
                  />
                </v-card>
              </v-col>

              <!-- 顯示設定 -->
              <v-col cols="12">
                <v-card class="pa-4" variant="outlined">
                  <v-switch
                    v-model="newMemoryForm.sell"
                    class="ma-0"
                    color="success"
                    :error-messages="newMemoryErrors.sell"
                    hide-details
                    label="公開分享到回憶牆"
                  >
                    <template #prepend>
                      <v-icon class="mr-2" color="success" icon="mdi-eye" />
                    </template>
                  </v-switch>
                  <p class="text-caption text-medium-emphasis mt-2 mb-0">
                    開啟後，可以在回憶牆上看到您的回憶
                  </p>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />

          <!-- 對話框按鈕 -->
          <v-card-actions class="pa-6">
            <v-spacer />
            <v-btn
              class="text-none"
              color="grey-darken-1"
              :disabled="newMemoryDialog.submitting"
              variant="outlined"
              @click="closeNewMemoryDialog"
            >
              取消
            </v-btn>
            <v-btn
              class="text-none"
              color="success"
              :loading="newMemoryDialog.submitting"
              type="submit"
              variant="flat"
            >
              <v-icon icon="mdi-plus" />
              新增回憶
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

     <!-- 新增：新增分類對話框 -->
     <v-dialog v-model="addCategoryDialog.open" max-width="500" persistent>
      <v-form @submit.prevent="submitNewCategory">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between pa-6">
            <div class="d-flex align-center">
              <v-icon
                class="mr-3"
                color="success"
                icon="mdi-tag-plus"
                size="large"
              />
              <span class="text-h5 font-weight-medium">新增自定義分類</span>
            </div>
            <v-btn
              class="text-none"
              icon="mdi-close"
              variant="text"
              @click="closeAddCategoryDialog"
            />
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-6">
            <v-text-field
              v-model="addCategoryForm.name"
              density="comfortable"
              :error-messages="addCategoryErrors.name"
              label="分類名稱"
              placeholder="例如：今日目標、開發紀錄..."
              prepend-inner-icon="mdi-tag"
              variant="outlined"
              maxlength="20"
              counter
            />
            <p class="text-caption text-medium-emphasis mt-2">
              分類名稱最多 20 個字元，新增後可以用來標記您的回憶
            </p>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-6">
            <v-spacer />
            <v-btn
              class="text-none"
              color="grey-darken-1"
              :disabled="addCategoryDialog.submitting"
              variant="outlined"
              @click="closeAddCategoryDialog"
            >
              取消
            </v-btn>
            <v-btn
              class="text-none"
              color="success"
              :loading="addCategoryDialog.submitting"
              type="submit"
              variant="flat"
            >
              <v-icon icon="mdi-plus" />
              新增分類
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>


    <!-- 浮動操作按鈕 -->
    <v-fab
      v-if="user.isLoggedIn"
      app
      color="success"
      icon="mdi-plus"
      location="bottom end"
      size="large"
      @click="openNewMemoryDialog"
    />

   <!-- 分類按鈕 -->
<div class="mb-8">
  <div class="d-flex flex-wrap gap-3 align-center">
    <v-chip
      v-for="category in allCategoryOptions"
      :key="category"
      class="font-weight-medium transition-all hover-lift mr-2"
      :color="selectedCategory === category ? 'primary' : 'default'"
      size="large"
      :variant="selectedCategory === category ? 'elevated' : 'outlined'"
      @click="selectCategory(category)"
    >
      <v-icon class="mr-2" :icon="getCategoryIcon(category)" />
      {{ category }}
    </v-chip>

    <!-- 新增分類按鈕 -->
    <v-btn
      v-if="user.isLoggedIn"
      class="text-none"
      color="success"
      prepend-icon="mdi-plus"
      size="small"
      variant="outlined"
      @click="openAddCategoryDialog"
    >
      新增分類
    </v-btn>
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
        show-first-last-page
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
                class="ml-2"
                color="success"
                size="small"
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
                :style="{
                  width: Math.max(200, Math.min(400, (editForm.title?.length || 0) * 12 + 100)) + 'px',
                  maxWidth: '400px',
                  minWidth: '100px'
                }"
                variant="outlined"
              />
              <!-- 編輯模式下的日期標籤 -->
              <v-chip
                v-if="detailDialog.diary.date"
                class="ml-2"
                color="success"
                size="small"
              >
                {{ formatDate(detailDialog.diary.date) }}
              </v-chip>
            </div>
          </div>
          <div class="d-flex align-center gap-2 ml-4">
            <!-- 編輯按鈕 -->
            <v-btn
              v-if="!editMode && canEdit"
              :loading="editLoading"
              :disabled="editLoading"
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
          <!-- 圖片顯示/編輯 -->
          <div v-if="!editMode">
            <!-- 瀏覽模式：圖片輪播 -->
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
          </div>

          <!-- 編輯模式：圖片管理 -->
          <div v-if="editMode" class="mb-4">
            <v-label class="text-body-2 font-weight-medium mb-2">圖片管理</v-label>

            <!-- 現有圖片 -->
            <div v-if="editForm.existingImages && editForm.existingImages.length > 0" class="mb-4">
              <p class="text-caption text-medium-emphasis mb-2">目前的圖片（點擊刪除鈕移除）</p>
              <div class="d-flex flex-wrap gap-2">
                <div
                  v-for="(image, index) in editForm.existingImages"
                  :key="index"
                  class="position-relative"
                  style="width: 120px; height: 120px;"
                >
                  <v-img
                    class="rounded"
                    cover
                    height="100%"
                    :src="image"
                    width="100%"
                  />
                  <v-btn
                    class="position-absolute"
                    color="error"
                    icon="mdi-close"
                    size="x-small"
                    style="top: 4px; right: 4px;"
                    variant="flat"
                    @click="removeExistingImage(index)"
                  />
                </div>
              </div>
            </div>

            <!-- 新增圖片上傳 -->
            <v-card class="pa-4" variant="outlined">
              <div class="d-flex align-center mb-3">
                <v-icon class="mr-2" color="success" icon="mdi-image" />
                <span class="text-subtitle-1 font-weight-medium">新增圖片</span>
              </div>
              <VueFileAgent
                ref="editFileAgent"
                v-model="editFileRecords"
                v-model:raw-model-value="editRawFileRecords"
                accept="image/jpeg,image/png"
                deletable
                :error-text="{ type: '檔案格式不正確', size: '檔案大小不得超過 1MB' }"
                help-text="選擇或拖曳圖片檔案到此處"
                :max-files="5"
                max-size="1MB"
                multiple
                theme="grid"
                :url-resolver="(file) => {
                  if (file.url) return file.url
                  if (file.data) return file.data
                  if (file.preview) return file.preview
                  return null
                }"
              />
            </v-card>
          </div>

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
  import { useSnackbar } from 'vuetify-use-dialog'
  import DiaryCard from '@/components/diary/DiaryCard.vue'
  import diaryService from '@/services/diary'
  import { useUserStore } from '@/stores/user'

  const user = useUserStore()
  const createSnackbar = useSnackbar()

  // 響應式資料
  const diarys = ref([])
  const loading = ref(true)
  const searchQuery = ref('')
  const selectedCategory = ref('全部')
  const page = ref(1)

  // 新增：排序相關
  const sortBy = ref('newest')

  // 新增：文件上傳相關
  const fileAgent = ref(null)
  const fileRecords = ref([])
  const rawFileRecords = ref([])

  // 編輯模式的文件上傳
  const editFileAgent = ref(null)
  const editFileRecords = ref([])
  const editRawFileRecords = ref([])

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
    existingImages: [], // 新增：現有圖片列表
  })

  // 分類選項
  const categoryOptions = ['全部', '快樂', '難過', '生氣', '平靜', '問題', '職訓局']
  // const categoryOptionsForEdit = new Set(['快樂', '難過', '生氣', '平靜', '問題', '職訓局'])



// 新增：包含「新增分類」選項的分類列表
const categoryOptionsWithAddNew = computed(() => {
  const categories = [...categoryOptionsForEdit.value]
  categories.push({
    title: '➕ 新增分類',
    value: '__add_new_category__',
    divider: true
  })
  return categories
})



// 新增：自定義分類相關
const customCategories = ref([])

  // 新增：新增分類對話框
  const addCategoryDialog = ref({
    open: false,
    submitting: false,
  })

  // 新增：新增分類表單
  const addCategoryForm = ref({
    name: '',
  })

  // 新增：新增分類錯誤訊息
  const addCategoryErrors = ref({
    name: [],
  })

  // 修改：計算所有分類選項（包含預設和自定義）
const allCategoryOptions = computed(() => {
  const defaultCategories = ['全部', '快樂', '難過', '生氣', '平靜', '問題', '職訓局']
  return [...defaultCategories, ...customCategories.value]
})

// 修改：編輯用的分類選項（不包含「全部」）
const categoryOptionsForEdit = computed(() => {
  const defaultCategories = ['快樂', '難過', '生氣', '平靜', '問題', '職訓局']
  return [...defaultCategories, ...customCategories.value]
})




   // 新增：處理分類變更
   const handleCategoryChange = (value) => {
    if (value === '__add_new_category__') {
      // 重置分類選擇
      newMemoryForm.value.category = '快樂'
      // 開啟新增分類對話框
      openAddCategoryDialog()
    }
  }

   // 新增：取得自定義分類
   const getCustomCategories = async () => {
    try {
      const { data } = await diaryService.getCustomCategories()
      customCategories.value = data.categories || []
    } catch (error) {
      console.error('取得自定義分類失敗:', error)
    }
  }

  // 新增：開啟新增分類對話框
  const openAddCategoryDialog = () => {
    addCategoryForm.value.name = ''
    addCategoryErrors.value.name = []
    addCategoryDialog.value.open = true
  }

  // 新增：關閉新增分類對話框
  const closeAddCategoryDialog = () => {
    addCategoryDialog.value.open = false
    addCategoryDialog.value.submitting = false
  }

  // 新增：驗證新增分類表單
  const validateAddCategoryForm = () => {
    addCategoryErrors.value.name = []

    if (!addCategoryForm.value.name.trim()) {
      addCategoryErrors.value.name.push('請輸入分類名稱')
      return false
    }

    if (addCategoryForm.value.name.trim().length > 20) {
      addCategoryErrors.value.name.push('分類名稱不能超過 20 個字元')
      return false
    }

    // 檢查是否與預設分類重複
    const defaultCategories = ['快樂', '難過', '生氣', '平靜', '問題', '職訓局']
    if (defaultCategories.includes(addCategoryForm.value.name.trim())) {
      addCategoryErrors.value.name.push('此分類名稱已存在')
      return false
    }

    // 檢查是否與自定義分類重複
    if (customCategories.value.includes(addCategoryForm.value.name.trim())) {
      addCategoryErrors.value.name.push('此分類名稱已存在')
      return false
    }

    return true
  }

  // 新增：提交新增分類
  const submitNewCategory = async () => {
    if (!validateAddCategoryForm()) {
      return
    }

    addCategoryDialog.value.submitting = true

    try {
      await diaryService.addCustomCategory(addCategoryForm.value.name.trim())

      createSnackbar({
        text: '分類新增成功！',
        snackbarProps: {
          color: 'success',
        },
      })

      closeAddCategoryDialog()
      await getCustomCategories() // 重新載入分類列表

      // 新增：自動選擇新建立的分類
      newMemoryForm.value.category = addCategoryForm.value.name.trim()
    } catch (error) {
      console.error('新增分類失敗:', error)
      createSnackbar({
        text: error?.response?.data?.message || '新增失敗，請稍後再試',
        snackbarProps: {
          color: 'error',
        },
      })
    } finally {
      addCategoryDialog.value.submitting = false
    }
  }









  // 新增：排序選項
  const sortOptions = [
    { title: '最新', value: 'newest' },
    { title: '最舊', value: 'oldest' },
  ]

  // 修改：計算屬性：篩選後的日記
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

    // 新增：排序
    if (sortBy.value) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt)
        const dateB = new Date(b.date || b.createdAt)

        if (sortBy.value === 'newest') {
          return dateB - dateA // 最新的在前面
        } else if (sortBy.value === 'oldest') {
          return dateA - dateB // 最舊的在前面
        }
        return 0
      })
    }

    return filtered
  })

  // 修改：取得分類圖標（添加更多圖標支援）
const getCategoryIcon = category => {
  const iconMap = {
    全部: 'mdi-book-heart',
    快樂: 'mdi-emoticon-happy',
    難過: 'mdi-emoticon-sad',
    生氣: 'mdi-emoticon-angry',
    平靜: 'mdi-emoticon-neutral',
    問題: 'mdi-help-circle',
    職訓局: 'mdi-school',
    今日目標: 'mdi-target',
    開發紀錄: 'mdi-code-braces',
    學習筆記: 'mdi-notebook',
    工作心得: 'mdi-briefcase',
    生活點滴: 'mdi-heart',
    旅行回憶: 'mdi-airplane',
    美食記錄: 'mdi-food',
    運動健身: 'mdi-dumbbell',
    閱讀心得: 'mdi-book-open',
    音樂分享: 'mdi-music',
    電影觀後感: 'mdi-movie',
    寵物日常: 'mdi-paw',
    家庭時光: 'mdi-home-heart',
    朋友聚會: 'mdi-account-group',
    健康管理: 'mdi-heart-pulse',
    財務記錄: 'mdi-wallet',
    創意發想: 'mdi-lightbulb',
    感恩日記: 'mdi-heart-multiple',
  }

  // 如果沒有對應的圖標，使用預設圖標
  return iconMap[category] || 'mdi-tag'
}

// 修改：驗證表單（修正 categoryOptionsForEdit.has 的問題）
const validateNewMemoryForm = () => {
  newMemoryErrors.value = {
    date: [],
    title: [],
    description: [],
    category: [],
    sell: [],
  }

  let isValid = true

  // 驗證標題
  if (newMemoryForm.value.title.length > 50) {
    newMemoryErrors.value.title.push('標題最多只能有 50 字元')
    isValid = false
  }

  // 驗證描述
  if (!newMemoryForm.value.description.trim()) {
    newMemoryErrors.value.description.push('請輸入回憶內容')
    isValid = false
  } else if (newMemoryForm.value.description.length > 1000) {
    newMemoryErrors.value.description.push('內容最多只能有 1000 字元')
    isValid = false
  }

  // 驗證分類（修正：使用 includes 而不是 has）
  if (!categoryOptionsForEdit.value.includes(newMemoryForm.value.category)) {
    newMemoryErrors.value.category.push('請選擇有效的分類')
    isValid = false
  }

  // 驗證圖片（使用 VueFileAgent）
  if (fileRecords.value.some(file => file.error)) {
    createSnackbar({
      text: '請選擇有效的圖片檔案',
      snackbarProps: {
        color: 'error',
      },
    })
    isValid = false
  }

  if (fileRecords.value.length === 0) {
    createSnackbar({
      text: '請上傳回憶圖片',
      snackbarProps: {
        color: 'error',
      },
    })
    isValid = false
  }

  return isValid
}

  // 選擇分類
  const selectCategory = category => {
    selectedCategory.value = category
    page.value = 1 // 重置分頁到第一頁
  }

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

  // 移除現有圖片
  const removeExistingImage = index => {
    editForm.value.existingImages.splice(index, 1)
  }

  // 開始編輯
  // 修改 startEdit 函數
const startEdit = async () => {
  if (!detailDialog.value.diary) return

  editLoading.value = true
  try {
    const diary = detailDialog.value.diary
    editForm.value = {
      title: diary.title || '',
      description: diary.description || '',
      category: diary.category || '快樂',
      date: diary.date ? formatDateForInput(diary.date) : '',
      sell: diary.sell === undefined ? true : diary.sell,
      existingImages: diary.image ? [...diary.image] : [], // 複製現有圖片列表
    }

    // 重置編輯模式的文件上傳
    editFileRecords.value = []
    editRawFileRecords.value = []

    editMode.value = true
  } catch (error) {
    console.error('進入編輯模式失敗:', error)
    createSnackbar({
      text: '進入編輯模式失敗，請稍後再試',
      snackbarProps: {
        color: 'error',
      },
    })
  } finally {
    editLoading.value = false
  }
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
      existingImages: [],
    }
    // 重置編輯模式的文件上傳
    editFileRecords.value = []
    editRawFileRecords.value = []
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

      // 保留的現有圖片
      if (editForm.value.existingImages && editForm.value.existingImages.length > 0) {
        fd.append('existingImages', JSON.stringify(editForm.value.existingImages))
      }

      // 新上傳的圖片
      const newFiles = editFileRecords.value.filter(file => file.file)
      if (newFiles.length > 0) {
        for (const fileRecord of newFiles) {
          fd.append('image', fileRecord.file)
        }
      }

      await diaryService.update(detailDialog.value.diary._id, fd)

      // 更新本地資料
      const diaryIndex = diarys.value.findIndex(d => d._id === detailDialog.value.diary._id)
      if (diaryIndex !== -1) {
        // 重新取得資料以確保圖片 URL 是最新的
        await getDiarys()

        // 找到更新後的日記
        const updatedDiary = diarys.value.find(d => d._id === detailDialog.value.diary._id)
        if (updatedDiary) {
          detailDialog.value.diary = updatedDiary
        }
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

  // 新增：監聽排序變化，重置分頁
  watch(sortBy, () => {
    page.value = 1
  })

  // 新增：新增回憶對話框
  const newMemoryDialog = ref({
    open: false,
    submitting: false,
  })

  // 修改：新增回憶表單（移除 images 屬性）
  const newMemoryForm = ref({
    date: '',
    title: '',
    description: '1. \n2. \n3. ',
    category: '快樂',
    sell: true,
  })

  // 修改：表單錯誤訊息（移除 images 錯誤）
  const newMemoryErrors = ref({
    date: [],
    title: [],
    description: [],
    category: [],
    sell: [],
  })

  // 修改：開啟新增回憶對話框
  const openNewMemoryDialog = () => {
    // 重置表單
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')

    newMemoryForm.value = {
      date: `${year}-${month}-${day}T${hours}:${minutes}`,
      title: '',
      description: '1. \n2. \n3. ',
      category: '快樂',
      sell: true,
    }

    // 清除錯誤訊息
    newMemoryErrors.value = {
      date: [],
      title: [],
      description: [],
      category: [],
      sell: [],
    }

    // 重置文件上傳
    fileRecords.value = []
    rawFileRecords.value = []

    newMemoryDialog.value.open = true
  }

  // 修改：關閉新增回憶對話框
  const closeNewMemoryDialog = () => {
    newMemoryDialog.value.open = false
    newMemoryDialog.value.submitting = false
    // 重置文件上傳
    fileRecords.value = []
    rawFileRecords.value = []
  }


  // 修改：提交新增回憶
  const submitNewMemory = async () => {
    if (!validateNewMemoryForm()) {
      return
    }

    newMemoryDialog.value.submitting = true

    try {
      const fd = new FormData()

      // 處理日期
      const userDate = new Date(newMemoryForm.value.date)
      const now = new Date()
      userDate.setSeconds(now.getSeconds())

      fd.append('date', userDate.toISOString())
      fd.append('title', newMemoryForm.value.title)
      fd.append('description', newMemoryForm.value.description)
      fd.append('category', newMemoryForm.value.category)
      fd.append('sell', newMemoryForm.value.sell)

      // 添加圖片檔案（使用 VueFileAgent）
      const newFiles = fileRecords.value.filter(file => file.file)
      if (newFiles.length > 0) {
        for (const fileRecord of newFiles) {
          fd.append('image', fileRecord.file)
        }
      }

      await diaryService.create(fd)

      createSnackbar({
        text: '回憶新增成功！',
        snackbarProps: {
          color: 'success',
        },
      })

      closeNewMemoryDialog()
      getDiarys() // 重新載入回憶列表
    } catch (error) {
      console.error('新增回憶失敗:', error)
      createSnackbar({
        text: error?.response?.data?.message || '新增失敗，請稍後再試',
        snackbarProps: {
          color: 'error',
        },
      })
    } finally {
      newMemoryDialog.value.submitting = false
    }
  }

  // 在 script setup 部分，在現有的響應式變數附近添加
const editLoading = ref(false)

  // 在 script setup 部分添加 canEdit 計算屬性
const canEdit = computed(() => {
  // 檢查用戶是否已登入
  if (!user.isLoggedIn) return false

  // 檢查是否有當前回憶
  if (!detailDialog.value.diary) return false

  // 這裡可以添加更多權限檢查邏輯
  // 例如：只有回憶的創建者才能編輯
  // 或者：管理員可以編輯所有回憶
  return true
})



  // 修改：頁面載入時取得資料
  onMounted(async () => {
    await Promise.all([
      getDiarys(),
      getCustomCategories(), // 新增：取得自定義分類
    ])
  })

</script>

<route lang="yaml">
  meta:
    title: '日記牆'
    login: 'login-only'  # 修改：需要登入
    admin: false
</route>
