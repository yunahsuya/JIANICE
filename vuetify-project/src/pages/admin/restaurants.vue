<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">餐廳管理</h1>
      </v-col>

      <v-divider />

      <v-col cols="12">
        <v-data-table :filter-keys="filterKeys" :headers="headers" :items="restaurants" :search="search">

          <!-- toolbar -->
          <!-- 新增餐廳 (btn) -->
          <template #top>
            <v-toolbar>
              <div class="px-4">
                <v-btn variant="outlined" @click="openDialog(null)">新增餐廳</v-btn>

              </div>

              <v-spacer />

              <!-- 搜尋餐廳 (text-field) -->
              <!--
                clearable => 清除
                density="compact" => 高度 (小一點，剛好符合)
                flat => 陰影
                hide-details => 不要浮上去 (太貼邊緣)
                width="400" => 設置搜尋框，寬度
                variant="solo" => 設置搜尋框，樣式
              -->
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

          <!-- 圖片 -->
          <template #[`item.image`]="{ value }">
            <v-img :src="value" width="75" />
          </template>

          <!-- 上架 -->
          <template #[`item.sell`]="{ value }">
            <v-icon v-if="value" icon="mdi-check" />
          </template>

          <template #[`item.action`]="{ item }">
            <v-btn icon="mdi-pencil" variant="text" @click="openDialog(item)" />

          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="dialog.open" persistent width="600">
    <v-form :disabled="isSubmitting" @submit.prevent="submit">
      <v-card>
        <v-card-title>{{ dialog.id.length > 0 ? '編輯餐廳': "新增餐廳" }}</v-card-title>

        <v-card-text>

          <!-- 名稱 -->
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
          <v-text-field
            v-model.number="price.value.value"
            :error-messages="price.errorMessage.value"
            label="價格"
          />

          <!-- 分類 -->
          <v-select
            v-model="category.value.value"
            :error-messages="category.errorMessage.value"
            :items="categoryOptions"
            label="分類"
          />

          <!-- 營養提醒 -->
          <v-text-field
            v-model="nutritionInfo.value.value"
            :error-messages="category.errorMessage.value"
            label="營養提醒"
          />

          <!-- 描述 -->
          <v-textarea
            v-model="description.value.value"
            :error-messages="description.errorMessage.value"
            label="描述"
          />

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
          <v-switch
            v-model="sell.value.value"
            color="success"
            :error-messages="sell.errorMessage.value"
            hide-details
            label="上架"
          />
        </v-card-text>

        <v-card-actions>
          <v-btn color="red" :disabled="isSubmitting" variant="tonal" @click="closeDialog">取消</v-btn>
          <v-btn color="green" :loading="isSubmitting" type="submit" variant="tonal">
            {{ dialog.id.length > 0 ? '編輯' : '新增' }}
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
  import restaurantService from '../../services/restaurant'

  const createSnackbar = useSnackbar()

  const restaurants = ref([])

  // 搜尋
  const search = ref('')

  // ************************
  // *       表格顯示        *
  // ************************

  const headers = [
    // { title: 'ID', key: '_id' },
    { title: '名稱', key: 'name' },
    { title: '圖片', key: 'image', sortable: false },
    { title: '地址', key: 'address' },
    { title: '電話', key: 'phone' },
    { title: '分類', key: 'category' },
    { title: '價格', key: 'price' },
    { title: '描述', key: 'description' },
    { title: '上架', key: 'sell' },
    { title: '營養提醒', key: 'nutritionInfo' },
    { title: '縣市', key: 'city' },
    { title: '建立日期', key: 'createdAt', value: item => new Date(item.createdAt).toLocaleString() },
    { title: '更新日期', key: 'updatedAt', value: item => new Date(item.updatedAt).toLocaleString() },

    { title: '操作', key: 'action', sortable: false },
  ]

  const filterKeys = ['_id', 'name', 'address', 'phone', 'category', 'price', 'description', 'nutritionInfo', 'createdAt', 'updatedAt']

  const getRestaurants = async () => {
    try {
      const { data } = await restaurantService.getAll()
      restaurants.value = data.restaurants
    } catch (error) {
      console.error('Error fetching restaurants:', error)

      createSnackbar({
        text: '無法載入餐廳資料',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  }
  getRestaurants()

  // ************************
  // *         表單          *
  // ************************
  const fileAgent = useTemplateRef('fileAgent')
  const dialog = ref({
    open: false,
    id: '',
  })

  const openDialog = item => {
    if (item) {
      dialog.value.id = item._id
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

  const closeDialog = () => {
    dialog.value.open = false
    dialog.value.id = ''
    resetForm()
    fileAgent.value.deleteFileRecord()
  }

  const categoryOptions = ['台式', '義式', '美式', '日式', '韓式', '蔬食', '早餐', '飲料', '麵', '飯', '義大利麵', '漢堡', '拉麵', '壽司']

  const { handleSubmit, resetForm, isSubmitting } = useForm({
    validationSchema: yup.object({
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

  const name = useField('name')
  const address = useField('address')
  const phone = useField('phone')
  const price = useField('price')
  const category = useField('category')
  const description = useField('description')
  const sell = useField('sell')
  const nutritionInfo = useField('nutritionInfo')
  const city = useField('city')
  const fileRecords = ref([])
  const rawFileRecords = ref([])

  const submit = handleSubmit(async values => {
    if (fileRecords.value[0]?.error) {
      createSnackbar({
        text: '請選擇有效的檔案',
        snackbarProps: {
          color: 'red',
        },
      })
      return
    }

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
      const fd = new FormData()
      fd.append('name', values.name)
      fd.append('address', values.address)
      fd.append('phone', values.phone)
      fd.append('price', values.price)
      fd.append('category', values.category)
      fd.append('description', values.description)
      fd.append('sell', values.sell)
      fd.append('nutritionInfo', values.nutritionInfo)
      fd.append('city', values.city)

      if (fileRecords.value.length > 0) {
        fd.append('image', fileRecords.value[0].file)
      }

      await (dialog.value.id.length === 0 ? restaurantService.create(fd) : restaurantService.update(dialog.value.id, fd))

      createSnackbar({
        text: '操作成功！',
        snackbarProps: {
          color: 'green',
        },
      })
      closeDialog()
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

<route lang="yaml">
  meta:
    layout: 'admin'

    title: '餐廳管理'

    login: 'login-only'

    admin: true
</route>
