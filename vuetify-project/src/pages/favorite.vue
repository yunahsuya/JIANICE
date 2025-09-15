<template>
  <div>
    <!-- 頂部橫幅 -->
    <div class="text-center pa-12">
      <div>
        <h1 class="text-h2 font-weight-bold mb-4 text-shadow mt-2">我的收藏</h1>
        <p class="text-h5 mb-10 opacity-90">管理您喜愛的餐廳</p>
      </div>
    </div>

    <v-container class="rounded-t-xl mt-n5 pa-10" style="min-height: calc(100vh - 300px);">
      <!-- 載入狀態 -->
      <div v-if="loading" class="text-center pa-15">
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        />
        <p class="mt-4 text-body-1 text-grey">
          正在載入收藏清單...
        </p>
      </div>

      <!-- 收藏清單 -->
      <div v-else>
        <!-- 統計資訊 -->
        <div class="mb-8">
          <v-row>
            <v-col cols="12" md="6">
              <v-card class="pa-4" color="primary" variant="tonal">
                <div class="d-flex align-center">
                  <v-icon class="mr-3" icon="mdi-heart" size="32" />
                  <div>
                    <h3 class="text-h6 font-weight-bold">收藏總數</h3>
                    <p class="text-h5 font-weight-bold">{{ favoriteRestaurants.length }}</p>
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="pa-4" color="success" variant="tonal">
                <div class="d-flex align-center ">
                  <v-icon class="mr-3" icon="mdi-calendar" size="32" />
                  <div>
                    <h3 class="text-h6 font-weight-bold">最近收藏</h3>
                    <p class="text-h6">{{ getLatestFavoriteDate() }}</p>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- 操作按鈕 -->
        <div class="mb-6  d-flex justify-space-between align-center">
          <h2 class="text-h5 font-weight-semibold">
            收藏餐廳
            <span class="text-body-1 text-grey font-weight-regular">({{ favoriteRestaurants.length }} 間)</span>
          </h2>

          <div class="d-flex ga-2">
            <v-btn
              color="primary"
              variant="outlined"
              @click="refreshFavorites"
              :loading="loading"
            >
              <v-icon class="mr-2" icon="mdi-refresh" />
              重新整理
            </v-btn>

            <v-btn
              v-if="favoriteRestaurants.length > 0"
              color="error"
              variant="outlined"
              @click="showClearDialog = true"
            >
              <v-icon class="mr-2" icon="mdi-delete" />
              清空收藏
            </v-btn>
          </div>
        </div>

        <!-- 餐廳網格 -->
        <div v-if="favoriteRestaurants.length > 0">
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

          <!-- 分頁 -->
          <div v-if="totalPages > 1" class="d-flex justify-center mt-10">
            <v-pagination
              v-model="page"
              :length="totalPages"
              rounded="circle"
              :total-visible="7"
              show-first-last-page
            />
          </div>
        </div>

        <!-- 無收藏提示 -->
        <v-alert
          v-else
          class="mt-10 text-center"
          type="info"
          variant="tonal"
        >
          <template #prepend>
            <v-icon icon="mdi-heart-outline" />
          </template>
          <div class="text-h6 mb-4">還沒有收藏任何餐廳</div>
          <p class="text-body-1 mb-4">
            去探索美食天地，收藏您喜愛的餐廳吧！
          </p>
          <v-btn
            color="primary"
            variant="elevated"
            @click="goToRestaurants"
          >
            <v-icon class="mr-2" icon="mdi-food" />
            探索餐廳
          </v-btn>
        </v-alert>
      </div>
    </v-container>

    <!-- 清空收藏確認對話框 -->
    <v-dialog v-model="showClearDialog" max-width="400" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="text-h6 font-weight-semibold text-error pa-6 pb-0">
          <v-icon class="mr-3" icon="mdi-alert" />
          確認清空收藏
        </v-card-title>

        <v-card-text class="pa-6">
          <p class="text-body-1">
            您確定要清空所有收藏的餐廳嗎？此操作無法復原。
          </p>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0 justify-end">
          <v-btn
            color="grey"
            variant="text"
            @click="showClearDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="clearAllFavorites"
          >
            確認清空
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import RestaurantCard from '@/components/restaurant/RestaurantCard.vue'
  import localFavoriteService from '../stores/localFavorite'

  const router = useRouter()
  const createSnackbar = useSnackbar()

  const favoriteRestaurants = ref([])
  const loading = ref(false)
  const page = ref(1)
  const showClearDialog = ref(false)

  // 分頁設定
  const ITEMS_PER_PAGE = 12
  const totalPages = computed(() => {
    return Math.ceil(favoriteRestaurants.value.length / ITEMS_PER_PAGE)
  })

  const currentPageRestaurants = computed(() => {
    const start = (page.value - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return favoriteRestaurants.value.slice(start, end)
  })

  // 載入收藏清單
  const loadFavorites = () => {
    loading.value = true
    try {
      favoriteRestaurants.value = localFavoriteService.getFavorites()
    } catch (error) {
      console.error('載入收藏清單失敗:', error)
      createSnackbar({
        text: '載入收藏清單失敗',
        snackbarProps: {
          color: 'error',
        },
      })
    } finally {
      loading.value = false
    }
  }

  // 重新整理收藏清單
  const refreshFavorites = () => {
    loadFavorites()
    createSnackbar({
      text: '收藏清單已重新整理',
      snackbarProps: {
        color: 'success',
      },
    })
  }

  // 清空所有收藏
  const clearAllFavorites = () => {
    try {
      const result = localFavoriteService.clearFavorites()
      if (result.success) {
        favoriteRestaurants.value = []
        showClearDialog.value = false
        createSnackbar({
          text: result.message,
          snackbarProps: {
            color: 'success',
          },
        })
      } else {
        createSnackbar({
          text: result.message,
          snackbarProps: {
            color: 'error',
          },
        })
      }
    } catch (error) {
      console.error('清空收藏失敗:', error)
      createSnackbar({
        text: '清空收藏失敗',
        snackbarProps: {
          color: 'error',
        },
      })
    }
  }

  // 前往餐廳頁面
  const goToRestaurants = () => {
    router.push('/restaurant')
  }

  // 取得最近收藏日期
  const getLatestFavoriteDate = () => {
    if (favoriteRestaurants.value.length === 0) {
      return '無'
    }

    const latest = favoriteRestaurants.value.reduce((latest, restaurant) => {
      const currentDate = new Date(restaurant.addedAt)
      const latestDate = new Date(latest.addedAt)
      return currentDate > latestDate ? restaurant : latest
    })

    return new Date(latest.addedAt).toLocaleDateString('zh-TW')
  }

  // 組件掛載時載入收藏清單
  onMounted(() => {
    loadFavorites()
  })
</script>

<route lang="yaml">
  meta:
    title: '我的收藏'
    login: ''
    admin: false
</route>
