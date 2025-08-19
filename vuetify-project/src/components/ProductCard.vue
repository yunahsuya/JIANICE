<template>
  <!-- <v-card> → Vuetify 的卡片元件，用來包裹整個餐廳/產品資訊 -->
  <v-card>
    <!-- <v-img> → 顯示圖片
          cover → 讓圖片填滿整個容器，並裁切溢出的部分
          height="300" → 高度固定 300px
          :src="image" → 綁定傳入的 image 屬性（props），圖片路徑會動態套用
    -->
    <v-img cover height="300" :src="image" />

    <!-- 原本 -->
    <!-- <v-card-title>
      <router-link> => 可以點擊跳到 /product/_id 頁面
      <router-link :to="'/product/' + _id">{{ name }}</router-link>
    </v-card-title> -->

    <!--  -->

    <!-- <v-card-title> → 卡片標題區域
         {{ name }} → 顯示傳入的 name 屬性
    -->
    <v-card-title class="d-flex align-center">
      {{ name }}

      <v-spacer />

      <!-- <v-spacer> → Vuetify 的彈性間距，用來把後面的按鈕或元素推到最右邊 -->
      <!-- <v-spacer /> -->

      <!-- 分類 -->
      <!--
        <v-chip> → 小標籤/徽章。
        color="orange" → 顏色橘色。
        內容顯示分類名稱
     -->
      <v-chip color="orange">
        {{ category }}
      </v-chip>
    </v-card-title>

    <!--  -->

    <!-- <v-divider>
         水平分隔線

         mb-5 → 下方 margin 5 單位，讓區塊間隔開
    -->
    <v-divider class="mb-5" />

    <!-- <v-card-subtitle> → 副標題區，這裡顯示「分類 / 價格」。-->
    <v-card-subtitle>{{ category }} / {{ price }}</v-card-subtitle>

    <!-- <v-card-text> → 文字區塊，顯示描述 -->
    <v-card-text>{{ description }}</v-card-text>

    <!--  <v-card-actions> → 卡片底部的操作按鈕區。

          <v-btn> → 按鈕元件。
          id="button" → 給按鈕一個 ID。
          color="orange" → 顏色橘色。
          text="詳細資訊" → 按鈕文字。
          :to="'/product/' + _id" → 點擊導向動態路由 /product/_id。
          variant="flat" → 扁平樣式按鈕。

          原本註解掉的 <router-link> 版本，也可以達到類似效果，但現在用 v-btn 搭配 :to 更簡單。
   -->
    <v-card-actions class="mb-3">
      <v-spacer />
      <v-btn
        color="orange"
        text="詳細資訊"
        :to="'/product/' + _id"
        variant="flat"
      />
    </v-card-actions>

    <!-- 原本 -->
    <!-- <v-btn class="mb-5 float-left" color="success" variant="tonal">
      <router-link :to="'/product/' + _id">{{ name }}</router-link>
    </v-btn> -->
  </v-card>
</template>

<!--
  defineProps → Vue 3 <script setup> 的語法，定義這個組件要接收的 props。

  這裡組件會接收：
  _id → 唯一 ID
  image → 圖片路徑
  name → 名稱
  category → 分類
  price → 價格
  description → 描述

  這些值都從父組件傳進來，可以動態顯示內容
-->
<script setup>
  defineProps(['_id', 'image', 'name', 'category', 'price', 'description'])
</script>

<!--
    🔹 總結

    這是一個產品/餐廳卡片組件。
    卡片有圖片、標題、副標題、描述、小標籤和按鈕。
    點按「詳細資訊」可以跳轉到對應的產品頁。
    所有資料都由父組件傳入 props，所以這個組件是完全可重用的

-->
