<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">餐廳</h1>
        <v-divider />

        <!-- 側邊欄 -->
        <v-navigation-drawer
          class="bg-deep-purple pl-4"
          permanent
          theme="dark"
          width="300"
        >
          <v-list color="transparent">
            <v-list-item prepend-icon="mdi-home-heart" title="餐廳分類" />

            <v-divider />

            <v-list-item prepend-icon="mdi-rice" title="台式" />
            <v-list-item prepend-icon="mdi-pizza" title="義式" />
            <v-list-item prepend-icon="mdi-food-drumstick-outline" title="美式" />
            <v-list-item prepend-icon="mdi-noodles" title="日式" />
            <v-list-item prepend-icon="mdi-gavel" title="韓式" />
            <v-list-item prepend-icon="mdi-food" title="速食" />
            <v-list-item prepend-icon="mdi-access-point-minus" title="蔬食" />
            <v-list-item prepend-icon="mdi-cupcake" title="甜點" />

            <v-list-item prepend-icon="mdi-beer" title="飲料" />

          </v-list>

          <template #append>
            <div class="pa-2">
              <v-btn block>
                Logout
              </v-btn>
            </div>
          </template>
        </v-navigation-drawer>

      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="yaml">
  meta:
    title: '餐廳'
    login: ''
    admin: false

</route>
