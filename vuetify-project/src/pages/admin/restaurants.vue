<!-- <template> => Vue 的樣板區塊，放畫面結構 -->
<template>
  <!-- <v-container> => Vuetify 的容器，幫你做響應式左右邊距。 -->
  <v-container>
    <!-- <v-row> => 一列（grid row） -->
    <v-row>
      <!-- <v-col cols="12"> => 一欄，佔滿 12 格（整行）。 -->
      <v-col cols="12">
        <!-- <h1 class="text-center">餐廳管理</h1> => 標題，字置中。 -->
        <h1 class="text-center">餐廳管理</h1>
      </v-col>

      <!-- 分隔線 -->
      <v-divider />

      <v-col cols="12">
        <!-- Vuetify 資料表格：
             headers 定義欄位
             items 是資料
             search 是搜尋字串
             filter-keys 限制搜尋欄位。
        -->
        <v-data-table :filter-keys="filterKeys" :headers="headers" :items="restaurants" :search="search">

          <!-- 表格頂部工具列（slot：top） -->
          <!-- 新增餐廳 (btn) -->
          <!-- 用具名插槽 top 自訂表格上方工具列。 -->
          <template #top>
            <v-toolbar>
              <!-- 左內距 -->
              <div class="px-4">
                <!-- 外框按鈕
                     點了呼叫 openDialog(null) 開空白表單。
                -->
                <v-btn variant="outlined" @click="openDialog(null)">新增餐廳</v-btn>

              </div>

              <!-- 撐開左右空間，讓右側搜尋靠右 -->
              <v-spacer />

              <!-- 搜尋餐廳 (text-field) -->
              <!--
                單行輸入當搜尋框：雙向綁定
                clearable => 清除
                density="compact" => 高度 (小一點，剛好符合) 高度緊湊
                flat => 陰影 (無陰影)
                hide-details => 不要浮上去 (太貼邊緣) => 隱藏底部小字
                width="400" => 設置搜尋框，寬度
                variant="solo" => 設置搜尋框，樣式
              -->
              <!-- <div class="px-4"> => 包起來加左右內距 -->
              <div class="px-4">
                <v-text-field
                  v-model="search"
                  clearable
                  density="compact"
                  flat
                  hide-details
                  placeholder="搜尋餐廳"
                  prepend-inner-icon="mdi-magnify"
                  variant="solo"
                  width="400"
                />
              </div>
            </v-toolbar>
          </template>

          <!-- 表格內部欄位自訂渲染（item.* slots） -->

          <!-- 圖片 -->
          <!-- 動態插槽名稱（item.image）
               接到該欄位值，做自訂渲染。解構出 { value }。
          -->
          <template #[`item.image`]="{ value }">
            <!-- 顯示圖片，寬 75 -->
            <v-img :src="value" width="75" />
          </template>

          <!-- 上架 -->
          <!-- 自訂 sell 欄位渲染。 -->
          <template #[`item.sell`]="{ value }">
            <!-- 若 sell 為真(true)，就顯示打勾 icon。 -->
            <v-icon v-if="value" icon="mdi-check" />
          </template>

          <!-- 操作 (編輯、刪除) -->
          <!-- 自訂 action 欄位（操作） -->
          <template #[`item.action`]="{ item }">
            <!-- 文字樣式的鉛筆圖示按鈕；點擊把該筆 item 丟進對話框編輯。 -->
            <v-btn icon="mdi-pencil" variant="text" @click="openDialog(item)" />

          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>

  <!-- 對話框（新增/編輯） -->
  <!-- <v-dialog v-model="dialog.open" persistent width="600">
       對話框 => 用 dialog.open 控制開關
       persistent => 禁止點外面關閉；
       寬 600。
  -->
  <v-dialog v-model="dialog.open" persistent width="600">
    <!-- <v-form :disabled="isSubmitting" @submit.prevent="submit">
         表單：提交時跑 submit
         送出期間整張表單 disabled
    -->
    <v-form :disabled="isSubmitting" @submit.prevent="submit">
      <!-- 卡片外框 -->
      <v-card>
        <!-- 依有無 id 切換標題（有 id=編輯、無 id=新增） -->
        <v-card-title>{{ dialog.id.length > 0 ? '編輯餐廳': "新增餐廳" }}</v-card-title>

        <!-- <v-card-text> => 卡片內文 -->
        <v-card-text>

          <!--
          表單內容（每個欄位 + 驗證錯訊）
          你用的是 vee-validate 的 useField，所以像 name.value.value：
          第 1 個 .value 是取 field 物件裡的 value（它本身是 ref），第 2 個 .value 是把那個 ref 的值取出來。可把它想像成「盒中有盒」。🎁🎁
        -->

          <!-- 名稱 -->
          <!-- <v-text-field v-model="name.value.value" :error-messages="name.errorMessage.value" label="名稱" />
               名稱；
               雙向綁定到 name 欄位；
               錯誤訊息也綁定。
           -->
          <v-text-field
            v-model="name.value.value"
            :error-messages="name.errorMessage.value"
            label="名稱"
          />

          <!-- 地址 -->
          <v-text-field
            v-model="address.value.value"
            :error-messages="address.errorMessage.value"
            label="地址"
          />

          <!-- 縣市 -->
          <v-text-field
            v-model="city.value.value"
            :error-messages="city.errorMessage.value"
            label="縣市"
          />

          <!-- 電話 -->
          <v-text-field
            v-model="phone.value.value"
            :error-messages="phone.errorMessage.value"
            label="電話"
          />

          <!-- 價格 -->
          <!-- v-model.number => 把輸入自動轉成 數字 -->
          <v-text-field
            v-model.number="price.value.value"
            :error-messages="price.errorMessage.value"
            label="價格"
          />

          <!-- 分類 -->
          <!-- v-select 下拉選單 => 選項由 categoryOptions 提供；也綁定錯訊。 -->
          <v-select
            v-model="category.value.value"
            :error-messages="category.errorMessage.value"
            :items="categoryOptions"
            label="分類"
          />

          <!-- 營養提醒 -->
          <!-- 自由文字的營養提醒 -->
          <v-text-field
            v-model="nutritionInfo.value.value"
            :error-messages="nutritionInfo.errorMessage.value"
            label="營養提醒"
          />

          <!-- 描述 -->
          <v-textarea
            v-model="description.value.value"
            :error-messages="description.errorMessage.value"
            label="描述"
          />

          <!-- 第三方上傳元件：
                • ref="fileAgent" 之後可以程式控制（例如清檔）。
                • v-model="fileRecords" 存「顯示/狀態」資料。
                • v-model:raw-model-value="rawFileRecords" 存更原始資訊。
                • accept 只允許 jpg/png。
                • max-size="1MB"、error-text 客製錯誤字。
                • help-text 顯示提示字。
          -->
          <VueFileAgent
            ref="fileAgent"
            v-model="fileRecords"
            v-model:raw-model-value="rawFileRecords"
            accept="image/jpeg,image/png"
            deletable
            :error-text="{ type: '檔案格式不正確', size: '檔案大小不得超過 1MB' }"
            help-text="選擇或拖曳檔案"
            max-size="1MB"
          />

          <!-- 上架 -->
          <!-- 上下架開關
               綁定到 sell 欄位。
          -->
          <v-switch
            v-model="sell.value.value"
            color="success"
            :error-messages="sell.errorMessage.value"
            hide-details
            label="上架"
          />
        </v-card-text>

        <!-- 表單按鈕 -->
        <!-- <v-card-actions> => 卡片底部區。 -->
        <v-card-actions>
          <!-- 取消：關閉對話框，並做重置（等下看 closeDialog）。 -->
          <v-btn color="red" :disabled="isSubmitting" variant="tonal" @click="closeDialog">取消</v-btn>
          <!-- 送出：會觸發 <v-form> 的 submit
               loading 會跟 isSubmitting 連動；
               按鈕文字依新增/編輯切換。
          -->
          <v-btn color="green" :loading="isSubmitting" type="submit" variant="tonal">
            {{ dialog.id.length > 0 ? '編輯' : '新增' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<!-- Vue 3 的 SFC 語法糖，這裡寫的變數/函式可直接在 template 用 -->
<script setup>

  // 從 vee-validate 取欄位/表單的鉤子
  import { useField, useForm } from 'vee-validate'

  // Vue 的響應式工具；useTemplateRef 幫你抓 template 裡 ref="..."。
  import { ref, useTemplateRef } from 'vue'

  // 第三方小工具：顯示 Snackbar。
  import { useSnackbar } from 'vuetify-use-dialog'

  // 驗證 schema。
  import * as yup from 'yup'

  // 你的 API 服務（getAll/create/update）
  import restaurantService from '../../services/restaurant'

  // 生成能叫出 snackbar 的函式
  const createSnackbar = useSnackbar()

  // 表格資料（陣列）
  const restaurants = ref([])

  // 搜尋
  // 搜尋字串，跟搜尋框雙向綁定
  const search = ref('')

  // ************************
  // *       表格顯示        *
  // ************************

  // 表格欄位設定與搜尋鍵
  // v-data-table 欄位定義
  const headers = [
    // { title: 'ID', key: '_id' },

    // 表頭顯示「名稱」，資料用 item.name
    { title: '名稱', key: 'name' },

    // 不可排序，因為用自訂 slot 顯示圖
    { title: '圖片', key: 'image', sortable: false },
    { title: '地址', key: 'address' },
    { title: '電話', key: 'phone' },
    { title: '分類', key: 'category' },
    { title: '價格', key: 'price' },
    { title: '描述', key: 'description' },
    { title: '上架', key: 'sell' },
    { title: '營養提醒', key: 'nutritionInfo' },
    { title: '縣市', key: 'city' },

    // value 是轉換函式：把 createdAt 轉成當地時間字串
    { title: '建立日期', key: 'createdAt', value: item => new Date(item.createdAt).toLocaleString() },
    { title: '更新日期', key: 'updatedAt', value: item => new Date(item.updatedAt).toLocaleString() },

    // 操作欄，搭配 slot 放按鈕
    { title: '操作', key: 'action', sortable: false },
  ]

  // 限制搜尋會比對的欄位，避免全欄位模糊掃。
  const filterKeys = ['_id', 'name', 'address', 'phone', 'category', 'price', 'description', 'nutritionInfo', 'createdAt', 'updatedAt']

  // 取得資料
  // async => 非同步抓清單
  const getRestaurants = async () => {
    try {
      // 呼叫 API 取得資料
      const { data } = await restaurantService.getAll()

      // 塞進表格
      restaurants.value = data.restaurants
    } catch (error) {
      console.error('Error fetching restaurants:', error)

      // 失敗就顯示紅色 snackbar
      createSnackbar({
        text: '無法載入餐廳資料',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  }
  // 一載入就去抓一次
  getRestaurants()

  // ************************
  // *         表單          *
  // ************************

  // 對話框與表單控制

  // 對應 <VueFileAgent ref="fileAgent" />，好讓你程式控制（例如刪檔）
  const fileAgent = useTemplateRef('fileAgent')
  const dialog = ref({
    // 控制對話框開關與目前編輯的資料 id
    open: false,
    id: '',
  })

  // 開啟表單：如果有 item 就把各欄位灌入（進入編輯模式），然後 open=true
  const openDialog = item => {
    if (item) {
      dialog.value.id = item._id

      // 把資料丟進對應的 vee-validate 欄位。
      name.value.value = item.name
      address.value.value = item.address
      phone.value.value = item.phone
      price.value.value = item.price
      category.value.value = item.category
      description.value.value = item.description
      sell.value.value = item.sell
      nutritionInfo.value.value = item.nutritionInfo
      city.value.value = item.city
    }
    dialog.value.open = true
  }

  // 關閉表單
  const closeDialog = () => {
    // 關閉表單並重置：open = false
    dialog.value.open = false

    // 清空 id
    dialog.value.id = ''

    // resetForm()、fileAgent.value.deleteFileRecord() 清上傳檔
    resetForm()
    fileAgent.value.deleteFileRecord()
  }

  // 下拉選單的選項
  const categoryOptions = ['台式', '義式', '美式', '日式', '韓式', '蔬食', '早餐', '飲料', '麵', '飯', '義大利麵', '漢堡', '拉麵', '壽司']

  // vee-validate 表單與 yup 驗證
  //
  /*
    const { handleSubmit, resetForm, isSubmitting } = useForm({ validationSchema: yup.object({...}), initialValues: {...} })
    建立表單：給 schema（所有欄位的規則）與初始值。isSubmitting 在送出期間會自動為 true
    */
  const { handleSubmit, resetForm, isSubmitting } = useForm({
    validationSchema: yup.object({

      // 名稱，必填、長度限制
      name: yup
        .string()
        .required('餐廳名稱是必填的')
        .min(1, '餐廳名稱至少需要 1 個字')
        .max(100, '餐廳名稱最多只能有 100 個字'),
      address: yup
        .string()
        .required('餐廳地址是必填的')
        .min(1, '餐廳地址至少需要 1 個字')
        .max(50, '餐廳地址最多只能有 50 個字'),
      phone: yup
        .string()
        .required('餐廳電話是必填的')
        .min(9, '餐廳電話至少需要 9 個字')
        .max(10, '餐廳電話最多只能有 10 個字'),
      price: yup
        .number()
        .min(0, '價格不能為負數'),
      category: yup
        .string()
        .required('分類是必填的')
        // 必須是下拉提供的其中一種
        .oneOf(categoryOptions, '請選擇有效的分類'),
      description: yup
        .string()
        .max(500, '描述最多只能有 500 個字'),
      sell: yup
        .boolean()
        .required('是否上架是必填的'),
      nutritionInfo: yup
        .string(),
      city: yup
        .string()
        .min(3, '縣市至少需要 3 個字'),
    }),
    // initialValues => 新增模式時的預設值
    initialValues: {
      name: '',
      address: '',
      phone: '',
      price: 0,
      category: '',
      description: '',
      sell: true,
      nutritionInfo: '',
      city: '',
    },
  })

  // 綁定每個欄位（useField）

  // 產生 name 欄位控制物件（含 value、errorMessage 等）
  const name = useField('name')
  const address = useField('address')
  const phone = useField('phone')
  const price = useField('price')
  const category = useField('category')
  const description = useField('description')
  const sell = useField('sell')
  const nutritionInfo = useField('nutritionInfo')
  const city = useField('city')

  // 上傳元件的檔案列表（顯示用）
  const fileRecords = ref([])

  // 更原始的上傳資訊
  const rawFileRecords = ref([])

  // handleSubmit 會先跑驗證，再把合法的 values 丟進你的 async 函式
  const submit = handleSubmit(async values => {
    // 若第一個檔案有錯（超過大小/格式不對），彈錯並中斷
    if (fileRecords.value[0]?.error) {
      createSnackbar({
        text: '請選擇有效的檔案',
        snackbarProps: {
          color: 'red',
        },
      })
      return
    }

    // 新增模式一定要有圖片（編輯模式可不傳）。
    if (dialog.value.id.length === 0 && fileRecords.value.length === 0) {
      createSnackbar({
        text: '請上傳餐廳圖片',
        snackbarProps: {
          color: 'red',
        },
      })
      return
    }

    try {
      // 建立表單資料，方便傳檔案
      const fd = new FormData()
      // 逐一把表單欄位塞到 FormData
      fd.append('name', values.name)
      fd.append('address', values.address)
      fd.append('phone', values.phone)
      fd.append('price', values.price)
      fd.append('category', values.category)
      fd.append('description', values.description)
      fd.append('sell', values.sell)
      fd.append('nutritionInfo', values.nutritionInfo)
      fd.append('city', values.city)

      // 如果有上傳，就帶圖片檔
      if (fileRecords.value.length > 0) {
        fd.append('image', fileRecords.value[0].file)
      }

      // 三元運算：沒有 id → 新增；有 id → 更新該筆
      await (dialog.value.id.length === 0 ? restaurantService.create(fd) : restaurantService.update(dialog.value.id, fd))

      // 成功提示
      createSnackbar({
        text: '操作成功！',
        snackbarProps: {
          color: 'green',
        },
      })
      // 關閉並清空
      closeDialog()

      // 重新拉清單刷新表格
      getRestaurants()
    } catch (error) {
      console.error(error)
      createSnackbar({
        text: error?.response?.data?.message || '操作失敗，請稍後再試',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  })

</script>

<!-- <route lang="yaml">（頁面中繼資料） -->
<!-- <route lang="yaml"> => SFC route block（通常配合 unplugin-vue-router 或類似插件） -->
<route lang="yaml">
  # meta => 定義路由中繼資料
  meta:
    # layout: 'admin' => 使用名為 admin 的佈局
    layout: 'admin'

    # title: '餐廳管理' => 頁面標題
    title: '餐廳管理'

    # login: 'login-only' => 需要登入（專案自訂規則）
    login: 'login-only'

    # admin: true => 需要管理者權限（專案自訂規則）
    admin: true
</route>
