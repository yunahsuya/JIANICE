<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">{{ product.name }}</h1>
      </v-col>
      <v-divider />
      <v-col cols="12" md="6">
        <v-img
          class="mb-4"
          contain
          height="400"
          :src="product.image"
        />
      </v-col>
      <v-col cols="12" md="6">
        <p>分類: {{ product.category }}</p>
        <p>價格: {{ product.price }}</p>
        <v-divider class="my-5" />
        <p style="white-space: pre;">{{ product.description }}</p>
        <v-number-input
          v-model="quantity"
          control-variant="split"
          :min="1"
          variant="outlined"
        />
        <v-btn
          class="mt-4"
          color="primary"
          :disabled="!product.sell"
          @click="addToCart"
        >
          加入購物車
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-overlay
    class="align-center justify-center text-center"
    :model-value="!product.sell"
    opacity="0.7"
    persistent
    scrim="black"
  >
    <h1>已下架</h1>
    <p>這個商品已經下架，無法購買。</p>
    <v-btn
      color="primary"
      to="/"
    >
      返回首頁
    </v-btn>
  </v-overlay>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import productService from '@/services/product'
  import userService from '@/services/user'
  import { useUserStore } from '@/stores/user'

  const createSnackbar = useSnackbar()
  const router = useRouter()
  const route = useRoute()
  const user = useUserStore()

  const product = ref({
    name: '',
    price: 0,
    description: '',
    category: '',
    sell: true,
    image: '',
  })

  const getProduct = async () => {
    try {
      const { data } = await productService.getId(route.params.id)
      product.value.name = data.product.name
      product.value.price = data.product.price
      product.value.description = data.product.description
      product.value.category = data.product.category
      product.value.sell = data.product.sell
      product.value.image = data.product.image

      document.title = `${data.product.name} | 購物網站`
    } catch (error) {
      console.error('Error fetching products:', error)
      createSnackbar({
        text: '無法載入商品資料',
        snackbarProps: {
          color: 'red',
        },
      })
      router.push('/')
    }
  }
  getProduct()

  const quantity = ref(1)
  const addToCart = async () => {
    try {
      const { data } = await userService.cart({
        product: route.params.id,
        quantity: quantity.value,
      })
      user.cartTotal = data.result
      createSnackbar({
        text: '已加入購物車',
        snackbarProps: {
          color: 'green',
        },
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      createSnackbar({
        text: '無法加入購物車',
        snackbarProps: {
          color: 'red',
        },
      })
      router.push('/')
    }
  }
</script>

<route lang="yaml">
  meta:
    # 標題
    title: '商品'
    # 有沒有登入都能看
    login: ''
    # 不是管理員也能看
    admin: false
</route>
