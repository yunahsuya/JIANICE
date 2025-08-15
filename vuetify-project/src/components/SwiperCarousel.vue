<!-- 1. 匯入 輪播圖

     # 網址
     https://codesandbox.io/p/sandbox/7sgx2x?file=%2Fsrc%2FApp.vue%3A2%2C3-8%2C12

     2. 斷點

    # 網址
    https://swiperjs.com/demos#responsive-breakpoints

    3. Grid 網格(下面沒有)

    # 網址
    https://swiperjs.com/demos#grid
-->

<template>
  <v-app>
    <v-main>
      <v-contaoner>
        <v-row>
          <v-col cols="12" lg="12" md="12">
            <!-- 斷點方法一 => '576': -->

            <!-- 斷點方法二 => v-row、v-col -->

            <!-- :navigation="true" => 箭頭 -->
            <!--
                :pagination="true" => 點點
                clickable: true, => 點點可以點
             -->
            <!-- :space-between="30" => 圖片之間有空隙 -->
            <!-- :slides-per-view="1" => 一次顯示 3 張 -->
            <!-- :free-mode="true" => 滑動快速 -->
            <!-- :loop="true" => 可以一直點，不會結束 -->
            <!-- :effect="'coverflow'" => 波折的輪播圖 -->
            <!-- :mousewheel="true" => 滑鼠滾動 控制 上、下張 -->
            <!-- keyboard => 鍵盤 控制 上、下張
                :keyboard="{
                  enabled: true,
                }"
            -->
            <!-- 自動播放
                :autoplay="{
                delay: 2500,
                disableOnInteraction: false,
              }"
            -->
            <swiper
              :autoplay="{
                delay: 2500,
                disableOnInteraction: false,
              }"
              :breakpoints="{
                '576': {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                '768': {
                  slidesPerView: 2,
                  spaceBetween: 40,
                },
                '992': {
                  slidesPerView: 3,
                  spaceBetween: 50,
                },
              }"
              class="mySwiper"
              :effect="'coverflow'"
              :free-mode="true"
              :keyboard="{
                enabled: true,
              }"
              :loop="true"
              :modules="modules"
              :mousewheel="true"
              :navigation="true"
              :pagination="{
                clickable: true,
              }"
              :slides-per-view="1"
              :space-between="30"
            >
              <swiper-slide>
                <img src="https://picsum.photos/800/600/?random=1">
              </swiper-slide>

              <swiper-slide>
                <img src="https://picsum.photos/800/600/?random=2">
              </swiper-slide>

              <swiper-slide>
                <img src="https://picsum.photos/800/600/?random=3">
              </swiper-slide>

              <swiper-slide>
                <img src="https://picsum.photos/800/600/?random=4">
              </swiper-slide>

              <swiper-slide>
                <img src="https://picsum.photos/800/600/?random=5">
              </swiper-slide>

              <swiper-slide>
                <img src="https://picsum.photos/800/600/?random=6">
              </swiper-slide>

              <swiper-slide>
                <img src="https://picsum.photos/800/600/?random=7">
              </swiper-slide>

              <swiper-slide>
                <img src="https://picsum.photos/800/600/?random=8">
              </swiper-slide>

              <swiper-slide>
                <img src="https://picsum.photos/800/600/?random=9">
              </swiper-slide>
            </swiper>
          </v-col>
        </v-row>
      </v-contaoner>
    </v-main>
  </v-app>
</template>

<script setup>
//

/*

https://codesandbox.io/p/sandbox/7sgx2x?file=%2Fsrc%2FApp.vue%3A12%2C2-17%2C34

*/

// import required modules
// Effect coverflow (三折圖) => EffectCoverflow
  import {
    Autoplay,
    EffectCoverflow,
    FreeMode,
    Keyboard,
    Mousewheel,
    Navigation,
    Pagination,
  } from 'swiper/modules'

  import { Swiper, SwiperSlide } from 'swiper/vue'

  // 引入 Swiper 的樣式
  import 'swiper/css'

  // 引入 Swiper 的導航樣式
  import 'swiper/css/navigation'

  import 'swiper/css/effect-coverflow'

  // 他對應的是 上面的  modules嗎?
  const modules = [
    FreeMode,
    Autoplay,
    Mousewheel,
    Keyboard,
    Navigation,
    Pagination,
    EffectCoverflow,
  ]
</script>

<style>
.mySwiper {
  /* width: 100vw; */
  height: 80vh;
}

.mySwiper img {
  width: 100%;
  height: 100%;

  /* 確保圖片 */
  object-fit: cover;
}

.swiper-button-next,
.swiper-button-prev {
  color: white; /* 改成你喜歡的顏色，例如深灰色 */
}

.swiper-pagination-bullet {
  width: 15px;
  height: 15px;
  background-color: #ccc;
  opacity: 1;
  transition: all 0.3s ease; /* ✨增加動畫過渡，滑動會更柔順 */
  border-radius: 50%;
}

.swiper-pagination-bullet-active {
  width: 20px;
  height: 20px;
  background-color: #4CAF50; /* 可愛的綠色 */
}

</style>
