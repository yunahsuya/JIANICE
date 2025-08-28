<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6">
          <v-card-title class="text-h4 mb-4 text-center">
            <v-icon size="large" class="mr-2">mdi-account-circle</v-icon>
            個人基本資訊
          </v-card-title>

          <v-form @submit.prevent="saveUserInfo" ref="form">
            <v-row>
              <!-- 身高 -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userInfo.height"
                  label="身高 (公分)"
                  type="number"
                  min="100"
                  max="250"
                  suffix="cm"
                  variant="outlined"
                  :rules="[rules.required, rules.height]"
                  prepend-inner-icon="mdi-human-male-height"
                />
              </v-col>

              <!-- 體重 -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userInfo.weight"
                  label="體重 (公斤)"
                  type="number"
                  min="30"
                  max="200"
                  suffix="kg"
                  variant="outlined"
                  :rules="[rules.required, rules.weight]"
                  prepend-inner-icon="mdi-weight"
                />
              </v-col>

              <!-- BMI 顯示 -->
              <v-col cols="12">
                <v-alert
                  v-if="bmi"
                  :color="getBmiColor(bmi)"
                  variant="tonal"
                  class="mb-4"
                >
                  <div class="d-flex align-center">
                    <v-icon class="mr-2">mdi-calculator</v-icon>
                    <strong>您的 BMI：{{ bmi.toFixed(1) }}</strong>
                    <v-chip
                      :color="getBmiColor(bmi)"
                      size="small"
                      class="ml-2"
                    >
                      {{ getBmiStatus(bmi) }}
                    </v-chip>
                  </div>
                </v-alert>
              </v-col>

              <!-- 疾病狀態 -->
              <v-col cols="12">
                <v-select
                  clearable
                  v-model="userInfo.disease"
                  label="疾病狀況"
                  :items="diseaseOptions"
                  multiple
                  chips
                  variant="outlined"
                  prepend-inner-icon="mdi-heart-pulse"
                  :rules="[rules.required]"
                />
              </v-col>

              <!-- 健身狀態 -->
              <v-col cols="12">
                <v-select

                  v-model="userInfo.state"
                  label="健身目標"
                  :items="stateOptions"
                  multiple
                  chips
                  variant="outlined"
                  prepend-inner-icon="mdi-dumbbell"
                  :rules="[rules.required]"
                />
              </v-col>

              <!-- 電子郵件 -->
              <v-col cols="12">
                <v-text-field
                  v-model="userInfo.email"
                  label="電子郵件"
                  type="email"
                  variant="outlined"
                  :rules="[rules.required, rules.email]"
                  prepend-inner-icon="mdi-email"
                  readonly
                />
              </v-col>

              <!-- 帳號 -->
              <v-col cols="12">
                <v-text-field
                  v-model="userInfo.account"
                  label="帳號"
                  variant="outlined"
                  :rules="[rules.required]"
                  prepend-inner-icon="mdi-account"
                  readonly
                />
              </v-col>
            </v-row>

            <!-- 按鈕區域 -->
            <v-row class="mt-4">
              <v-col cols="12" class="d-flex justify-center gap-4">

                <v-btn
                  color="secondary"
                  size="large"
                  variant="outlined"
                  @click="resetForm"
                  prepend-icon="mdi-refresh"
                  class="mr-5"
                >
                  重置
                </v-btn>

                <v-btn
                  color="primary"
                  size="large"
                  type="submit"
                  :loading="loading"
                  prepend-icon="mdi-content-save"
                >
                  儲存資訊
                </v-btn>
                <!--  -->
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- 成功提示 -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          關閉
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import userService from '@/services/user'

const userStore = useUserStore()
const form = ref(null)
const loading = ref(false)

// 使用者資訊
const userInfo = ref({
  account: '',
  email: '',
  height: null,
  weight: null,
  disease: [],
  state: []
})

// 選項
const diseaseOptions = [
  { title: '高血壓', value: '高血壓' },
  { title: '糖尿病', value: '糖尿病' },
  { title: '心臟病', value: '心臟病' },
  { title: '無特殊疾病', value: '無特殊疾病' }
]

const stateOptions = [
  { title: '健身', value: '健身' },
  { title: '減重', value: '減重' },
  { title: '增重', value: '增重' },
  { title: '維持健康', value: '維持健康' }
]

// 驗證規則
const rules = {
  required: v => !!v || '此欄位為必填',
  email: v => /.+@.+\..+/.test(v) || '請輸入有效的電子郵件',
  height: v => (v >= 100 && v <= 250) || '身高應在 100-250 公分之間',
  weight: v => (v >= 30 && v <= 200) || '體重應在 30-200 公斤之間'
}

// BMI 計算
const bmi = computed(() => {
  if (!userInfo.value.height || !userInfo.value.weight) return null
  const heightInMeters = userInfo.value.height / 100
  return userInfo.value.weight / (heightInMeters * heightInMeters)
})

// BMI 狀態判斷
const getBmiStatus = (bmi) => {
  if (bmi < 18.5) return '體重過輕'
  if (bmi < 24) return '正常體重'
  if (bmi < 27) return '體重過重'
  if (bmi < 30) return '輕度肥胖'
  return '重度肥胖'
}

// BMI 顏色
const getBmiColor = (bmi) => {
  if (bmi < 18.5) return 'blue'
  if (bmi < 24) return 'green'
  if (bmi < 27) return 'orange'
  return 'red'
}

// 提示訊息
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// 載入使用者資訊
const loadUserInfo = async () => {
  try {
    loading.value = true
    const response = await userService.profile()
    const userData = response.data.user // 修正：使用 response.data.user

    userInfo.value = {
      account: userData.account || '',
      email: userData.email || '',
      height: userData.height || null,
      weight: userData.weight || null,
      disease: userData.disease || [],
      state: userData.state || []
    }
  } catch (error) {
    console.error('載入使用者資訊失敗:', error)
    showSnackbar('載入使用者資訊失敗', 'error')
  } finally {
    loading.value = false
  }
}

// 儲存使用者資訊
const saveUserInfo = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  try {
    loading.value = true
    await userService.updateProfile(userInfo.value)
    showSnackbar('資訊儲存成功！', 'success')
  } catch (error) {
    console.error('儲存失敗:', error)
    showSnackbar('儲存失敗，請稍後再試', 'error')
  } finally {
    loading.value = false
  }
}

// 重置表單
const resetForm = () => {
  loadUserInfo()
}

// 顯示提示訊息
const showSnackbar = (text, color = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  }
}

// 頁面載入時取得使用者資訊
onMounted(() => {
  loadUserInfo()
})
</script>

<route lang="yaml">
meta:
  layout: "user"
  title: "個人基本資訊"
  login: "login-only"
</route>
