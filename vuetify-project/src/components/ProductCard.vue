<template>
  <v-card>
    <v-img cover height="300" :src="image" />
    <!-- <v-card-title>
      <router-link :to="'/product/' + _id">{{ name }}</router-link>
    </v-card-title> -->

    <v-card-title>{{ name }}</v-card-title>
    <v-card-subtitle>{{ category }} / {{ price }}</v-card-subtitle>
    <v-card-text>{{ description }}</v-card-text>

    <v-card-actions class="mb-3">
      <v-spacer />
      <v-btn
        id="button"
        color="orange"
        text="詳細資訊"
        :to="'/product/' + _id"
        variant="flat"
      />
    </v-card-actions>

    <!-- <v-btn class="mb-5 float-left" color="success" variant="tonal">
      <router-link :to="'/product/' + _id">{{ name }}</router-link>
    </v-btn> -->
  </v-card>
</template>

<script setup>
  defineProps(['_id', 'image', 'name', 'category', 'price', 'description'])
</script>
