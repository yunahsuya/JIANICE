<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">回憶錄管理</h1>
      </v-col>
      <v-divider />

      <v-col cols="12">
        <v-data-table :filter-keys="filterKeys" :headers="headers" :items="diarys" :search="search">
          <template #top>
            <v-toolbar>
              <div class="px-4">
                <v-btn variant="outlined" @click="openDialog(null)">新增回憶</v-btn>
              </div>

              <v-spacer />

              <div class="px-4">
                <v-text-field
                  v-model="search"
                  density="compact"
                  flat
                  hide-details
                  placeholder="搜尋回憶"
                  prepend-inner-icon="mdi-magnify"
                  variant="solo"
                  width="400"
                />
              </div>
            </v-toolbar>
          </template>

          <!-- 圖片 -->
          <template #[`item.image`]="{ value }">
            <div v-if="value && value.length > 0" class="d-flex flex-wrap gap-2">
              <v-img
                v-for="img in value"
                :key="img"
                class="rounded"
                cover
                height="100"
                :src="img"
                width="100"
              />
            </div>
            <span v-else class="text-grey">無圖片</span>
          </template>

          <!-- 上架 -->
          <template #[`item.sell`]="{ value }">
            <v-icon v-if="value" icon="mdi-check" />
          </template>

          <!-- 操作 -->
          <template #[`item.action`]="{ item }">
            <v-btn icon="mdi-pencil" variant="text" @click="openDialog(item)" />
            <v-btn color="red" icon="mdi-delete" variant="text" @click="deleteDiary(item._id)" />
          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="diaglog.open" persistent width="600">
    <v-form :disabled="isSubmitting" @submit.prevent="submit">
      <v-card>
        <v-card-title>{{ diaglog.id.length > 0 ? '編輯回憶' : "新增回憶" }}</v-card-title>

        <v-card-text>

          <v-text-field
            v-model="date.value.value"
            :error-messages="date.errorMessage.value"
            label="日期和時間"
            prepend-icon="mdi-calendar-clock"
            type="datetime-local"
          />

          <!-- <v-date-picker
            v-model="date.value.value"
            class="pb-6"
            color="pink-darken-1"
            :error-messages="date.errorMessage.value"
            label="日期"
            show-adjacent-months
          /> -->

          <!-- <v-text-field
            v-model="date.value.value"
            :error-messages="date.errorMessage.value"
            label="日期"
          /> -->

          <v-select
            v-model="category.value.value"
            :error-messages="category.errorMessage.value"
            :items="categoryOptions"
            label="分類"
          />

          <v-textarea
            v-model="description.value.value"
            :error-messages="description.errorMessage.value"
            label="每日發生的三件好事"
          />

          <VueFileAgent
            ref="fileAgent"
            v-model="fileRecords"
            v-model:raw-model-value="rawFileRecords"
            accept="image/jpeg,image/png"
            deletable
            :error-text="{ type: '檔案格式不正確', size: '檔案大小不得超過 1MB' }"
            help-text="選擇或拖曳檔案"
            :max-files="5"
            max-size="1MB"
            multiple
            :url-resolver="(file) => file.url || file.data"
          />

          <v-switch
            v-model="sell.value.value"
            color="success"
            :error-messages="sell.errorMessage.value"
            hide-details
            label="是否顯示在回憶牆上"
          />

        </v-card-text>

        <v-card-actions>
          <v-btn color="red" :disabled="isSubmitting" variant="tonal" @click="closeDialog">取消</v-btn>
          <v-btn color="green" :loading="isSubmitting" type="submit" variant="tonal">
            {{ diaglog.id.length > 0 ? '編輯' : '新增' }}
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-form>

  </v-dialog>
