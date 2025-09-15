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
      <!-- 地區分類標籤 -->
      <div ref="citySection" class="mb-8 sticky-top">
        <h2 class="font-weight-semibold mb-4">選擇地區</h2>
        <div class="d-flex flex-wrap gap-3">
          <v-chip
            v-for="city in cityCategories"
            :key="city.value"
            class="font-weight-medium transition-all hover-lift mt-2 mr-3"
            :color="selectedCity === city.value ? 'primary' : 'default'"
            :loading="loading && selectedCity === city.value"
            size="large"
            :variant="selectedCity === city.value ? 'elevated' : 'outlined'"
            @click="selectCity(city.value)"
          >
            <v-icon class="mr-2" :icon="city.icon" />
            {{ city.label }}
          </v-chip>
        </div>
      </div>

      <!-- 食物類型分類標籤 -->
      <div ref="foodSection" class="mb-8 sticky-top" style="top: 200px;">
        <h2 class="font-weight-semibold mb-4">選擇食物類型</h2>
        <div class="d-flex flex-wrap gap-3">
          <v-chip
            v-for="food in foodCategories"
            :key="food.value"
            class="font-weight-medium transition-all hover-lift mt-2 mr-3"
            :color="selectedFoodType === food.value ? 'secondary' : 'default'"
            :loading="loading && selectedFoodType === food.value"
            size="large"
            :variant="selectedFoodType === food.value ? 'elevated' : 'outlined'"
            @click="selectFoodType(food.value)"
          >
            <v-icon class="mr-2" :icon="food.icon" />
            {{ food.label }}
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
            {{ getLoadingMessage() }}
          </p>
        </div>

        <!-- 餐廳網格 -->
        <div v-else>
          <div class="mb-6">
            <h1 class="font-weight-semibold">
              {{ getPageTitle() }}
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
            {{ getNoDataMessage() }}
          </v-alert>
        </div>

        <!-- 分頁 -->
        <div v-if="totalPages > 1 && !loading" class="d-flex justify-center mt-10">
          <v-pagination
            v-model="page"
            :length="totalPages"
            rounded="circle"
            :total-visible="7"
            show-first-last-page
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
  const selectedFoodType = ref('')
  const page = ref(1)
  const restaurantSection = ref(null)
  const citySection = ref(null)
  const foodSection = ref(null)

  // 地區分類資料
  const cityCategories = [
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

  // 食物類型分類資料
  const foodCategories = [
    { label: '全部類型', value: '', icon: 'mdi-food-fork-drink' },
    { label: '壽司', value: '壽司', icon: 'mdi-sushi' },
    { label: '麵', value: '麵', icon: 'mdi-noodles' },
    { label: '飯', value: '飯', icon: 'mdi-rice' },
    { label: '小吃', value: '小吃', icon: 'mdi-food-turkey' },
    { label: '義大利麵', value: '義大利麵', icon: 'mdi-pasta' },
    { label: '披薩', value: '披薩', icon: 'mdi-pizza' },
    { label: '漢堡', value: '漢堡', icon: 'mdi-hamburger' },
    { label: '拉麵', value: '拉麵', icon: 'mdi-bowl-mix' },
    { label: '烤肉', value: '烤肉', icon: 'mdi-fire' },
    { label: '飲料', value: '飲料', icon: 'mdi-cup' },
    { label: '台式', value: '台式', icon: 'mdi-food' },
    { label: '義式', value: '義式', icon: 'mdi-pasta' },
    { label: '美式', value: '美式', icon: 'mdi-hamburger' },
    { label: '日式', value: '日式', icon: 'mdi-sushi' },
    { label: '韓式', value: '韓式', icon: 'mdi-food-drumstick' },
    { label: '蔬食', value: '蔬食', icon: 'mdi-leaf' },
    { label: '早餐', value: '早餐', icon: 'mdi-coffee' },
  ]

   // 智能分類函數（與後端保持一致）
   const getCategoryFromName = (restaurantName) => {
    const name = restaurantName.toLowerCase()

    // 壽司相關
    if (name.includes('壽司') || name.includes('sushi') || name.includes('藏壽司') || name.includes('爭鮮')) {
      return '壽司'
    }

    // 拉麵相關（擴展關鍵字）
    if (name.includes('拉麵') || name.includes('ramen') || name.includes('一蘭') ||
        name.includes('一風堂') || name.includes('花月嵐') || name.includes('豚將') ||
        name.includes('鬼匠') || name.includes('旬味') || name.includes('豚十三') ||
        name.includes('奧特') || name.includes('京阪豚骨') || name.includes('一家拉麵') ||
        name.includes('玖貳玖牛羊肉拉麵')) {
      return '拉麵'
    }

    // 義大利麵相關
    if (name.includes('義大利麵') || name.includes('pasta') || name.includes('義式') || name.includes('義大利')) {
      return '義大利麵'
    }

    // 披薩相關
    if (name.includes('披薩') || name.includes('pizza') || name.includes('必勝客') || name.includes('達美樂')) {
      return '披薩'
    }

    // 漢堡相關
    if (name.includes('漢堡') || name.includes('burger') || name.includes('麥當勞') || name.includes('肯德基') || name.includes('摩斯')) {
      return '漢堡'
    }

    // 麵相關
    if (name.includes('麵') && !name.includes('拉麵') && !name.includes('義大利麵')) {
      return '麵'
    }

    // 飯相關
    if (name.includes('飯') || name.includes('便當') || name.includes('丼飯')) {
      return '飯'
    }

    // 飲料相關
    if (name.includes('飲料') || name.includes('茶') || name.includes('咖啡') || name.includes('手搖') || name.includes('星巴克') || name.includes('85度c') || name.includes('豆花')) {
      return '飲料'
    }

    // 烤肉相關
    if (name.includes('烤肉') || name.includes('燒肉') || name.includes('燒烤') || name.includes('bbq') || name.includes('石鍋')) {
      return '烤肉'
    }

    // 小吃相關
    if (name.includes('小吃') || name.includes('小吃') || name.includes('攤販')) {
      return '小吃'
    }

    // 早餐相關
    if (name.includes('早餐') || name.includes('早午餐') || name.includes('brunch')) {
      return '早餐'
    }

    // 蔬食相關
    if (name.includes('蔬食') || name.includes('素食') || name.includes('vegan') || name.includes('vegetarian')) {
      return '蔬食'
    }

    // 日式相關
    if (name.includes('日式') || name.includes('和食') || name.includes('居酒屋') || name.includes('日料')) {
      return '日式'
    }

    // 韓式相關
    if (name.includes('韓式') || name.includes('韓料') || name.includes('韓國') || name.includes('韓式料理')) {
      return '韓式'
    }

    // 美式相關
    if (name.includes('美式') || name.includes('american') || name.includes('牛排')) {
      return '美式'
    }

    // 台式相關（預設）
    return '台式'
  }

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

    // 食物類型過濾（使用智能分類）
    if (selectedFoodType.value) {
      filtered = filtered.filter(restaurant => {
        const restaurantName = restaurant.name || restaurant.名稱 || ''
        const inferredCategory = getCategoryFromName(restaurantName)
        return inferredCategory === selectedFoodType.value
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

  // 滾動函數
  const scrollToSection = (section) => {
    nextTick(() => {
      if (section.value) {
        section.value.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    })
  }

  // 地區選擇
  const selectCity = async city => {
    if (selectedCity.value === city) return

    selectedCity.value = city
    page.value = 1

    // 滾動到地區分類區域
    scrollToSection(citySection)

    // 如果已經有資料，直接使用過濾功能
    if (restaurants.value.length > 0) {
      return
    }

    // 只有在沒有資料時才載入
    try {
      await (city === '' ? getRestaurants() : getRestaurantsByCity(city))
    } catch (error) {
      console.error('Error selecting city:', error)
    }
  }

   // 食物類型選擇
   const selectFoodType = async foodType => {
    if (selectedFoodType.value === foodType) return

    selectedFoodType.value = foodType
    page.value = 1

    // 滾動到食物類型分類區域
    scrollToSection(foodSection)

    // 如果已經有資料，直接使用過濾功能
    if (restaurants.value.length > 0) {
      return
    }

    // 只有在沒有資料時才載入
    try {
      if (foodType === '') {
        await getRestaurants()
      } else if (selectedCity.value) {
        await getRestaurantsByCityAndCategory(selectedCity.value, foodType)
      } else {
        await getRestaurantsByCategory(foodType)
      }
    } catch (error) {
      console.error('Error selecting food type:', error)
    }
  }

  // 載入餐廳資料
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

  // 根據城市載入餐廳
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

  // 根據食物類型載入餐廳
  const getRestaurantsByCategory = async category => {
    loading.value = true
    try {
      const { data } = await restaurantService.getByCategory(category)
      restaurants.value = data.restaurants || data || []

      if (!Array.isArray(restaurants.value)) {
        restaurants.value = []
      }
    } catch (error) {
      console.error('Error fetching restaurants by category:', error)
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

  // 根據城市和食物類型載入餐廳
  const getRestaurantsByCityAndCategory = async (city, category) => {
    loading.value = true
    try {
      const { data } = await restaurantService.getByCityAndCategory(city, category)
      restaurants.value = data.restaurants || data || []

      if (!Array.isArray(restaurants.value)) {
        restaurants.value = []
      }
    } catch (error) {
      console.error('Error fetching restaurants by city and category:', error)
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

  // 取得載入訊息
  const getLoadingMessage = () => {
    if (selectedCity.value && selectedFoodType.value) {
      return `正在載入${selectedCity.value}的${selectedFoodType.value}餐廳資料...`
    } else if (selectedCity.value) {
      return `正在載入${selectedCity.value}餐廳資料...`
    } else if (selectedFoodType.value) {
      return `正在載入${selectedFoodType.value}餐廳資料...`
    } else {
      return '正在載入餐廳資料...'
    }
  }

  // 取得頁面標題
  const getPageTitle = () => {
    if (selectedCity.value && selectedFoodType.value) {
      return `${selectedCity.value}的${selectedFoodType.value}餐廳`
    } else if (selectedCity.value) {
      return `${selectedCity.value}餐廳`
    } else if (selectedFoodType.value) {
      return `${selectedFoodType.value}餐廳`
    } else {
      return '全部餐廳'
    }
  }

  // 取得無資料訊息
  const getNoDataMessage = () => {
    if (selectedCity.value && selectedFoodType.value) {
      return `目前沒有${selectedCity.value}的${selectedFoodType.value}餐廳資料`
    } else if (selectedCity.value) {
      return `目前沒有${selectedCity.value}的餐廳資料`
    } else if (selectedFoodType.value) {
      return `目前沒有${selectedFoodType.value}餐廳資料`
    } else {
      return '目前沒有餐廳資料'
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
