<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          class="mb-4"
          color="primary"
          variant="outlined"
          @click="router.back()"
        >
          <v-icon start>mdi-arrow-left</v-icon>
          返回
        </v-btn>
      </v-col>

      <v-col cols="12">
        <h1 class="text-center">{{ newsdata.title }}</h1>
      </v-col>

      <v-divider class="mb-4" />

      <v-col cols="12">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <v-chip
                class="mr-4"
                color="primary"
                variant="outlined"
              >
                {{ newsdata.category }}
              </v-chip>
              <v-chip
                color="secondary"
                variant="outlined"
              >
                {{ formatDate(newsdata.date) }}
              </v-chip>
            </div>

            <div class="text-body-1" style="white-space: pre-wrap; line-height: 1.8;">
              {{ newsdata.content }}
            </div>

            <v-divider class="my-4" />

            <div class="d-flex justify-space-between align-center">
              <v-btn
                color="success"
                :href="newsdata.url"
                rel="noopener noreferrer"
                target="_blank"
                variant="tonal"
              >
                <v-icon start>mdi-open-in-new</v-icon>
                查看原文連結
              </v-btn>

              <v-btn
                color="primary"
                variant="outlined"
                @click="shareNews"
              >
                <v-icon start>mdi-share</v-icon>
                分享
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import newsdataService from '@/services/newsdata'

  const createSnackbar = useSnackbar()
  const router = useRouter()
  const route = useRoute()

  const newsdata = ref({
    title: '',
    content: '',
    url: '',
    date: '',
    category: '',
  })

  const getNewsdata = async () => {
    try {
      const { data } = await newsdataService.getId(route.params.id)
      newsdata.value.title = data.newsdata.title
      newsdata.value.content = data.newsdata.content
      newsdata.value.url = data.newsdata.url
      newsdata.value.date = data.newsdata.date
      newsdata.value.category = data.newsdata.category

      document.title = `${data.newsdata.title} | 健康新聞`
    } catch (error) {
      console.error('Error fetching newsdata:', error)
      createSnackbar({
        text: '無法載入新聞資料',
        snackbarProps: {
          color: 'red',
        },
      })
      router.push('/')
    }
  }
  getNewsdata()

  const formatDate = dateString => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const shareNews = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: newsdata.value.title,
          text: newsdata.value.content.slice(0, 100) + '...',
          url: window.location.href,
        })
      } else {
        // 如果不支援原生分享，複製連結到剪貼簿
        await navigator.clipboard.writeText(window.location.href)
        createSnackbar({
          text: '連結已複製到剪貼簿',
          snackbarProps: {
            color: 'green',
          },
        })
      }
    } catch (error) {
      console.error('分享失敗:', error)
      createSnackbar({
        text: '分享失敗',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  }
</script>

<route lang="yaml">
  meta:
    # 標題
    title: '健康新聞詳情'
    # 有沒有登入都能看
    login: ''
    # 不是管理員也能看
    admin: false
</route>
