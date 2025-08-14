<template>
  <v-card class="m-2">

    <v-card-title>{{ title }}</v-card-title>

    <v-card-subtitle>
      <v-chip
        v-for="cat in category"
        id="cate"
        :key="cat"
        class="mr-1"
        color="success"
        size="small"
        variant="outlined"
      >
        {{ cat }}
      </v-chip>
    </v-card-subtitle>

    <v-card-text>{{ content }}</v-card-text>

    <v-card-actions class="mb-3">
      <v-spacer />

      <!-- :to="'/newsdata/' + url" -->

      <v-btn
        id="button"
        color="success"
        text="詳細資訊"
        :to="'/newsdata/' + _id"
        variant="tonal"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup>
  defineProps(['_id', 'title', 'content', 'url', 'date', 'category'])
</script>

<style scoped>
#button {
  font-weight: 600;
}

#cate{
  font-weight: 600;
}
</style>
