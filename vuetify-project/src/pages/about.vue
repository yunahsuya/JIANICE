<template>
  <div>
    <!-- 團隊故事 Section -->
    <section id="story" class="bg-white">
      <v-container class="py-16">
        <div class="text-center mb-12">
          <h2
            class="text-h3 text-md-h2 font-weight-bold text-grey-darken-3 mb-4"
          >
            JIANICE 的故事
          </h2>
          <v-divider
            class="mx-auto mb-4 border-opacity-100"
            color="orange-darken-2"
            thickness="6"
            width="100"
          />
        </div>

        <v-row class="align-center">
          <v-col cols="12" md="6">
            <div class="pr-md-8">
              <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">
                創辦理念
              </h3>
              <p class="text-body-1 text-grey-darken-1 mb-6 line-height-1-7">
                在現代快節奏的生活中，我們發現許多人面臨著相同的困擾：不知道要吃什麼、擔心營養不均衡、以及想要記錄美好用餐時光卻找不到合適的方式。
              </p>
              <p class="text-body-1 text-grey-darken-1 mb-6 line-height-1-7">
                於是，我們決定創建
                JiaNice，一個整合餐廳推薦、營養管理、健康資訊和回憶保存的綜合平台，讓每一次用餐都成為值得期待的美好體驗。
              </p>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="overflow-hidden" elevation="8" rounded="xl">
              <v-img
                class="transition-swing"
                cover
                height="300"
                src="../assets/pexels-viktoria-slowikowska-5677720.jpg"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 技術特色 Section -->
    <section class="bg-grey-lighten-5">
      <v-container class="py-16">
        <div class="text-center mb-12">
          <h2
            class="text-h3 text-md-h2 font-weight-bold text-grey-darken-3 mb-4"
          >
            技術特色
          </h2>
          <v-divider
            class="mx-auto mb-4 border-opacity-100"
            color="orange-darken-2"
            thickness="6"
            width="100"
          />
        </div>

        <v-row class="justify-center">
          <v-col
            v-for="(tech, index) in techFeatures"
            :key="index"
            cols="12"
            lg="4"
            md="6"
          >
            <v-card
              class="h-100 transition-swing"
              :class="{ 'elevation-12': tech.hover }"
              elevation="4"
              rounded="xl"
              @mouseenter="tech.hover = true"
              @mouseleave="tech.hover = false"
            >
              <div class="text-center pa-6">
                <v-icon
                  class="mb-4"
                  color="orange-darken-2"
                  :icon="tech.icon"
                  size="48"
                />
                <v-card-title
                  class="text-h6 font-weight-bold text-grey-darken-3 text-center"
                >
                  {{ tech.title }}
                </v-card-title>
              </div>
              <v-card-text class="pt-0 px-6 pb-6">
                <p class="text-body-2 text-grey-darken-1 text-center">
                  {{ tech.description }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 發展歷程 Section -->
    <section class="bg-white">
      <v-container class="py-16">
        <div class="text-center mb-12">
          <h2
            class="text-h3 text-md-h2 font-weight-bold text-grey-darken-3 mb-4"
          >
            發展歷程
          </h2>
          <v-divider
            class="mx-auto mb-4 border-opacity-100"
            color="orange-darken-2"
            thickness="6"
            width="100"
          />
        </div>

        <v-timeline align="start" side="end">
          <v-timeline-item
            v-for="(milestone, index) in milestones"
            :key="index"
            :dot-color="milestone.color"
            size="large"
          >
            <template #opposite>
              <div class="text-h6 font-weight-bold text-grey-darken-3">
                {{ milestone.date }}
              </div>
            </template>
            <v-card class="elevation-4" rounded="xl">
              <v-card-title class="text-h6 font-weight-bold text-grey-darken-3">
                {{ milestone.title }}
              </v-card-title>
              <v-card-text class="text-body-2 text-grey-darken-1">
                {{ milestone.description }}
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-container>
    </section>

    <!-- 用戶見證 Section -->
    <!-- <section class="bg-grey-lighten-5">
      <v-container class="py-16">
        <div class="text-center mb-12">
          <h2 class="text-h3 text-md-h2 font-weight-bold text-grey-darken-3 mb-4">
            用戶見證
          </h2>
          <v-divider class="mx-auto mb-4 border-opacity-100" color="orange-darken-2" thickness="6" width="100" />

        </div>

        <v-row class="justify-center">
          <v-col
            v-for="(testimonial, index) in testimonials"
            :key="index"
            cols="12"
            lg="4"
            md="6"
          >
            <v-card class="h-100" elevation="4" rounded="xl">
              <v-card-text class="pa-6">
                <div class="d-flex align-center mb-4">
                  <v-avatar class="mr-4" size="60">
                    <v-img :src="testimonial.avatar" />
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold text-grey-darken-3">
                      {{ testimonial.name }}
                    </div>
                    <div class="text-body-2 text-grey-darken-1">
                      {{ testimonial.title }}
                    </div>
                  </div>
                </div>
                <p class="text-body-1 text-grey-darken-1 line-height-1-7">
                  "{{ testimonial.quote }}"
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section> -->

    <!-- 聯絡資訊 Section -->
    <section class="bg-white">
      <v-container class="py-16">
        <div class="text-center mb-12">
          <h2
            class="text-h3 text-md-h2 font-weight-bold text-grey-darken-3 mb-4"
          >
            聯絡我們
          </h2>
          <v-divider
            class="mx-auto mb-4 border-opacity-100"
            color="orange-darken-2"
            thickness="6"
            width="100"
          />
        </div>

        <v-row class="justify-center">
          <v-col cols="12" md="8">
            <v-card class="pa-8" elevation="4" rounded="xl">
              <v-row>
                <v-col cols="12" md="6">
                  <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">
                    聯絡方式
                  </h3>
                  <div class="mb-4">
                    <!-- 信箱 -->
                    <div class="d-flex align-center mb-3">
                      <v-icon
                        class="mr-3"
                        color="orange-darken-2"
                      >mdi-email</v-icon>
                      <span class="text-body-1">yunahsuya@gmail.com</span>
                    </div>

                    <!-- 電話 -->
                    <div class="d-flex align-center mb-3">
                      <v-icon
                        class="mr-3"
                        color="orange-darken-2"
                      >mdi-phone</v-icon>
                      <span class="text-body-1">0905-336-968</span>
                    </div>

                    <!-- 網站連結 -->
                    <div class="d-flex align-center mb-3">
                      <v-icon
                        class="mr-3"
                        color="orange-darken-2"
                      >mdi-github</v-icon>
                      <a
                        class="text-body-1"
                        href="https://github.com/yunahsuya"
                      >https://github.com/yunahsuya</a>
                    </div>
                  </div>
                </v-col>

                <!-- 新增：回報問題表單 -->
                <v-col cols="12" md="6">
                  <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">
                    回報問題
                  </h3>

                  <v-form
                    ref="reportFormRef"
                    v-model="formValid"
                    @submit.prevent="submitReport"
                  >
                    <v-text-field
                      v-model="reportFormData.name"
                      class="mb-3"
                      label="姓名"
                      prepend-inner-icon="mdi-account"
                      :rules="nameRules"
                      variant="outlined"
                    />

                    <v-text-field
                      v-model="reportFormData.email"
                      class="mb-3"
                      label="電子信箱"
                      prepend-inner-icon="mdi-email"
                      :rules="emailRules"
                      variant="outlined"
                    />

                    <v-select
                      v-model="reportFormData.category"
                      class="mb-3"
                      :items="reportCategories"
                      label="回報類別"
                      prepend-inner-icon="mdi-tag"
                      :rules="categoryRules"
                      variant="outlined"
                    />

                    <v-text-field
                      v-model="reportFormData.subject"
                      class="mb-3"
                      label="主旨"
                      prepend-inner-icon="mdi-format-title"
                      :rules="subjectRules"
                      variant="outlined"
                    />

                    <v-textarea
                      v-model="reportFormData.message"
                      class="mb-4"
                      label="詳細描述"
                      prepend-inner-icon="mdi-message-text"
                      rows="4"
                      :rules="messageRules"
                      variant="outlined"
                    />
                    <v-btn
                      block
                      color="orange-darken-2"
                      :disabled="!formValid"
                      :loading="isSubmitting"
                      size="large"
                      type="submit"
                    >
                      <v-icon left>mdi-send</v-icon>
                      提交回報
                    </v-btn>
                  </v-form>
                </v-col>
              </v-row>

              <v-divider class="my-6" />

              <div class="text-center">
                <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">
                  關注我們
                </h3>
                <div class="d-flex justify-center">
                  <v-btn
                    v-for="social in socialLinks"
                    :key="social.name"
                    class="mx-2"
                    color="orange-darken-2"
                    :href="social.url"
                    :icon="social.icon"
                    size="large"
                    target="_blank"
                    variant="text"
                  />
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Footer -->
    <v-footer class="bg-grey-darken-4 text-white">
      <v-container class="py-8">
        <v-row class="justify-center">
          <v-col class="text-center" cols="12" md="8">
            <p class="text-body-1 mb-4 opacity-80">
              JiaNice 致力於為您提供最佳的飲食體驗，讓健康與美味並存
            </p>
            <p class="text-caption opacity-60">
              © {{ new Date().getFullYear() }} JiaNice. 版權所有
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import reportService from '@/services/report'
  const techFeatures = ref([
    {
      icon: 'mdi-shield-check',
      title: '資料安全',
      description: '採用最新的加密技術，確保您的個人資料和用餐記錄安全無虞。',
      hover: false,
    },
    {
      icon: 'mdi-api',
      title: 'API 整合',
      description: '與健康署等官方機構合作，提供最準確的健康資訊和營養數據。',
      hover: false,
    },
    {
      icon: 'mdi-cellphone-cog',
      title: '響應式設計',
      description: '支援各種裝置，無論是手機、平板還是電腦，都能提供最佳體驗。',
      hover: false,
    },
  ])

  const milestones = ref([
    {
      date: '2025年3月',
      title: '職訓局上課',
      description: '開始職訓局課程，熟悉 HTML、CSS、JavaScript 基礎語法與程式邏輯。',
      color: 'orange-darken-2',
    },
    {
      date: '2025年4月',
      title: '切版練習與互動效果',
      description: '練習前端版面切版與動畫效果，同時練習計時器、倒數、事件處理等功能。',
      color: 'green',
    },
    {
      date: '2025年5月',
      title: '證照考試',
      description: '學習響應式設計、Bootstrap，開始使用 Vue，練習建立 LINE 機器人及 Vue List，並完成丙級考題練習。',
      color: 'blue',
    },
    {
      date: '2025年6月',
      title: '進階框架與動畫',
      description: '加強 Vue 技能，使用 Vuetify、Sass，並練習動畫庫 GSAP。',
      color: 'purple',
    },
    {
      date: '2025年7月',
      title: '專案整合實作',
      description: '整合 Vue 與動畫效果，完成專案實作，進行專題製作，將技術整合到完整作品中。',
      color: 'yellow-darken-3',
    },
    {
      date: '2025年8月',
      title: '專題製作',
      description: 'JiaNice 專題進行中，持續開發功能與完善專案，累積實務經驗。',
      color: 'cyan-darken-1',
    },
    {
      date: '2025年9月',
      title: '結訓 (報告)',
      description: '完成 JiaNice 專題與結訓報告，正式結束職訓局課程。',
      color: 'grey',
    },
  ])

  // const testimonials = ref([
  //   {
  //     name: '林小明',
  //     title: '上班族',
  //     avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
  //     quote: 'JiaNice 解決了我每天最大的困擾 - 不知道要吃什麼。現在我的飲食更均衡，也更有趣了！',
  //   },
  //   {
  //     name: '王美玲',
  //     title: '營養師',
  //     avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
  //     quote: '作為營養師，我很推薦 JiaNice。它讓健康飲食變得簡單易懂，用戶更容易堅持。',
  //   },
  //   {
  //     name: '張志偉',
  //     title: '美食部落客',
  //     avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
  //     quote: '不只是找餐廳，還能記錄美好回憶。JiaNice 讓每一次用餐都成為值得珍藏的故事。',
  //   },
  // ])

  const socialLinks = ref([
    {
      name: '文章分享',
      icon: 'mdi-newspaper-variant-outline',
      url: 'https://vocus.cc/salon/6647b6a6fd89780001f99044',
    },
    {
      name: '104 人才社群',
      icon: 'mdi-numeric-1-circle',
      url: 'https://profile.104.com.tw/profile/3bca6284-3679-4ace-9c60-576bbc4fd9d2/about?isView',
    },
    {
      name: 'Yuna\'s Portfolio',
      icon: 'mdi-information-slab-circle-outline',
      url: 'https://yunahsuya.github.io/Portfolio/',
    },
    {
      name: 'GitHub',
      icon: 'mdi-github',
      url: 'https://github.com/yunahsuya',
    },
  ])

  // 回報表單相關
  const reportFormData = ref({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
  })

  const formValid = ref(false)
  const isSubmitting = ref(false)
  const reportFormRef = ref(null)

  const reportCategories = ref([
    { title: '技術問題', value: 'technical' },
    { title: '功能建議', value: 'feature' },
    { title: '內容錯誤', value: 'content' },
    { title: '帳戶問題', value: 'account' },
    { title: '其他', value: 'other' },
  ])

  // 表單驗證規則
  const nameRules = [
    v => !!v || '姓名為必填項目',
    v => (v && v.length >= 2) || '姓名至少需要2個字符',
  ]

  const emailRules = [
    v => !!v || '電子信箱為必填項目',
    v => /.+@.+\..+/.test(v) || '請輸入有效的電子信箱格式',
  ]

  const categoryRules = [v => !!v || '請選擇回報類別']

  const subjectRules = [
    v => !!v || '主旨為必填項目',
    v => (v && v.length >= 5) || '主旨至少需要5個字符',
  ]

  const messageRules = [
    v => !!v || '詳細描述為必填項目',
    v => (v && v.length >= 10) || '詳細描述至少需要10個字符',
  ]

  // 提交回報表單
  const submitReport = async () => {
    if (!formValid.value) return

    isSubmitting.value = true

    try {
      // 調用 Gmail API
      const result = await reportService.submit(reportFormData.value)

      // // 這裡可以添加實際的API調用來發送回報訊息
      // console.log('回報表單數據:', reportFormData.value)

      // // 模擬API調用延遲
      // await new Promise(resolve => setTimeout(resolve, 2000))

      // 顯示成功訊息
      alert('感謝您的回報！我們會盡快處理您的訊息。')

      // 重置表單
      reportFormData.value = {
        name: '',
        email: '',
        category: '',
        subject: '',
        message: '',
      }
      reportFormRef.value?.reset()
    } catch (error) {
      console.error('提交回報失敗:', error)
      alert('提交失敗，請稍後再試。')

      // 顯示錯誤訊息
      const errorMessage
        = error.response?.data?.message || '提交失敗，請稍後再試。'
      alert(errorMessage)
    } finally {
      isSubmitting.value = false
    }
  }

  const scrollToStory = () => {
    const el = document.querySelector('#story')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
</script>

<route lang="yaml">
meta:
  title: "關於我們"
  admin: false
</route>
