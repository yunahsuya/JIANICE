<template>
  <v-container>
    <h1 class="text-center">主要功能</h1>
    <v-divider class="border-opacity-100 d-flex justify-center" inset style="width: 400px;" :thickness="7" />

    <v-row>

      <v-col cols="6">

        <v-card
          class="mt-8"
          prepend-icon="mdi-home-heart"
          variant="tonal"
          width="450"
        >
          <template #title>
            <span class="font-weight-black">找隨機抽餐廳</span>
          </template>

          <v-card-text class="bg-surface-light pt-4" style="height: 150px; line-height: 40px;">
            👉 不再為「要吃什麼？」煩惱<br>
            👉 透過轉盤或拉霸的方式，讓選擇多一點驚喜<br>
            👉 幫助快速決定，也讓用餐更有趣<br>
          </v-card-text>
        </v-card>

      </v-col>

      <!--  -->

      <v-col cols="6">
        <v-card
          class="mt-8"
          prepend-icon="mdi-nutrition"
          variant="tonal"
          width="450"
        >
          <template #title>
            <span class="font-weight-black">找營養管理</span>
          </template>

          <v-card-text class="bg-surface-light pt-4" style="height: 150px; line-height: 40px;">
            👉 系統會根據你的紀錄，提醒缺少的營養素<br>
            👉 自動推薦對應的食物與餐廳<br>
            👉 讓健康飲食變得更直觀、更貼近生活<br>
          </v-card-text>
        </v-card>
      </v-col>
      <!--  -->

      <v-col cols="6">
        <v-card
          prepend-icon="mdi-newspaper"
          variant="tonal"
          width="450"
        >
          <template #title>
            <span class="font-weight-black">找健康新聞</span>
          </template>

          <v-card-text class="bg-surface-light pt-4" style="height: 150px; line-height: 40px;">
            👉 即時抓取健康署發布的最新健康新聞<br>
            👉 內容可靠，避免不正確的飲食資訊<br>
            👉 隨時掌握營養與健康的最新趨勢<br>
          </v-card-text>
        </v-card>
      </v-col>
      <!--  -->

      <v-col cols="6">
        <v-card

          prepend-icon="mdi-panorama-variant-outline"
          variant="tonal"
          width="450"
        >
          <template #title>
            <span class="font-weight-black">找回憶</span>
          </template>

          <v-card-text class="bg-surface-light pt-4" style="height: 150px; line-height: 40px;">
            👉 不只是記錄「吃了什麼」，還能記錄「和誰、在什麼心情下吃」<br>
            👉 支援加密保護，讓某些回憶只屬於你<br>
            👉 打造專屬的飲食日記，讓每一次用餐都留下痕跡<br>
          </v-card-text>
        </v-card>

      </v-col>
      <!--  -->

      <!--  -->
    </v-row>
  </v-container>
</template>
