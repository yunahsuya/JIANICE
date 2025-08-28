<template>
  <v-container class="pa-5" fluid>
    <!-- 頁面標題區域 -->
    <v-row class="mb-1">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold text-orange-darken-4 mb-1">
              <v-icon class="mr-3 mb-1" icon="mdi-book-open-variant" size="large" />
              我的回憶錄
            </h1>
            <p class="text-body-1 text-medium-emphasis">
              記錄生活中的美好時刻，分享您的快樂回憶
            </p>
          </div>
          <v-btn
            class="text-none"
            color="orange-darken-4"
            elevation="2"
            prepend-icon="mdi-plus"
            size="large"
            @click="openDialog(null)"
          >
            新增回憶
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- 搜尋和篩選區域 -->
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center gap-4 pa-1">
          <v-text-field
            v-model="search"
            class="flex-grow-1 mr-3"
            clearable
            density="comfortable"
            hide-details
            placeholder="搜尋回憶標題、內容或分類..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
          />
          <v-select
            v-model="selectedCategory"
            class="flex-shrink-0"
            clearable
            density="comfortable"
            hide-details
            :items="categoryOptions"
            label="分類篩選"
            style="min-width: 150px"
            variant="outlined"
          />
        </div>
      </v-col>
    </v-row>

    <!-- 數據表格 -->
    <v-row>
      <v-col cols="12">
        <v-card class="overflow-hidden" elevation="2">
          <v-data-table
            class="elevation-0"
            density="default"
            :headers="headers"
            hover
            item-value="_id"
            :items="filteredDiarys"
            :loading="loading"
            :search="search"
          >
            <!-- 建立日期欄位 -->
            <template #[`item.createdAt`]="{ item }">
              <div class="d-flex flex-column">
                <span class="text-body-2 font-weight-medium">
                  {{ new Date(item.createdAt).toLocaleDateString('zh-TW') }}
                </span>
                <span class="text-caption text-medium-emphasis">
                  {{ new Date(item.createdAt).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }) }}
                </span>
              </div>
            </template>

            <!-- 日期欄位 -->
            <template #[`item.date`]="{ item }">
              <div class="d-flex flex-column">
                <span class="text-body-2 font-weight-medium">
                  {{ item.date ? new Date(item.date).toLocaleDateString('zh-TW') : '-' }}
                </span>
                <span class="text-caption text-medium-emphasis">
                  {{ item.date ? new Date(item.date).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }) : '-' }}
                </span>
              </div>
            </template>

            <!-- 圖片欄位 -->
            <template #[`item.image`]="{ value }">
              <div v-if="value && value.length > 0" class="d-flex flex-wrap gap-2">
                <v-img
                  v-for="(img, index) in value.slice(0, 3)"
                  :key="index"
                  class="rounded"
                  cover
                  height="100"
                  :src="img"
                  width="100"
                />
                <div
                  v-if="value.length > 3"
                  class="d-flex align-center justify-center rounded bg-grey-lighten-3"
                  style="height: 60px; width: 60px;"
                >
                  <span class="text-caption text-medium-emphasis">+{{ value.length - 3 }}</span>
                </div>
              </div>
              <span v-else class="text-grey text-caption">無圖片</span>
            </template>

            <!-- 標題欄位 -->
            <template #[`item.title`]="{ value }">
              <div class="text-body-2 font-weight-medium text-truncate" style="max-width: 200px;">
                {{ value || '無標題' }}
              </div>
            </template>

            <!-- 描述欄位 -->
            <template #[`item.description`]="{ value }">
              <div class="text-body-2" style="max-width: 150px; white-space: pre-wrap; word-wrap: break-word;">
                {{ value || '無描述' }}
              </div>
            </template>

            <!-- 分類欄位 -->
            <template #[`item.category`]="{ value }">
              <v-chip
                class="text-none"
                :color="getCategoryColor(value)"
                size="small"
                variant="tonal"
              >
                {{ value }}
              </v-chip>
            </template>

            <!-- 顯示狀態欄位 -->
            <template #[`item.sell`]="{ item, value }">
              <v-chip
                class="text-none cursor-pointer"
                :color="value ? 'success' : 'grey'"
                :loading="item.updating"
                size="small"
                variant="tonal"
                @click="toggleVisibility(item)"
              >
                <v-icon
                  class="mr-1"
                  :icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                  size="small"
                />
                {{ value ? '公開' : '私人' }}
              </v-chip>
            </template>

            <!-- 操作欄位 -->
            <template #[`item.actions`]="{ item }">
              <div class="d-flex gap-1">
                <v-btn
                  class="text-none"
                  color="primary"
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="openDialog(item)"
                />
                <v-btn
                  class="text-none"
                  color="error"
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  @click="confirmDelete(item)"
                />
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- 新增/編輯對話框 -->
  <v-dialog v-model="dialog.open" max-width="700" persistent scrollable>
    <v-form :disabled="isSubmitting" @submit.prevent="submit">
      <v-card>
        <!-- 對話框標題 -->
        <v-card-title class="d-flex align-center justify-space-between pa-6 pb-4">
          <div class="d-flex align-center">
            <v-icon
              class="mr-3"
              :color="dialog.id ? 'warning' : 'primary'"
              :icon="dialog.id ? 'mdi-pencil' : 'mdi-plus'"
              size="large"
            />
            <span class="text-h5 font-weight-medium">
              {{ dialog.id ? '編輯回憶' : '新增回憶' }}
            </span>
          </div>
          <v-btn
            class="text-none"
            icon="mdi-close"
            variant="text"
            @click="closeDialog"
          />
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-6">
          <v-row>
            <!-- 日期和時間 -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="date.value.value"
                density="comfortable"
                :error-messages="date.errorMessage.value"
                label="日期和時間"
                prepend-inner-icon="mdi-calendar-clock"
                type="datetime-local"
                variant="outlined"
              />
            </v-col>

            <!-- 分類 -->
            <v-col cols="12" md="6">
              <v-select
                v-model="category.value.value"
                density="comfortable"
                :error-messages="category.errorMessage.value"
                :items="categoryOptions"
                label="分類"
                prepend-inner-icon="mdi-tag"
                variant="outlined"
              />
            </v-col>

            <!-- 標題 -->
            <v-col cols="12">
              <v-text-field
                v-model="title.value.value"
                density="comfortable"
                :error-messages="title.errorMessage.value"
                label="回憶標題"
                placeholder="為您的回憶取個標題..."
                prepend-inner-icon="mdi-format-title"
                variant="outlined"
              />
            </v-col>

            <!-- 描述 -->
            <v-col cols="12">
              <v-textarea
                v-model="description.value.value"
                auto-grow
                density="comfortable"
                :error-messages="description.errorMessage.value"
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
                  <v-icon class="mr-2" color="primary" icon="mdi-image" />
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
                  :url-resolver="(file) => file.url || file.data"
                />
              </v-card>
            </v-col>

            <!-- 顯示設定 -->
            <v-col cols="12">
              <v-card class="pa-4" variant="outlined">
                <v-switch
                  v-model="sell.value.value"
                  class="ma-0"
                  color="success"
                  :error-messages="sell.errorMessage.value"
                  hide-details
                  label="公開分享到回憶牆"
                >
                  <template #prepend>
                    <v-icon class="mr-2" color="success" icon="mdi-eye" />
                  </template>
                </v-switch>
                <p class="text-caption text-medium-emphasis mt-2 mb-0">
                  開啟後，其他用戶可以在回憶牆上看到您的分享
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
            :disabled="isSubmitting"
            variant="outlined"
            @click="closeDialog"
          >
            取消
          </v-btn>
          <v-btn
            class="text-none"
            :color="dialog.id ? 'warning' : 'primary'"
            :loading="isSubmitting"
            type="submit"
          >
            <v-icon
              class="mr-2"
              :icon="dialog.id ? 'mdi-content-save' : 'mdi-plus'"
            />
            {{ dialog.id ? '儲存變更' : '新增回憶' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

  <!-- 刪除確認對話框 -->
  <v-dialog v-model="deleteDialog.open" max-width="400">
    <v-card>
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon class="mr-3" color="error" icon="mdi-alert" size="large" />
        <span class="text-h6">確認刪除</span>
      </v-card-title>

      <v-card-text class="pa-6 pt-0">
        <p class="text-body-1">
          您確定要刪除這則回憶嗎？此操作無法復原。
        </p>
        <p class="text-body-2 text-medium-emphasis mt-2">
          標題：{{ deleteDialog.item?.title || '無標題' }}
        </p>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn
          class="text-none"
          color="grey-darken-1"
          variant="outlined"
          @click="deleteDialog.open = false"
        >
          取消
        </v-btn>
        <v-btn
          class="text-none"
          color="error"
          :loading="deleteDialog.loading"
          @click="deleteDiary(deleteDialog.item?._id)"
        >
          <v-icon class="mr-2" icon="mdi-delete" />
          確認刪除
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { useField, useForm } from 'vee-validate'
  import { computed, ref } from 'vue'
  import { useSnackbar } from 'vuetify-use-dialog'
  import * as yup from 'yup'
  import diaryService from '../../services/diary'

  const createSnackbar = useSnackbar()

  // 響應式數據
  const diarys = ref([])
  const search = ref('')
  const selectedCategory = ref(null)
  const loading = ref(false)

  // 表格標題
  const headers = [
    {
      title: '建立時間',
      key: 'createdAt',
      sortable: true,
      width: '140px',
    },
    {
      title: '回憶日期',
      key: 'date',
      sortable: true,
      width: '140px',
    },
    {
      title: '圖片',
      key: 'image',
      sortable: false,
      width: '120px',
    },
    {
      title: '標題',
      key: 'title',
      sortable: true,
      width: '200px',
    },
    {
      title: '內容',
      key: 'description',
      sortable: false,
      width: '300px',
    },
    {
      title: '分類',
      key: 'category',
      sortable: true,
      width: '100px',
    },
    {
      title: '狀態',
      key: 'sell',
      sortable: true,
      width: '100px',
    },
    {
      title: '操作',
      key: 'actions',
      sortable: false,
      width: '100px',
    },
  ]

  const categoryOptions = ['快樂', '問題', '難過', '生氣', '平靜']

  // 篩選後的日記數據
  const filteredDiarys = computed(() => {
    let filtered = diarys.value

    if (selectedCategory.value) {
      filtered = filtered.filter(diary => diary.category === selectedCategory.value)
    }

    return filtered
  })

  // 獲取分類顏色
  const getCategoryColor = category => {
    const colors = {
      快樂: 'success',
      問題: 'warning',
      難過: 'info',
      生氣: 'error',
      平靜: 'grey',
    }
    return colors[category] || 'grey'
  }

  // 獲取日記數據
  const getDiarys = async () => {
    loading.value = true
    try {
      const { data } = await diaryService.getAll()
      diarys.value = data.diarys
    } catch (error) {
      console.error('Error fetching diarys:', error)
      createSnackbar({
        text: '無法載入回憶資料',
        snackbarProps: {
          color: 'error',
        },
      })
    } finally {
      loading.value = false
    }
  }

  // 初始化
  getDiarys()

  // 對話框相關
  const dialog = ref({
    open: false,
    id: '',
  })

  const deleteDialog = ref({
    open: false,
    item: null,
    loading: false,
  })

  // 檔案上傳相關
  const fileAgent = ref(null)
  const fileRecords = ref([])
  const rawFileRecords = ref([])

  // 開啟對話框
  const openDialog = item => {
    if (item) {
      // 編輯模式
      dialog.value.id = item._id
      if (item.date) {
        const dateObj = new Date(item.date)
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, '0')
        const day = String(dateObj.getDate()).padStart(2, '0')
        const hours = String(dateObj.getHours()).padStart(2, '0')
        const minutes = String(dateObj.getMinutes()).padStart(2, '0')
        date.value.value = `${year}-${month}-${day}T${hours}:${minutes}`
      } else {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')
        date.value.value = `${year}-${month}-${day}T${hours}:${minutes}`
      }
      title.value.value = item.title
      description.value.value = item.description
      sell.value.value = item.sell
      category.value.value = item.category

      if (item.image && item.image.length > 0) {
        const existingFiles = item.image.map((imageUrl, index) => ({
          name: `existing-image-${index}.jpg`,
          size: 0,
          type: 'image/jpeg',
          url: imageUrl,
          isExisting: true,
        }))
        fileRecords.value = existingFiles
      } else {
        fileRecords.value = []
      }
    } else {
      // 新增模式
      dialog.value.id = ''
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      date.value.value = `${year}-${month}-${day}T${hours}:${minutes}`
      title.value.value = ''
      description.value.value = '1. \n2. \n3. '
      category.value.value = '快樂'
      sell.value.value = false
      fileRecords.value = []
      rawFileRecords.value = []
    }
    dialog.value.open = true
  }

  // 關閉對話框
  const closeDialog = () => {
    dialog.value.open = false
    dialog.value.id = ''
    resetForm()
    fileRecords.value = []
    rawFileRecords.value = []
  }

  // 確認刪除
  const confirmDelete = item => {
    deleteDialog.value.item = item
    deleteDialog.value.open = true
  }

  // 表單驗證
  const { handleSubmit, resetForm, isSubmitting } = useForm({
    validationSchema: yup.object({
      date: yup.string().max(20, '日期最多只能有 20 字元'),
      title: yup.string().max(50, '標題最多只能有 50 字元'),
      description: yup.string().max(1000, '最多只能有 1000 字元'),
      category: yup
        .string()
        .required('分類是必填的')
        .oneOf(categoryOptions, '請選擇有效的分類'),
      sell: yup.boolean().required('是否顯示在回憶牆上，是必填的'),
    }),
    initialValues: {
      date: new Date().toISOString(),
      title: '',
      description: '1.  \n2.  \n3.  ',
      category: '快樂',
      sell: false,
    },
  })

  const date = useField('date')
  const title = useField('title')
  const description = useField('description')
  const category = useField('category')
  const sell = useField('sell')

  // 提交表單
  const submit = handleSubmit(async values => {
    if (fileRecords.value.some(file => file.error)) {
      createSnackbar({
        text: '請選擇有效的圖片檔案',
        snackbarProps: {
          color: 'error',
        },
      })
      return
    }

    if (dialog.value.id.length === 0 && fileRecords.value.length === 0) {
      createSnackbar({
        text: '請上傳回憶錄圖片',
        snackbarProps: {
          color: 'error',
        },
      })
      return
    }

    try {
      const fd = new FormData()

      let dateToSend = values.date
      if (dialog.value.id.length === 0) {
        const userDate = new Date(values.date)
        const now = new Date()
        userDate.setSeconds(now.getSeconds())
        dateToSend = userDate.toISOString()
      }

      fd.append('date', dateToSend)
      fd.append('title', values.title)
      fd.append('description', values.description)
      fd.append('sell', values.sell)
      fd.append('category', values.category)

      const newFiles = fileRecords.value.filter(file => file.file)
      const existingFiles = fileRecords.value.filter(file => file.isExisting)

      if (newFiles.length > 0) {
        for (const fileRecord of newFiles) {
          fd.append('image', fileRecord.file)
        }
      }

      if (dialog.value.id.length > 0 && existingFiles.length > 0) {
        const existingUrls = existingFiles.map(file => file.url)
        fd.append('existingImages', JSON.stringify(existingUrls))
      }

      await (dialog.value.id.length === 0
        ? diaryService.create(fd)
        : diaryService.update(dialog.value.id, fd)
      )

      createSnackbar({
        text: dialog.value.id ? '回憶更新成功' : '回憶新增成功',
        snackbarProps: {
          color: 'success',
        },
      })

      closeDialog()
      getDiarys()
    } catch (error) {
      console.error(error)
      createSnackbar({
        text: error?.response?.data?.message || '操作失敗，請稍後嘗試',
        snackbarProps: {
          color: 'error',
        },
      })
    }
  })

  // 刪除日記
  const deleteDiary = async id => {
    deleteDialog.value.loading = true
    try {
      await diaryService.delete(id)
      createSnackbar({
        text: '回憶刪除成功',
        snackbarProps: {
          color: 'success',
        },
      })
      deleteDialog.value.open = false
      getDiarys()
    } catch (error) {
      console.error(error)
      createSnackbar({
        text: error?.response?.data?.message || '刪除失敗，請稍後嘗試',
        snackbarProps: {
          color: 'error',
        },
      })
    } finally {
      deleteDialog.value.loading = false
    }
  }

  // 切換公開/私人狀態
  const toggleVisibility = async item => {
    // 防止重複點擊
    if (item.updating) return

    // 設置更新狀態
    item.updating = true

    try {
      const fd = new FormData()
      fd.append('date', item.date)
      fd.append('title', item.title)
      fd.append('description', item.description)
      fd.append('sell', !item.sell) // 切換狀態
      fd.append('category', item.category)

      // 如果有現有圖片，保留它們
      if (item.image && item.image.length > 0) {
        fd.append('existingImages', JSON.stringify(item.image))
      }

      await diaryService.update(item._id, fd)

      // 更新本地狀態
      item.sell = !item.sell

      createSnackbar({
        text: item.sell ? '已設為公開' : '已設為私人',
        snackbarProps: {
          color: 'success',
        },
      })
    } catch (error) {
      console.error(error)
      createSnackbar({
        text: error?.response?.data?.message || '狀態更新失敗',
        snackbarProps: {
          color: 'error',
        },
      })
    } finally {
      item.updating = false
    }
  }
</script>

<route lang="yaml">
meta:
  layout: "user"
  title: "我的回憶錄"
  login: "login-only"
</route>
