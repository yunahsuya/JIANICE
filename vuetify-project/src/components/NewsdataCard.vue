<template>
  <v-card class="m-2">

    <v-card-title>{{ title }}</v-card-title>

    <v-card-subtitle>{{ category }}</v-card-subtitle>

    <v-card-text>{{ content }}</v-card-text>

    <v-card-actions class="mb-3">
      <v-spacer />

      <v-btn
        color="success"
        text="詳細資訊"
        :to="'/newsdata/' + url"
        variant="tonal"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup>
  defineProps(['_id', 'title', 'content', 'url', 'date', 'category'])
</script>
