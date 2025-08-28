<template>
  <v-container class="login-container" fluid>
    <v-row align="center" class="mt-10" justify="center">
      <v-col cols="12" lg="4" md="6" sm="8">
        <v-card class="login-card" elevation="12">
          <v-card-text class="text-center pa-8">
            <!-- Logo/標題區域 -->
            <div class="mb-8">
              <v-icon class="mb-2" color="primary" size="64">
                mdi-account-circle
              </v-icon>
              <h1 class="text-h4 font-weight-bold text-primary mb-2">
                歡迎回來
              </h1>
              <!-- <p class="text-body-2 text-medium-emphasis">
                請登入您的帳戶以繼續
              </p> -->
            </div>

            <!-- 登入表單 -->
            <v-form :disabled="form.isSubmitting.value" @submit.prevent="submit">
              <v-text-field
                v-model="account.value.value"
                class="mb-4"
                color="primary"
                :error-messages="account.errorMessage.value"
                label="帳號或信箱"
                prepend-inner-icon="mdi-account"
                required
                variant="outlined"
              />

              <v-text-field
                v-model="password.value.value"
                append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                counter
                color="primary"
                :error-messages="password.errorMessage.value"
                label="密碼"
                maxlength="20"
                class="mb-6"
                minlength="4"
                prepend-inner-icon="mdi-lock"
                required
                :type="passwordVisible ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="passwordVisible = !passwordVisible"
              />

              <v-btn
                block
                class="mb-4"
                color="primary"
                elevation="2"
                :loading="form.isSubmitting.value"
                size="large"
                type="submit"
              >
                <v-icon left>mdi-login</v-icon>
                登入
              </v-btn>
            </v-form>

            <!-- 註冊連結 -->
            <div class="text-center">
              <span class="text-body-2 text-medium-emphasis">
                還沒有帳戶？
              </span>
              <v-btn
                class="ml-2"
                color="primary"
                variant="text"
                @click="$router.push('/register')"
              >
                立即註冊
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { useField, useForm } from 'vee-validate'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import * as yup from 'yup'
  import userService from '@/services/user'
  import { useUserStore } from '@/stores/user'

  const createSnackbar = useSnackbar()
  const router = useRouter()
  const user = useUserStore()
  const passwordVisible = ref(false)

  // 建立 vee-validate 的表單
  const form = useForm({
    // 用 yup 定義表單驗證格式
    // https://github.com/jquense/yup
    validationSchema: yup.object({
      account: yup
        // 資料型態是文字
        .string()
        .required('帳號或電子郵件是必填的'),
      password: yup
        .string()
        .required('密碼是必填的')
        .min(4, '密碼至少需要 4 個字元')
        .max(20, '密碼最多只能有 20 個字元'),
    }),
  })
  // 建立 vee-validate 的表單欄位
  // 一定要在 useForm 後面
  // useField(欄位名稱)
  const account = useField('account')
  const password = useField('password')

  // vee-validate 的表單送出
  // handleSubmit(處理function)
  // values 表單所有欄位的值
  const submit = form.handleSubmit(async values => {
    try {
      const { data } = await userService.login({
        account: values.account,
        password: values.password,
      })
      user.login(data.user)
      createSnackbar({
        text: '登入成功！',
        snackbarProps: {
          color: 'green',
        },
      })
      // 登入成功後，導向到首頁
      router.push('/')
    } catch (error) {
      console.error(error)
      createSnackbar({
        text: error?.response?.data?.message || '登入失敗，請稍後再試！',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  })
</script>

<style scoped>

.login-card {
  border-radius: 16px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.min-vh-100 {
  min-height: 100vh;
}
</style>

<route lang="yaml">
  meta:
    # 標題
    title: '登入'
    # 只能在沒登入的情況下看
    login: 'no-login-only'
    # 不是管理員也能看
    admin: false
</route>
