<template>
  <v-card
    elevation="4"
    rounded="lg"
    @click="handleCardClick"
    class="h-100 transition-all duration-300 hover-lift cursor-pointer"
  >
    <!-- 餐廳圖片 -->
    <div class="position-relative">
      <v-img
        :src="defaultImage"
        height="200"
        cover
        class="rounded-t-lg"
      />
      <div style="position: absolute; top: 8px; right: 8px; z-index: 10;">
        <v-btn
          icon="mdi-heart"
          variant="text"
          color="white"
          size="small"
          style="background: rgba(0,0,0,0.3); backdrop-filter: blur(4px);"
          @click.stop="addToFavorites"
        />
      </div>
    </div>

    <!-- 餐廳資訊 -->
    <v-card-text class="pa-5">
      <h3 class="text-h6 font-weight-semibold text-grey-darken-1 mb-4">{{ name }}</h3>

      <div class="d-flex align-start mb-3">
        <v-icon icon="mdi-map-marker" size="small" color="primary" class="mr-2" />
        <span class="text-body-2 text-grey-darken-2">{{ address }}</span>
      </div>

      <div v-if="phone" class="d-flex align-start mb-3">
        <v-icon icon="mdi-phone" size="small" color="primary" class="mr-2 " />
        <span class="text-body-2 text-grey-darken-2">{{ phone }}</span>
      </div>

      <div v-if="mobile" class="d-flex align-start mb-3">
        <v-icon icon="mdi-cellphone" size="small" color="primary" class="mr-2" />
        <span class="text-body-2 text-grey-darken-2">{{ mobile }}</span>
      </div>

      <div class="d-flex align-start mb-3">
        <v-icon icon="mdi-city" size="small" color="primary" class="mr-2" />
        <span class="text-body-2 text-grey-darken-2">{{ city }}</span>
      </div>
    </v-card-text>

    <!-- 操作按鈕 -->
    <v-card-actions class="pa-4 pt-0">
      <v-btn
        color="primary"
        variant="elevated"
        rounded="lg"
        @click.stop="showDetails = true"
        class="font-weight-medium"
        style="min-width: 160px;"
      >
        <v-icon icon="mdi-eye" class="mr-2" />
        查看詳情
      </v-btn>

      <v-btn
        color="secondary"
        variant="outlined"
        rounded="lg"
        @click.stop="addToFavorites"
        class="font-weight-medium"
        style="min-width: 160px;"
      >
        <v-icon icon="mdi-heart" class="mr-2" />
        收藏
      </v-btn>
    </v-card-actions>

    <!-- 詳情對話框 -->
    <v-dialog v-model="showDetails" max-width="600" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="text-h5 font-weight-semibold text-grey-darken-1 pa-6 pb-0">
          <v-icon icon="mdi-food" class="mr-3" color="primary" />
          {{ name }}
        </v-card-title>

        <v-card-text class="pa-6">
          <div class="d-flex align-start mb-5">
            <v-icon icon="mdi-map-marker" color="primary" class="mr-3 mt-1" />
            <div class="text-body-1 text-grey-darken-2">
              <strong>地址：</strong>{{ address }}
            </div>
          </div>

          <div v-if="phone" class="d-flex align-start mb-5">
            <v-icon icon="mdi-phone" color="primary" class="mr-3 mt-1" />
            <div class="text-body-1 text-grey-darken-2">
              <strong>電話：</strong>{{ phone }}
            </div>
          </div>

          <div v-if="mobile" class="d-flex align-start mb-5">
            <v-icon icon="mdi-cellphone" color="primary" class="mr-3 mt-1" />
            <div class="text-body-1 text-grey-darken-2">
              <strong>手機：</strong>{{ mobile }}
            </div>
          </div>

          <div class="d-flex align-start mb-5">
            <v-icon icon="mdi-city" color="primary" class="mr-3 mt-1" />
            <div class="text-body-1 text-grey-darken-2">
              <strong>縣市：</strong>{{ city }}
            </div>
          </div>

          <div v-if="latitude && longitude" class="d-flex align-start mb-5">
            <v-icon icon="mdi-crosshairs-gps" color="primary" class="mr-3 mt-1" />
            <div class="text-body-1 text-grey-darken-2">
              <strong>座標：</strong>{{ latitude }}, {{ longitude }}
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0 justify-center">
          <v-btn
            color="primary"
            variant="elevated"
            rounded="lg"
            @click="showDetails = false"
          >
            關閉
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  restid: String,
  name: String,
  address: String,
  phone: String,
  mobile: String,
  latitude: String,
  longitude: String,
  city: String
})

const showDetails = ref(false)
const defaultImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop'

const addToFavorites = () => {
  console.log('加入收藏:', props.name)
}

// 處理卡片點擊事件
const handleCardClick = () => {
  showDetails.value = true
}
</script>
