<template>
  <v-container fluid class="register-container">
    <v-row justify="center" align="center" >
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="register-card" elevation="12">
          <v-card-text class="text-center pa-8">
            <!-- Logo/標題區域 -->
            <div class="mb-8">
              <v-icon size="64" color="primary" >
                mdi-account-plus
              </v-icon>
              <h1 class="text-h4 font-weight-bold text-primary">
                建立帳戶
              </h1>
              <!-- <p class="text-body-2 text-medium-emphasis">
                填寫以下資訊完成註冊
              </p> -->
            </div>

            <!-- 註冊表單 -->
            <v-form :disabled="form.isSubmitting.value" @submit.prevent="submit">
              <v-text-field
                v-model="account.value.value"
                counter
                :error-messages="account.errorMessage.value"
                label="帳號"
                maxlength="20"
                minlength="4"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                color="primary"
                required
              />

              <v-text-field
                v-model="email.value.value"
                :error-messages="email.errorMessage.value"
                label="信箱"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                color="primary"
                required
              />

              <v-text-field
                v-model="password.value.value"
                counter
                :error-messages="password.errorMessage.value"
                label="密碼"
                maxlength="20"
                minlength="4"
                prepend-inner-icon="mdi-lock"
                append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="passwordVisible = !passwordVisible"
                :type="passwordVisible ? 'text' : 'password'"
                variant="outlined"
                color="primary"
                required
              />

              <v-text-field
                v-model="confirmPassword.value.value"
                counter
                :error-messages="confirmPassword.errorMessage.value"
                label="確認密碼"
                maxlength="20"
                minlength="4"
                prepend-inner-icon="mdi-lock-check"
                append-inner-icon="confirmPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="confirmPasswordVisible = !confirmPasswordVisible"
                :type="confirmPasswordVisible ? 'text' : 'password'"
                variant="outlined"
                color="primary"
                required
              />

              <v-btn
                :loading="form.isSubmitting.value"
                type="submit"
                color="primary"
                size="large"
                block
                class="mb-8"
                elevation="2"
              >
                <v-icon left>mdi-account-plus</v-icon>
                註冊
              </v-btn>
            </v-form>

            <!-- 登入連結 -->
            <div class="text-center">
              <span class="text-body-2 text-medium-emphasis mb-16">
                已有帳戶？
              </span>
              <v-btn
                variant="text"
                color="primary"
                class="ml-4"
                @click="$router.push('/login')"
              >
                立即登入
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
  import validator from 'validator'
  import { useField, useForm } from 'vee-validate'
  import { useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import * as yup from 'yup'
  import userService from '@/services/user'

  const createSnackbar = useSnackbar()
  const router = useRouter()
  const passwordVisible = ref(false)
  const confirmPasswordVisible = ref(false)

  // 建立 vee-validate 的表單
  const form = useForm({
    // 用 yup 定義表單驗證格式
    // https://github.com/jquense/yup
    validationSchema: yup.object({
      account: yup
        // 資料型態是文字
        .string()
        .required('帳號是必填的')
        .min(4, '帳號至少需要 4 個字元')
        .max(20, '帳號最多只能有 20 個字元')
        // 自訂驗證(驗證名稱, 錯誤訊息, 驗證function)
        .test('isAlphanumeric', '帳號只能包含英文字母和數字', value => {
          return validator.isAlphanumeric(value)
        }),
      email: yup
        .string()
        .required('電子郵件是必填的')
        .test('isEmail', '請輸入有效的電子郵件地址', value => {
          return validator.isEmail(value)
        }),
      password: yup
        .string()
        .required('密碼是必填的')
        .min(4, '密碼至少需要 4 個字元')
        .max(20, '密碼最多只能有 20 個字元'),
      confirmPassword: yup
        .string()
        .required('確認密碼是必填的')
        // .oneOf(陣列, 訊息)   欄位的值必須是陣列內的其中一個
        // .ref(欄位)          取得欄位的值
        // .ref(password)     password 欄位的值
        .oneOf([yup.ref('password')], '密碼和確認密碼必須相同'),
    }),
  })
  // 建立 vee-validate 的表單欄位
  // 一定要在 useForm 後面
  // useField(欄位名稱)
  const account = useField('account')
  const email = useField('email')
  const password = useField('password')
  const confirmPassword = useField('confirmPassword')

  // vee-validate 的表單送出
  // handleSubmit(處理function)
  // values 表單所有欄位的值
  const submit = form.handleSubmit(async values => {
    try {
      await userService.create({
        account: values.account,
        email: values.email,
        password: values.password,
      })
      createSnackbar({
        text: '註冊成功！',
        snackbarProps: {
          color: 'green',
        },
      })
      // 註冊成功後，導向到登入頁面
      router.push('/login')
    } catch (error) {
      console.error(error)
      createSnackbar({
        text: error?.response?.data?.message || '註冊失敗，請稍後再試！',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  })
</script>

<style scoped>


.register-card {
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
    title: '註冊'
    # 只能在沒登入的情況下看
    login: 'no-login-only'
    # 不是管理員也能看
    admin: false
</route>
