<template>
  <div>
    <!-- 頂部橫幅 -->
    <div class="text-center pa-12">
      <div>
        <h1 class="text-h2 font-weight-bold mb-4 text-shadow mt-2">探索美食天地</h1>
        <p class="text-h5 mb-10 opacity-90">發現您附近最棒的餐廳</p>

        <!-- 搜尋欄 -->
        <div class="mx-auto" style="max-width: 500px;">
          <v-text-field
            v-model="search"
            class="rounded-lg"
            hide-details
            placeholder="搜尋餐廳名稱..."
            prepend-inner-icon="mdi-magnify"
            rounded="lg"
            variant="outlined"
          />
        </div>
      </div>
    </div>

    <v-container class="rounded-t-xl mt-n5 pa-10" style="min-height: calc(100vh - 300px);">
      <!-- 分類標籤 - 固定在頂部 -->
      <div ref="categorySection" class="mb-10 sticky-top">
        <h1 class="font-weight-semibold mb-2">選擇地區</h1>
        <div class="d-flex flex-wrap gap-3">
          <v-chip
            v-for="category in categories"
            :key="category.value"
            class="font-weight-medium transition-all hover-lift mt-2 mr-3"
            :color="selectedCity === category.value ? 'primary' : 'default'"
            :loading="loading && selectedCity === category.value"
            size="large"
            :variant="selectedCity === category.value ? 'elevated' : 'outlined'"
            @click="selectCategory(category.value)"
          >
            <v-icon class="mr-2" :icon="category.icon" />
            {{ category.label }}
          </v-chip>
        </div>
      </div>

      <!-- 餐廳列表區域 -->
      <div ref="restaurantSection" class="mb-10">
        <!-- 載入狀態 -->
        <div v-if="loading" class="text-center pa-15">
          <v-progress-circular
            color="primary"
            indeterminate
            size="64"
          />
          <p class="mt-4 text-body-1 text-grey">
            {{ selectedCity ? `正在載入${selectedCity}餐廳資料...` : '正在載入餐廳資料...' }}
          </p>
        </div>

        <!-- 餐廳網格 -->
        <div v-else>
          <div class="mb-6">
            <h1 class="font-weight-semibold">
              {{ selectedCity ? `${selectedCity}餐廳` : '全部餐廳' }}
              <span class="text-body-1 text-grey font-weight-regular">({{ filteredRestaurants.length }} 間)</span>
            </h1>
          </div>

          <v-row>
            <v-col
              v-for="restaurant in currentPageRestaurants"
              :key="restaurant.restid"
              cols="12"
              lg="4"
              sm="6"
              xl="3"
            >
              <RestaurantCard v-bind="restaurant" />
            </v-col>
          </v-row>

          <!-- 無資料提示 -->
          <v-alert
            v-if="currentPageRestaurants.length === 0"
            class="mt-10 text-center"
            type="info"
            variant="tonal"
          >
            <template #prepend>
              <v-icon icon="mdi-food-fork-drink" />
            </template>
            {{ selectedCity ? `目前沒有${selectedCity}的餐廳資料` : '目前沒有餐廳資料' }}
          </v-alert>
        </div>

        <!-- 分頁 -->
        <div v-if="totalPages > 1 && !loading" class="d-flex justify-center mt-10">
          <v-pagination
            v-model="page"
            :length="totalPages"
            rounded="circle"
            :total-visible="7"
          />
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup>
  import { computed, nextTick, ref, watch } from 'vue'
  import { useSnackbar } from 'vuetify-use-dialog'
  import RestaurantCard from '@/components/restaurant/RestaurantCard.vue'
  import restaurantService from '@/services/restaurant'

  const createSnackbar = useSnackbar()

  const restaurants = ref([])
  const loading = ref(false)
  const search = ref('')
  const selectedCity = ref('')
  const page = ref(1)
  const restaurantSection = ref(null)
  const categorySection = ref(null)

  // 分類資料
  const categories = [
    { label: '全部餐廳', value: '', icon: 'mdi-food' },
    { label: '台北市', value: '臺北市', icon: 'mdi-city' },
    { label: '新北市', value: '新北市', icon: 'mdi-city' },
    { label: '桃園市', value: '桃園市', icon: 'mdi-city' },
    { label: '台中市', value: '臺中市', icon: 'mdi-city' },
    { label: '台南市', value: '臺南市', icon: 'mdi-city' },
    { label: '高雄市', value: '高雄市', icon: 'mdi-city' },
    { label: '基隆市', value: '基隆市', icon: 'mdi-city' },
    { label: '金門縣', value: '金門縣', icon: 'mdi-city' },
    { label: '宜蘭縣', value: '宜蘭縣', icon: 'mdi-city' },
    { label: '新竹縣', value: '新竹縣', icon: 'mdi-city' },
    { label: '新竹市', value: '新竹市', icon: 'mdi-city' },
    { label: '苗栗縣', value: '苗栗縣', icon: 'mdi-city' },
    { label: '彰化縣', value: '彰化縣', icon: 'mdi-city' },
    { label: '南投縣', value: '南投縣', icon: 'mdi-city' },
    { label: '雲林縣', value: '雲林縣', icon: 'mdi-city' },
    { label: '嘉義縣', value: '嘉義縣', icon: 'mdi-city' },
    { label: '嘉義市', value: '嘉義市', icon: 'mdi-city' },
    { label: '屏東縣', value: '屏東縣', icon: 'mdi-city' },
    { label: '花蓮縣', value: '花蓮縣', icon: 'mdi-city' },
    { label: '台東縣', value: '台東縣', icon: 'mdi-city' },
    { label: '澎湖縣', value: '澎湖縣', icon: 'mdi-city' },
    { label: '連江縣', value: '連江縣', icon: 'mdi-city' },
  ]

  // 過濾邏輯
  const filteredRestaurants = computed(() => {
    let filtered = restaurants.value

    // 城市過濾
    if (selectedCity.value) {
      filtered = filtered.filter(restaurant => {
        const restaurantCity = restaurant.city || restaurant.縣市 || ''
        return restaurantCity.includes(selectedCity.value)
          || selectedCity.value.includes(restaurantCity)
      })
    }

    // 搜尋過濾
    if (search.value) {
      filtered = filtered.filter(restaurant => {
        const restaurantName = restaurant.name || restaurant.名稱 || ''
        return restaurantName.toLowerCase().includes(search.value.toLowerCase())
      })
    }

    return filtered
  })

  const ITEMS_PER_PAGE = 12
  const totalPages = computed(() => {
    return Math.ceil(filteredRestaurants.value.length / ITEMS_PER_PAGE)
  })

  const currentPageRestaurants = computed(() => {
    const start = (page.value - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredRestaurants.value.slice(start, end)
  })

  // 改進的滾動函數 - 滾動到分類區域而不是餐廳列表
  const scrollToCategorySection = () => {
    nextTick(() => {
      if (categorySection.value) {
        categorySection.value.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    })
  }

  // 分類選擇
  const selectCategory = async city => {
    if (selectedCity.value === city) return

    selectedCity.value = city
    page.value = 1

    // 滾動到分類區域，確保分類選項可見
    scrollToCategorySection()

    // 如果已經有資料，直接使用過濾功能，不需要重新載入
    if (restaurants.value.length > 0) {
      return
    }

    // 只有在沒有資料時才載入
    try {
      await (city === '' ? getRestaurants() : getRestaurantsByCity(city))
    } catch (error) {
      console.error('Error selecting category:', error)
    }
  }



  const getRestaurants = async () => {
    loading.value = true
    try {
      const { data } = await restaurantService.get()
      restaurants.value = data.restaurants || data || []

      if (!Array.isArray(restaurants.value)) {
        restaurants.value = []
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error)
      restaurants.value = []
      createSnackbar({
        text: '無法載入餐廳資料',
        snackbarProps: {
          color: 'red',
        },
      })
    } finally {
      loading.value = false
    }
  }

  const getRestaurantsByCity = async city => {
    loading.value = true
    try {
      const { data } = await restaurantService.getByCity(city)
      restaurants.value = data.restaurants || data || []

      if (!Array.isArray(restaurants.value)) {
        restaurants.value = []
      }
    } catch (error) {
      console.error('Error fetching restaurants by city:', error)
      restaurants.value = []
      const errorMessage = error.response?.data?.message || '無法載入餐廳資料'
      createSnackbar({
        text: errorMessage,
        snackbarProps: {
          color: 'red',
        },
      })
    } finally {
      loading.value = false
    }
  }

  // 監聽搜尋變化
  watch(search, () => {
    page.value = 1
  })

  // 初始載入
  getRestaurants()
</script>

<route lang="yaml">
  meta:
    title: '餐廳'
    login: ''
    admin: false
</route>
