<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">口袋名單</h1>
        <v-divider />

        <!-- <v-number-input
          control-variant="split"
          hide-details
          :model-value="item.quantity"
          variant="outlined"
          width="150px"
          @update:model-value="updateCart($event, item, i)"
        /> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="yaml">
  meta:
    title: '口袋名單'
    login: 'login-only'
    admin: false
</route>
