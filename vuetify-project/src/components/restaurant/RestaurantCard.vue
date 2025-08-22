<template>
  <v-card class="restaurant-card" elevation="4" rounded="lg">
    <!-- 餐廳圖片 -->
    <div class="card-image-container">
      <v-img
        :src="defaultImage"
        height="200"
        cover
        class="card-image"
      />
      <div class="card-overlay">
        <v-btn
          icon="mdi-heart"
          variant="text"
          color="white"
          size="small"
          class="favorite-btn"
          @click="addToFavorites"
        />
      </div>
    </div>

    <!-- 餐廳資訊 -->
    <v-card-text class="card-content">
      <h3 class="restaurant-name">{{ name }}</h3>

      <div class="info-item">
        <v-icon icon="mdi-map-marker" size="small" color="primary" />
        <span class="info-text">{{ address }}</span>
      </div>

      <div v-if="phone" class="info-item">
        <v-icon icon="mdi-phone" size="small" color="primary" />
        <span class="info-text">{{ phone }}</span>
      </div>

      <div v-if="mobile" class="info-item">
        <v-icon icon="mdi-cellphone" size="small" color="primary" />
        <span class="info-text">{{ mobile }}</span>
      </div>

      <div class="info-item">
        <v-icon icon="mdi-city" size="small" color="primary" />
        <span class="info-text">{{ city }}</span>
      </div>
    </v-card-text>

    <!-- 操作按鈕 -->
    <v-card-actions class="card-actions">
      <v-btn
        color="primary"
        variant="elevated"
        rounded="lg"
        @click="showDetails = true"
        class="action-btn"
      >
        <v-icon icon="mdi-eye" class="mr-2" />
        查看詳情
      </v-btn>

      <v-btn
        color="secondary"
        variant="outlined"
        rounded="lg"
        @click="addToFavorites"
        class="action-btn"
      >
        <v-icon icon="mdi-heart" class="mr-2" />
        收藏
      </v-btn>
    </v-card-actions>

    <!-- 詳情對話框 -->
    <v-dialog v-model="showDetails" max-width="600" persistent>
      <v-card class="detail-dialog">
        <v-card-title class="dialog-title">
          <v-icon icon="mdi-food" class="mr-3" color="primary" />
          {{ name }}
        </v-card-title>

        <v-card-text class="dialog-content">
          <div class="detail-item">
            <v-icon icon="mdi-map-marker" color="primary" />
            <div class="detail-text">
              <strong>地址：</strong>{{ address }}
            </div>
          </div>

          <div v-if="phone" class="detail-item">
            <v-icon icon="mdi-phone" color="primary" />
            <div class="detail-text">
              <strong>電話：</strong>{{ phone }}
            </div>
          </div>

          <div v-if="mobile" class="detail-item">
            <v-icon icon="mdi-cellphone" color="primary" />
            <div class="detail-text">
              <strong>手機：</strong>{{ mobile }}
            </div>
          </div>

          <div class="detail-item">
            <v-icon icon="mdi-city" color="primary" />
            <div class="detail-text">
              <strong>縣市：</strong>{{ city }}
            </div>
          </div>

          <div v-if="latitude && longitude" class="detail-item">
            <v-icon icon="mdi-crosshairs-gps" color="primary" />
            <div class="detail-text">
              <strong>座標：</strong>{{ latitude }}, {{ longitude }}
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="dialog-actions">
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
</script>

<style scoped>
.restaurant-card {
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.restaurant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.card-image-container {
  position: relative;
}

.card-image {
  border-radius: 8px 8px 0 0;
}

.card-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
}

.favorite-btn {
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(4px);
}

.card-content {
  padding: 20px;
}

.restaurant-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  line-height: 1.3;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 8px;
}

.info-text {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  flex: 1;
}

.card-actions {
  padding: 16px 20px 20px;
  gap: 12px;
}

.action-btn {
  flex: 1;
  font-weight: 500;
}

.detail-dialog {
  border-radius: 16px;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  padding: 24px 24px 0;
}

.dialog-content {
  padding: 20px 24px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 12px;
}

.detail-text {
  flex: 1;
  color: #555;
  line-height: 1.5;
}

.dialog-actions {
  padding: 16px 24px 24px;
  justify-content: center;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .restaurant-name {
    font-size: 1.1rem;
  }

  .info-text {
    font-size: 0.85rem;
  }

  .card-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
