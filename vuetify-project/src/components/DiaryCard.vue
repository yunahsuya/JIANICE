<template>
  <v-card
    class="diary-card"
    elevation="2"
    @click="$emit('click')"
  >
    <!-- 圖片區域 -->
    <div class="image-container">
      <v-img
        class="diary-image"
        cover
        height="200"
        :src="mainImage"
      >
        <!-- 日期標籤 -->
        <div v-if="diary.date" class="date-chip">
          <!-- color="rgba(0,0,0,0.1)" -->
          <v-chip
            class="text-white"
            color="blue"
            size="small"
            variant="elevated"
          >
            {{ formatDate(diary.date) }}
          </v-chip>
        </div>

        <!-- 分類標籤 -->
        <div class="category-chip">
          <v-chip
            class="text-white"
            :color="getCategoryColor(diary.category)"
            size="small"
            variant="elevated"
          >
            {{ diary.category }}
          </v-chip>
        </div>

      </v-img>
    </div>

    <!-- 內容區域 -->
    <v-card-text class="pa-4">
      <!-- 描述文字 - 修改：使用 white-space: pre-line 來保留換行 -->
      <p class="description-text">
        {{ truncatedDescription }}
      </p>

      <!-- 圖片數量指示器 -->
      <div v-if="diary.image && diary.image.length > 1" class="image-count">
        <v-icon color="grey" size="16">mdi-image-multiple</v-icon>
        <span class="text-caption text-grey ml-1">{{ diary.image.length }} 張圖片</span>
      </div>
    </v-card-text>

    <!-- 底部區域 -->
    <v-card-actions class="pa-4 pt-0">
      <v-spacer />
      <v-btn
        color="success"
        size="small"
        variant="flat"
        @click.stop="$emit('click')"
      >
        查看詳情
        <v-icon end size="16">mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
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

  // 計算屬性：截斷的描述文字 - 修改：保留換行符號
  const truncatedDescription = computed(() => {
    const desc = props.diary.description || ''
    if (desc.length > 100) {
      // 找到第100個字元前的最後一個換行符號
      const truncated = desc.slice(0, 100)
      const lastNewline = truncated.lastIndexOf('\n')
      if (lastNewline > 80) { // 如果換行符號在80字元之後，使用換行符號位置
        return desc.slice(0, Math.max(0, lastNewline)) + '...'
      } else {
        return truncated + '...'
      }
    }
    return desc
  })

  // 取得分類顏色
  const getCategoryColor = category => {
    const colors = {
      快樂: 'orange',
      難過: 'blue',
      生氣: 'red',
      平靜: 'grey',
    }
    return colors[category] || 'primary'
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
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.diary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.image-container {
  position: relative;
}

.diary-image {
  transition: transform 0.3s ease;
}

.diary-card:hover .diary-image {
  transform: scale(1.05);
}

.category-chip {
  position: absolute;
  top: 12px;
  left: 12px;
}

.date-chip {
  position: absolute;
  top: 12px;
  right: 12px;
}

.description-text {
  line-height: 1.6;
  color: rgba(0,0,0,0.87);
  margin-bottom: 8px;
  min-height: 48px;
  /* 新增：保留換行符號 */
  white-space: pre-line;
  /* 新增：長單字自動換行 */
  word-wrap: break-word; }
</style>
