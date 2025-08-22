<template>

  <v-card>
    <!-- 圖片 -->
    <v-img cover height="300" :src="image" />
    <v-divider class="mt-2" />

    <!-- 標題 -->
    <v-card-title class="d-flex align-center">
      {{ name }}

      <v-spacer />

      <!-- 分類 -->
      <v-chip color="orange">
        {{ category }}
      </v-chip>
    </v-card-title>

    <v-card-text class="font-weight-light">{{ description }}</v-card-text>

    <v-card-actions class="mb-3">
      <v-spacer />
      <v-btn
        color="orange"
        text="詳細資訊"
        :to="'/product/' + _id"
        variant="flat"
      />
    </v-card-actions>

  </v-card>

</template>

<script setup>
  defineProps(['_id', 'image', 'name', 'category', 'price', 'description'])
</script>
