<template>
  <v-card>
    <v-img cover height="300" :src="image" />
    <v-card-title>
      <router-link :to="'/product/' + _id">{{ name }}</router-link>
    </v-card-title>
    <v-card-subtitle>{{ category }} / {{ price }}</v-card-subtitle>
    <v-card-text>{{ description }}</v-card-text>
  </v-card>
</template>

<script setup>
  defineProps(['_id', 'image', 'name', 'category', 'price', 'description'])
</script>