</template>

  <script setup>
  import { useField, useForm } from 'vee-validate'
  import { ref, useTemplateRef } from 'vue'

  import { useSnackbar } from 'vuetify-use-dialog'

  import * as yup from 'yup'
  import diaryService from '../../services/diary'

  const createSnackbar = useSnackbar()

  const diarys = ref([])
  const search = ref('')

  // ************************
  // *       表格顯示        *
  // ************************

  const headers = [
    { title: '建立日期', key: 'createdAt', value: item => new Date(item.createdAt).toLocaleString() },
    { title: '日期', key: 'date', value: item => {
      // 格式化日期，顯示完整的日期和時間，與建立日期和更新日期格式一致
      if (item.date) {
        return new Date(item.date).toLocaleString('zh-TW')
      }
      return ''
    } },
    { title: '圖片', key: 'image', sortable: false },
    { title: '每日發生的三件好事', key: 'description' },
    { title: '分類', key: 'category' },
    { title: '顯示', key: 'sell' },
    { title: '更新日期', key: 'updatedAt', value: item => new Date(item.updatedAt).toLocaleString() },
    { title: '編輯', key: 'action', sortable: false },
  ]

  const filterKeys = ['date', 'category', 'description', 'createdAt', 'updatedAt']

  const getDiarys = async () => {
    try {
      const { data } = await diaryService.getAll()
      diarys.value = data.diarys
    } catch (error) {
      console.error('Error fetching diarys:', error)
      createSnackbar({
        text: '無法載入回憶資料',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  }
  getDiarys()

  // ************************
  // *         表單          *
  // ************************
  const fileAgent = useTemplateRef('fileAgent')

  const diaglog = ref({
    open: false,
    id: '',
  })

  /*
    name = {
    value: ref(''), // ← 真正存值的地方
    errorMessage: ref(''), // 如果驗證失敗這裡會有訊息
    // 還有其他東西例如 handleBlur, meta 之類的
    }

    ✅ 你要改 name 的值
    👉 那你要先進入 name.value（因為 value 裡面才是真正的 ref）

    ✅ 然後再進入那個 ref 裡面真正的值
    👉 所以變成 name.value.value
  */
  // item 不是每次都有值的，它是個「可選的參數」，所以才需要 if (item) 來判斷
  // item => { ... } => 箭頭函式（匿名函式）
  // 如果有物品（item），他會自動幫我把東西擺到對話框裡～ (沒有，就新增)
  const openDialog = item => {
    if (item) {
      // 編輯模式：使用現有資料
      diaglog.value.id = item._id
      // 格式化日期為 YYYY-MM-DDTHH:MM 格式，適合 v-text-field type="datetime-local"
      if (item.date) {
        const dateObj = new Date(item.date)
        // 使用本地時間，避免時區問題
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, '0')
        const day = String(dateObj.getDate()).padStart(2, '0')
        const hours = String(dateObj.getHours()).padStart(2, '0')
        const minutes = String(dateObj.getMinutes()).padStart(2, '0')
        date.value.value = `${year}-${month}-${day}T${hours}:${minutes}`
      } else {
        // 使用本地時間，避免時區問題
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')
        date.value.value = `${year}-${month}-${day}T${hours}:${minutes}`
      }
      description.value.value = item.description
      sell.value.value = item.sell
      category.value.value = item.category

      // 新增：載入現有圖片
      if (item.image && item.image.length > 0) {
        // 將現有圖片路徑轉換為 VueFileAgent 格式
        const existingFiles = item.image.map((imageUrl, index) => ({
          name: `existing-image-${index}.jpg`,
          size: 0, // 現有圖片沒有檔案大小資訊
          type: 'image/jpeg', // 預設類型
          url: imageUrl, // 圖片 URL
          isExisting: true, // 標記為現有圖片
        }))
        fileRecords.value = existingFiles
      } else {
        fileRecords.value = []
      }
    } else {
      // 新增模式：自動填入當前時間
      diaglog.value.id = ''
      // 使用本地時間，避免時區問題，新增時不包含秒數
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      date.value.value = `${year}-${month}-${day}T${hours}:${minutes}`
      description.value.value = '1. \n2. \n3. '
      category.value.value = '快樂'
      sell.value.value = false
      // 清空圖片記錄
      fileRecords.value = []
      rawFileRecords.value = []
    }
    diaglog.value.open = true
  }

  // 關閉表單對話框
  // 重置表單欄位
  // 刪除圖片欄位的檔案
  const closeDialog = () => {
    // 把對話框的「開關」設定為 false，表示要「關閉視窗」
    // dialog => ref() 定義的 reactive 物件（reactive，可以追蹤變化）
    // .value 是因為 ref() 包的東西要用 .value 才能取到
    diaglog.value.open = false
    // 把目前操作的商品 ID 清空 (已經關掉表單，不管是新增還是編輯都結束了)
    // 把「目前編輯的對象」重設為沒有東西（空字串）
    diaglog.value.id = ''
    // 重置整個表單的欄位值 (回到初始狀態)
    resetForm()
    // 清空圖片記錄
    fileRecords.value = []
    rawFileRecords.value = []
  }

  const categoryOptions = ['快樂', '難過', '生氣', '平靜']

  // handleSubmit => 當表單被送出時，負責觸發驗證並處理送出邏輯的函式
  // resetForm    => 把整個表單「重置」為初始值的方法
  // isSubmitting => 一個布林值，表示「表單正在送出中」
  // 建立一個表單，加上這些 驗證規則 (驗證規則，是用 yup.object() 來幫我們定義的)
  // 搭配 const date = useField('date') 做使用 (表單提交時用 handleSubmit(onSubmit) 綁定)
  const { handleSubmit, resetForm, isSubmitting } = useForm({
    // validationSchema: yup.object({ => 這個屬性是 驗證規則的設定 (用 Yup 函式庫，來建立一個「驗證規則物件」)
    validationSchema: yup.object({
      // 日期 (驗證「日期」的欄位)
      date: yup
        .string()
        .max(20, '日期最多只能有 20 字元'),
      // .nullable(),

      // 描述
      description: yup
        .string()
        .max(500, '最多只能有 500 字元'),

      // 分類
      category: yup
        .string()
        .required('分類是必填的')
        .oneOf(categoryOptions, '請選擇有效的分類'),

      // 是否顯示在回憶牆上
      sell: yup
        .boolean()
        .required('是否顯示在回憶牆上，是必填的'),
    }),

    // 控制定義「一開始表單欄位的值」
    // 表單的起始樣子 (告訴整個表單系統：「欄位有哪些？」、「預設值要是什麼？」)
    // 「打開對話框時，欄位會自動是空的」
    // 「初始化」欄位值
    // 初始化，先寫
    initialValues: {
      // date: '',
      date: new Date().toISOString(), // 預設今天日期和時間 (包含完整時間)
      description: '1.  \n2.  \n3.  ',
      category: '快樂',
      sell: false,
    },
  })

  // useField => 綁定欄位、操作資料、追蹤狀態
  // 「操作」那些欄位
  // useField 後寫
  // useForm 會幫整個表單套上「驗證日期必填」的規則 (useField('date') 是綁定「日期」欄位的值、錯誤訊息、狀態等等，方便你在模板用 v-model 或取得錯誤訊息。)
  // 當你送出表單時，handleSubmit 會用 validationSchema 驗證整個表單的欄位，像 date 有沒有填、格式正不正確
  const date = useField('date')
  const description = useField('description')
  const category = useField('category')
  const sell = useField('sell')
  const fileRecords = ref([])
  const rawFileRecords = ref([])

  // 宣告一個叫 submit 的函式，它是透過 handleSubmit 這個方法建立的。
  // handleSubmit 是從 useForm() 來的，它會幫你先幫表單驗證成功，才會執行裡面的函式。
  // 裡面 async values => { ... } 是一個非同步函式，values 就是表單裡所有欄位填寫的資料。
  // 當你送出表單時，會先用 handleSubmit 來檢查，然後才執行裡面這個函式。
  // 當使用者送出表單時，先檢查他上傳的第一個圖片檔案有沒有錯誤，如果有錯誤，就跳出紅色錯誤提示，然後不繼續送出表單。
  const submit = handleSubmit(async values => {
    // 檢查是否有任何圖片檔案有錯誤
    if (fileRecords.value.some(file => file.error)) {
      createSnackbar ({
        text: '請選擇有效的圖片檔案',
        snackbarProps: {
          color: 'red',
        },
      })
      // 避免錯誤的圖片被送出
      return
    }
    //
    if (diaglog.value.id.length === 0 && fileRecords.value.length === 0) {
      createSnackbar({
        text: '請上傳回憶錄圖片',
        snackbarProps: {
          color: 'red',
        },
      })
      return
    }

    //
    try {
      const fd = new FormData()

      // 處理日期：如果是新增模式，自動加上秒數
      let dateToSend = values.date
      if (diaglog.value.id.length === 0) {
        // 新增模式：將用戶選擇的日期時間加上當前秒數
        const userDate = new Date(values.date)
        const now = new Date()
        userDate.setSeconds(now.getSeconds())
        dateToSend = userDate.toISOString()
      }

      fd.append('date', dateToSend)
      fd.append('description', values.description)
      fd.append('sell', values.sell)
      fd.append('category', values.category)

      // 🔥 修改：正確處理圖片上傳邏輯
      const newFiles = fileRecords.value.filter(file => file.file) // 只上傳新檔案
      const existingFiles = fileRecords.value.filter(file => file.isExisting) // 保留現有檔案

      // 將新選取的圖片檔案都加入到 FormData
      if (newFiles.length > 0) {
        for (const fileRecord of newFiles) {
          fd.append('image', fileRecord.file)
        }
      }

      // 如果是編輯模式且有現有圖片，將現有圖片 URL 也傳送
      if (diaglog.value.id.length > 0 && existingFiles.length > 0) {
        const existingUrls = existingFiles.map(file => file.url)
        fd.append('existingImages', JSON.stringify(existingUrls))
      }

      await (diaglog.value.id.length === 0 ? diaryService.create(fd) : diaryService.update(diaglog.value.id, fd))

      createSnackbar({
        text: '操作成功',
        snackbarProps: {
          color: 'green',
        },
      })

      closeDialog()

      getDiarys()
    } catch (error) {
      console.error(error)
      createSnackbar({
        text: error?.response?.data?.message || '操作失敗，請稍後嘗試',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  })

  const deleteDiary = async id => {
    try {
      await diaryService.delete(id)
      createSnackbar({
        text: '刪除成功',
        snackbarProps: {
          color: 'green',
        },
      })
      getDiarys()
    } catch (error) {
      console.error(error)
      createSnackbar({
        text: error?.response?.data?.message || '刪除失敗，請稍後嘗試',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  }
  </script>

  <route lang="yaml">
    meta:
      layout: "user"

      title: "回憶錄管理"

      login: "login-only"

  </route>
