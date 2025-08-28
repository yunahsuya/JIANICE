<template>
  <v-card
    class="diary-card"
    elevation="0"
    rounded="xl"
    @click="$emit('click')"
  >
    <!-- 圖片區域 -->
    <div class="image-container">
      <v-img
        :aspect-ratio="16/9"
        class="diary-image"
        cover
        height="240"
        :src="mainImage"
      >
        <!-- 漸層遮罩 -->
        <div class="image-overlay">
          <!-- 分類標籤 -->
          <div class="category-badge">

            <v-chip
              class="text-white font-weight-medium"
              :color="getCategoryColor(diary.category)"
              rounded="pill"
              size="small"
              variant="flat"
            >
              <v-icon class="" size="25" >
                {{ getCategoryIcon(diary.category) }}
              </v-icon>
              <!-- {{ diary.category }} -->
            </v-chip>
          </div>

          <!-- 日期標籤 -->
          <div class="date-badge">
            <div class="date-content">
              <div class="date-month">{{ formatMonth(diary.date) }}</div>
              <div class="date-day">{{ formatDay(diary.date) }}</div>
            </div>
          </div>
        </div>
      </v-img>
    </div>

    <!-- 內容區域 -->
    <v-card-text class="pa-6">
      <!-- 標題 -->
      <h3 class="text-h6 font-weight-bold mb-3 text-primary-darken-1">
        {{ displayTitle }}
      </h3>

      <!-- 描述文字 -->
      <p class="description-text text-body-2 text-medium-emphasis">
        {{ truncatedDescription }}
      </p>

      <!-- 底部資訊 -->
      <div class="card-footer mt-8">
        <!-- 圖片數量指示器 -->
        <div v-if="diary.image && diary.image.length > 0" class="image-count">
          <v-icon color="grey-lighten-1" size="18">
            {{ diary.image.length > 1 ? 'mdi-image-multiple' : 'mdi-image' }}
          </v-icon>
          <span class="text-caption text-grey-lighten-1 ml-1">
            {{ diary.image.length }} 張照片
          </span>
        </div>

        <!-- 查看按鈕 -->
        <v-btn
          class="view-btn"
          color="primary"
          rounded="pill"
          variant="tonal"
          @click.stop="$emit('click')"
        >
          查看詳情
          <v-icon class="ml-1" end size="16">mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { computed } from 'vue'

  // Props
  const props = defineProps({
    diary: {
      type: Object,
      required: true,
    },
  })

  // Emits
  defineEmits(['click'])

  // 計算屬性：主要圖片
  const mainImage = computed(() => {
    return props.diary.image && props.diary.image.length > 0
      ? props.diary.image[0]
      : '/placeholder-image.jpg'
  })

  // 計算屬性：截斷的描述文字
  const truncatedDescription = computed(() => {
    const desc = props.diary.description || ''
    if (desc.length > 120) {
      const truncated = desc.slice(0, 120)
      const lastNewline = truncated.lastIndexOf('\n')
      return lastNewline > 100 ? desc.slice(0, Math.max(0, lastNewline)) + '...' : truncated + '...'
    }
    return desc
  })

  // 計算屬性：處理標題顯示
  const displayTitle = computed(() => {
    if (!props.diary.title) return '無標題'
    if (typeof props.diary.title === 'object') {
      return JSON.stringify(props.diary.title)
    }
    return props.diary.title
  })

  // 取得分類顏色
  const getCategoryColor = category => {
    const colors = {
      快樂: 'orange',
      難過: 'blue',
      生氣: 'red',
      平靜: 'green',
    }
    return colors[category] || 'primary'
  }

  // 取得分類圖示
  const getCategoryIcon = category => {
    const icons = {
      快樂: 'mdi-emoticon-happy',
      難過: 'mdi-emoticon-sad',
      生氣: 'mdi-emoticon-angry',
      平靜: 'mdi-emoticon-neutral',
    }
    return icons[category] || 'mdi-heart'
  }

  // 格式化日期 - 日
  const formatDay = dateString => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.getDate()
  }

  // 格式化日期 - 月
  const formatMonth = dateString => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      month: 'short',
    })
  }

  // 格式化日期
  const formatDate = dateString => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric',
    })
  }
</script>

<style scoped>
.diary-card {
  height: 500px; /* 固定高度 */
  display: flex;
  flex-direction: column;
}

.v-card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.description-text {
  flex: 1;
  min-height: 48px;
  max-height: 120px; /* 限制最大高度 */
}

.diary-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12) !important;
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.image-container {
  position: relative;
  overflow: hidden;
}

.diary-image {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.diary-card:hover .diary-image {
  transform: scale(1.08);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
}

/* .category-badge {
  position: absolute;
  top: 16px;
  left: 16px;
} */

.date-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 8px 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.date-content {
  text-align: center;
  line-height: 1;
}

.date-day {
  font-size: 18px;
  font-weight: 700;
  color: var(--v-theme-primary);
}

.date-month {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 2px;
}

.description-text {
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 8px;
  min-height: 48px;
  white-space: pre-line;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.image-count {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
}

.view-btn {
  transition: all 0.3s ease;
  font-weight: 500;
}

.view-btn:hover {
  transform: translateX(4px);
}

/* 響應式設計 */
@media (max-width: 600px) {
  .diary-card {
    margin-bottom: 16px;
  }

  .image-overlay {
    padding: 12px;
  }

  .date-badge {
    top: 12px;
    right: 12px;
    padding: 6px 10px;
  }

  .date-day {
    font-size: 16px;
  }

  .date-month {
    font-size: 11px;
  }
}
</style>
