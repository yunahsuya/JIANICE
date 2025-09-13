<template>
  <div>

    <!-- 團隊故事 Section -->
    <section id="story" class="bg-white">
      <v-container class="py-16">
        <div class="text-center mb-12">
          <h2 class="text-h3 text-md-h2 font-weight-bold text-grey-darken-3 mb-4">
            JIANICE 的故事
          </h2>
          <v-divider class="mx-auto mb-4 border-opacity-100" color="orange-darken-2" thickness="6" width="100" />
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
                於是，我們決定創建 JiaNice，一個整合餐廳推薦、營養管理、健康資訊和回憶保存的綜合平台，讓每一次用餐都成為值得期待的美好體驗。
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
          <h2 class="text-h3 text-md-h2 font-weight-bold text-grey-darken-3 mb-4">
            技術特色
          </h2>
          <v-divider class="mx-auto mb-4 border-opacity-100" color="orange-darken-2" thickness="6" width="100" />

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
                <v-icon class="mb-4" color="orange-darken-2" :icon="tech.icon" size="48" />
                <v-card-title class="text-h6 font-weight-bold text-grey-darken-3 text-center">
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
          <h2 class="text-h3 text-md-h2 font-weight-bold text-grey-darken-3 mb-4">
            發展歷程
          </h2>
          <v-divider class="mx-auto mb-4 border-opacity-100" color="orange-darken-2" thickness="6" width="100" />

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

     <!-- 回報訊息 Section -->
     <section class="bg-grey-lighten-5">
      <v-container class="py-16">
        <div class="text-center mb-12">
          <h2 class="text-h3 text-md-h2 font-weight-bold text-grey-darken-3 mb-4">
            回報訊息
          </h2>
          <v-divider class="mx-auto mb-4 border-opacity-100" color="orange-darken-2" thickness="6" width="100" />
          <p class="text-body-1 text-grey-darken-1">
            如果您在使用過程中遇到任何問題，或有任何建議，歡迎透過以下表單與我們聯繫
          </p>
        </div>

        <v-row class="justify-center">
          <v-col cols="12" md="8" lg="6">
             <v-card class="pa-8" elevation="4" rounded="xl">
               <v-form ref="reportFormRef" v-model="formValid" @submit.prevent="submitReport">
                 <v-row>
                   <v-col cols="12" md="6">
                     <v-text-field
                       v-model="reportFormData.name"
                       label="姓名 *"
                       :rules="nameRules"
                       variant="outlined"
                       required
                     />
                   </v-col>
                   <v-col cols="12" md="6">
                     <v-text-field
                       v-model="reportFormData.email"
                       label="電子信箱 *"
                       :rules="emailRules"
                       variant="outlined"
                       type="email"
                       required
                     />
                   </v-col>
                 </v-row>

                 <v-select
                   v-model="reportFormData.category"
                   :items="reportCategories"
                   label="回報類別 *"
                   :rules="categoryRules"
                   variant="outlined"
                   required
                 />

                 <v-text-field
                   v-model="reportFormData.subject"
                   label="主旨 *"
                   :rules="subjectRules"
                   variant="outlined"
                   required
                 />

                 <v-textarea
                   v-model="reportFormData.message"
                   label="詳細描述 *"
                   :rules="messageRules"
                   variant="outlined"
                   rows="6"
                   required
                 />

                 <div class="text-center mt-6">
                   <v-btn
                     type="submit"
                     color="orange-darken-2"
                     size="large"
                     :disabled="!formValid"
                     :loading="isSubmitting"
                     class="px-8"
                   >
                     送出回報
                   </v-btn>
                 </div>
               </v-form>
             </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 聯絡資訊 Section -->
    <section class="bg-white">
      <v-container class="py-16">
        <div class="text-center mb-12">
          <h2 class="text-h3 text-md-h2 font-weight-bold text-grey-darken-3 mb-4">
            聯絡我們
          </h2>
          <v-divider class="mx-auto mb-4 border-opacity-100" color="orange-darken-2" thickness="6" width="100" />

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
                      <v-icon class="mr-3" color="orange-darken-2">mdi-email</v-icon>
                      <span class="text-body-1">yunahsuya@gmail.com</span>
                    </div>

                    <!-- 電話 -->
                    <div class="d-flex align-center mb-3">
                      <v-icon class="mr-3" color="orange-darken-2">mdi-phone</v-icon>
                      <span class="text-body-1">0905-336-968</span>
                    </div>

                    <!-- 網站連結 -->
                    <div class="d-flex align-center mb-3">
                      <v-icon class="mr-3" color="orange-darken-2">mdi-github</v-icon>
                      <a class="text-body-1" href="https://github.com/yunahsuya">https://github.com/yunahsuya</a>
                    </div>

                  </div>
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
                    :icon="social.icon"
                    size="large"
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
      description: '開始職訓局課程、HTML、CSS 基礎、JavaScript 初步',
      color: 'orange-darken-2',
    },
    {
      date: '2025年4月',
      title: 'MVP 開發',
      description: '完成核心功能開發，包括餐廳推薦和營養管理系統。',
      color: 'green',
    },
    {
      date: '2025年5月',
      title: '證照考試',
      description: '邀請首批用戶進行測試，收集回饋並優化使用者體驗。',
      color: 'blue',
    },
    {
      date: '2025年6月',
      title: '正式上線',
      description: 'JiaNice 正式對外開放，開始為更多用戶提供服務。',
      color: 'purple',
    },
    {
      date: '2025年7月',
      title: '結訓 (報告)',
      description: 'JiaNice 正式對外開放，開始為更多用戶提供服務。',
      color: 'purple',
    },
    {
      date: '2025年8月',
      title: '專題製作',
      description: 'JiaNice 正式對外開放，開始為更多用戶提供服務。',
      color: 'purple',
    },
    {
      date: '2025年9月',
      title: '結訓 (報告)',
      description: 'JiaNice 正式對外開放，開始為更多用戶提供服務。',
      color: 'purple',
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
    { name: 'facebook', icon: 'mdi-facebook' },
    { name: 'instagram', icon: 'mdi-instagram' },
    { name: 'twitter', icon: 'mdi-twitter' },
    { name: 'youtube', icon: 'mdi-youtube' },
  ])

  // 回報表單相關
  const reportFormData = ref({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  })

  const formValid = ref(false)
  const isSubmitting = ref(false)
  const reportFormRef = ref(null)

  const reportCategories = ref([
    { title: '技術問題', value: 'technical' },
    { title: '功能建議', value: 'feature' },
    { title: '內容錯誤', value: 'content' },
    { title: '帳戶問題', value: 'account' },
    { title: '其他', value: 'other' }
  ])

  // 表單驗證規則
  const nameRules = [
    v => !!v || '姓名為必填項目',
    v => (v && v.length >= 2) || '姓名至少需要2個字符'
  ]

  const emailRules = [
    v => !!v || '電子信箱為必填項目',
    v => /.+@.+\..+/.test(v) || '請輸入有效的電子信箱格式'
  ]

  const categoryRules = [
    v => !!v || '請選擇回報類別'
  ]

  const subjectRules = [
    v => !!v || '主旨為必填項目',
    v => (v && v.length >= 5) || '主旨至少需要5個字符'
  ]

  const messageRules = [
    v => !!v || '詳細描述為必填項目',
    v => (v && v.length >= 10) || '詳細描述至少需要10個字符'
  ]

  // 提交回報表單
  const submitReport = async () => {
    if (!formValid.value) return

    isSubmitting.value = true

    try {
      // 這裡可以添加實際的API調用來發送回報訊息
      console.log('回報表單數據:', reportFormData.value)

      // 模擬API調用延遲
      await new Promise(resolve => setTimeout(resolve, 2000))

      // 顯示成功訊息
      alert('感謝您的回報！我們會盡快處理您的訊息。')

      // 重置表單
      reportFormData.value = {
        name: '',
        email: '',
        category: '',
        subject: '',
        message: ''
      }
      reportFormRef.value?.reset()

    } catch (error) {
      console.error('提交回報失敗:', error)
      alert('提交失敗，請稍後再試。')
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
    title: '關於我們'
    admin: false
</route>
