<!-- <template>
  <v-container class="h-screen">
    <h1 class="text-center mt-8">問題回報</h1>

    <v-divider class="mx-auto border-opacity-50" color="red" length="100" :thickness="6" />
  </v-container>
</template> -->

<template>
  <h1 class="text-center mt-1">問題回報</h1>

  <v-divider class="mx-auto border-opacity-50 mb-4" color="red" length="100" :thickness="6" />

  <v-card class="pa-8 mx-auto border-md" width="500">
    <form @submit.prevent="submit">
      <h4 class="ml-10">問題描述‼️</h4>
      <v-textarea
        v-model="name.value.value"
        :counter="10"
        :error-messages="name.errorMessage.value"
        placeholder="寫下你的問題"
        prepend-icon="mdi-pencil"
      />

      <h4 class="ml-10">聯絡方式‼️</h4>
      <v-text-field
        v-model="email.value.value"
        :error-messages="email.errorMessage.value"
        placeholder="若想追蹤進度，歡迎留下聯絡方式。"
        prepend-icon="mdi-phone"
      />

      <h4 class="ml-10">圖片‼️</h4>
      <v-file-input
        clearable
      />

      <v-btn
        class="ml-10 me-4"
        type="submit"
      >
        提交
      </v-btn>

      <v-btn @click="handleReset">
        清除
      </v-btn>
    </form>
  </v-card>
</template>

<script setup>
  import { useField, useForm } from 'vee-validate'
  import { ref } from 'vue'

  const { handleSubmit, handleReset } = useForm({
    validationSchema: {
      name (value) {
        if (value?.length >= 2) return true

        return 'Name needs to be at least 2 characters.'
      },

      email (value) {
        if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

        return 'Must be a valid e-mail.'
      },

    },
  })
  const name = useField('name')
  const email = useField('email')

  const items = ref([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
  ])

  const submit = handleSubmit(values => {
    alert(JSON.stringify(values, null, 2))
  })
</script>
