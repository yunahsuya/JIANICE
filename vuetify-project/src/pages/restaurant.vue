<template>
  <v-container>
    <v-row>
      <v-col cols="12">

        <!-- 側邊欄 -->
        <v-navigation-drawer
          class="bg-deep-purple pl-4"
          permanent
          theme="dark"
          width="250"
        >
          <v-list color="transparent">
            <v-list-item prepend-icon="mdi-home-heart" title="餐廳分類" />

            <v-divider />

            <v-list-item prepend-icon="mdi-rice" title="台式" />
            <v-list-item prepend-icon="mdi-pizza" title="義式" />
            <v-list-item prepend-icon="mdi-food-drumstick-outline" title="美式" />
            <v-list-item prepend-icon="mdi-noodles" title="日式" />
            <v-list-item prepend-icon="mdi-gavel" title="韓式" />
            <v-list-item prepend-icon="mdi-food" title="速食" />
            <v-list-item prepend-icon="mdi-access-point-minus" title="蔬食" />
            <v-list-item prepend-icon="mdi-cupcake" title="甜點" />

            <v-list-item prepend-icon="mdi-beer" title="飲料" />

          </v-list>

          <template #append>
            <div class="pa-2">
              <v-btn block>
                Logout
              </v-btn>
            </div>
          </template>
        </v-navigation-drawer>

        <!-- 選項 -->
        <v-chip-group>
          <v-chip
            filter
            text="全部"
            :value="''"
          />

          <v-chip
            filter
            text="飯"
            :value="''"
          />

          <v-chip
            filter
            text="麵"
            :value="''"
          />

          <v-chip
            filter
            text="麵"
            :value="''"
          />
        </v-chip-group>
      </v-col>

      <!-- 餐廳卡片 -->
      <v-col
        v-for="restaurant in currentPageRestaurants"
        :key="restaurant._id"
        cols="12"
        lg="4"
        md="6"
      >
        <RestaurantCard v-bind="restaurant" />
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useSnackbar } from 'vuetify-use-dialog'
  import RestaurantCard from '@/components/RestaurantCard.vue'
  import restaurantService from '@/services/restaurant'

  const createSnackbar = useSnackbar()

  const restaurants = ref([])

  const filteredRestaurants = computed(() => {
    return restaurants.value.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(search.value.toLowerCase())
      const matchesCategory = selectedCategory.value ? restaurant.category === selectedCategory.value : true
      return matchesSearch && matchesCategory
    })
  })

  const ITEMS_PER_PAGE = 10
  const page = ref(1)
  const totalPages = computed(() => {
    return Math.ceil(filteredRestaurants.value.length / ITEMS_PER_PAGE)
  })

  const currentPageRestaurants = computed(() => {
    return filteredRestaurants.value.slice((page.value - 1))
  })

  const search = ref('')

  const selectedCategory = ref('')
  const categoryOptions = ['電子產品', '服裝', '家居用品', '書籍', '玩具', '食品', '其他', '麵', '飯', '夜市']

  const getRestaurants = async () => {
    try {
      const { data } = await restaurantService.get()
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
</script>

<route lang="yaml">
  meta:
    title: '餐廳'
    login: ''
    admin: false

</route>
