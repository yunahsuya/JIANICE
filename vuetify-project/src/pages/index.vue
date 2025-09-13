<template>
  <div>
    <!-- Hero Section with Parallax -->
    <v-parallax class="h-screen" src="../assets/pexels-goumbik-349610.jpg">
      <div
        class="d-flex flex-column h-screen justify-center"
        style="color: #0e6200"
      >
        <!-- 使用響應式容器 -->
        <div class="mx-auto mx-md-10 px-4" style="max-width: 800px">
          <!-- 響應式標題 -->
          <p class="text-h3 text-md-h1 font-weight-bold mb-2">不只是選擇餐廳</p>
          <p class="text-h4 text-md-h2 mb-4 line-height-1-2">
            解決選擇困難、營養缺口與回憶保存的飲食平台
          </p>

          <!-- 響應式內文 -->
          <p class="text-body-1 text-md-h6 line-height-1-6 mb-6">
            在日常生活裡，吃飯本來應該是快樂的事，卻常常成為小小的壓力。<br
              class="d-none d-md-block"
            />
            我們會因為選擇太多而猶豫，會因為缺少營養而擔心健康，也會因為沒有地方保存回憶，而覺得遺憾。
          </p>

          <!-- 響應式按鈕 -->
          <v-btn
            class="text-white"
            color="orange-darken-2"
            rounded
            size="large"
            @click="scrollToInfo"
          >
            <v-icon start>mdi-arrow-down</v-icon>
            探索更多功能
          </v-btn>
        </div>
      </div>
    </v-parallax>

    <!-- Features Section -->
    <section id="info" class="bg-grey-lighten-5">
      <v-container class="py-16" fluid>
        <div class="text-center mb-10">
          <h2
            class="text-h3 text-md-h2 font-weight-bold text-grey-darken-3 mb-4"
          >
            主要功能
          </h2>
          <v-divider
            class="mx-auto mb-4 border-opacity-100"
            color="orange-darken-2"
            thickness="6"
            width="100"
          />

          <p
            class="text-body-1 text-grey-darken-1"
            style="max-width: 600px; margin: 0 auto"
          >
            讓每一次用餐都成為美好的體驗
          </p>
        </div>

        <!-- 修正卡片排列問題 -->
        <v-row class="justify-center" style="max-width: 1300px; margin: 0 auto">
          <v-col
            v-for="(feature, index) in features"
            :key="index"
            class="pa-2"
            cols="12"
            lg="3"
            md="6"
            sm="6"
            xl="3"
          >
            <v-card
              class="h-100 transition-swing feature-card"
              :class="{ 'elevation-12': feature.hover }"
              elevation="4"
              rounded="xl"
              @click="handleFeatureClick(feature)"
              @mouseenter="feature.hover = true"
              @mouseleave="feature.hover = false"
            >
              <div class="text-center pt-6">
                <v-img size="10" :src="feature.image" width="50px" />
                <v-icon
                  color="orange-darken-2"
                  :icon="feature.icon"
                  size="48"
                />
                <v-card-title
                  class="text-h6 font-weight-bold text-grey-darken-3 text-center"
                >
                  {{ feature.title }}
                </v-card-title>
              </div>
              <v-card-text class="pt-0 px-4 pb-6 mt-3">
                <v-list class="bg-transparent pa-0">
                  <v-list-item
                    v-for="(point, pointIndex) in feature.points"
                    :key="pointIndex"
                    class="px-0 py-1"
                  >
                    <template #prepend>
                      <v-icon
                        class="feature-check-icon"
                        color="success"
                        size="small"
                        >mdi-check</v-icon
                      >
                    </template>
                    <v-list-item-title
                      class="text-body-2 text-grey-darken-1 feature-point-text"
                    >
                      {{ point }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Vision Section -->
    <section class="bg-white">
      <v-container class="py-16">
        <div class="text-center mb-12">
          <h2
            class="text-h3 text-md-h2 font-weight-bold text-grey-darken-3 mb-4"
          >
            JIANICE 的願景
          </h2>
          <v-divider
            class="mx-auto mb-4 border-opacity-100"
            color="orange-darken-2"
            thickness="6"
            width="100"
          />
        </div>

        <v-row class="align-center">
          <v-col cols="12" md="6">
            <div class="pr-md-8 pl-6">
              <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">
                讓健康飲食成為生活的一部分
              </h3>
              <p class="text-body-1 text-grey-darken-1 mb-6 line-height-1-7">
                我們相信，健康飲食不必是嚴肅的限制，而是一種充滿選擇、樂趣與回憶的生活方式。
                JiaNice
                希望陪伴每個人在餐桌上找到平衡，既能吃得健康，也能吃得開心，並把這些片刻，化成值得收藏的故事。
              </p>

              <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-4">
                JIANICE 的由來
              </h3>
              <p class="text-body-1 text-grey-darken-1">
                「JiaNice」 的靈感來自 「吃飯（Jia）」與「讚（Nice）」 的結合。
                寓意是：「吃得健康、吃得開心，就是一件很 Nice 的事！」
              </p>
            </div>
          </v-col>

          <v-col class="pl-6" cols="12" md="6">
            <v-card class="overflow-hidden mb-10" elevation="6" rounded="xl">
              <v-img
                class="transition-swing"
                cover
                height="400"
                src="../assets/pexels-craytive-1565982.jpg"
              />
              <v-card-text class="pa-6">
                <h4 class="text-h5 font-weight-bold text-grey-darken-3 mb-3">
                  您的飲食生活夥伴
                </h4>
                <p class="text-body-1 text-grey-darken-1">
                  透過簡單的方法，讓每一次用餐都充滿驚喜與溫暖
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA Section -->
    <section
      v-if="!userStore.isLoggedIn"
      class="text-white"
      style="padding: 10rem 0; background-color: #ff9a1a"
    >
      <v-container class="py-16 text-center">
        <h2 class="text-h3 text-md-h2 font-weight-bold mb-8">
          準備開始您的健康飲食之旅了嗎？
        </h2>
        <p class="text-body-1 mb-8 opacity-90">
          加入我們，讓每一次用餐都成為美好的回憶
        </p>
        <div class="d-flex justify-center flex-wrap ga-4">
          <v-btn
            class="text-orange-darken-2 font-weight-bold"
            color="white"
            elevation="8"
            rounded="pill"
            size="x-large"
            @click="router.push('/register')"
          >
            立即註冊
          </v-btn>
          <v-btn
            color="white"
            rounded="pill"
            size="x-large"
            variant="outlined"
            @click="router.push('/login')"
          >
            登入帳號
          </v-btn>
        </div>
      </v-container>
    </section>

    <!-- 隨機餐廳對話框 -->
    <v-dialog v-model="randomRestaurantDialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="text-h5 d-flex align-center">
          <v-icon class="mr-2" color="orange-darken-2"
            >mdi-dice-multiple</v-icon
          >
          隨機抽餐廳
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-6">
          <!-- 縣市選擇區域 -->
          <div
            v-if="!randomRestaurant && !loadingRandom && !hasError"
            class="mb-6"
          >
            <h4 class="text-h6 mb-4">選擇縣市</h4>
            <v-select
              v-model="selectedCity"
              clearable
              item-title="label"
              item-value="value"
              :items="cities"
              label="請選擇縣市"
              variant="outlined"
            >
              <template #prepend-inner>
                <v-icon>mdi-map-marker</v-icon>
              </template>
            </v-select>
            <p class="text-body-2 text-grey mt-2">
              {{
                selectedCity
                  ? `將從${
                      cities.find((c) => c.value === selectedCity)?.label
                    }中隨機選取`
                  : "將從全台餐廳中隨機選取"
              }}
            </p>
          </div>

          <!-- 載入狀態 -->
          <div v-if="loadingRandom" class="text-center py-8">
            <v-progress-circular
              color="orange-darken-2"
              indeterminate
              size="64"
            />
            <p class="mt-4 text-body-1">
              {{
                selectedCity
                  ? `正在從${
                      cities.find((c) => c.value === selectedCity)?.label
                    }抽選餐廳...`
                  : "正在為您抽選餐廳..."
              }}
            </p>
          </div>

          <!-- 餐廳結果 -->
          <div v-else-if="randomRestaurant" class="text-center">
            <v-avatar class="mb-4" color="orange-lighten-5" size="80">
              <v-icon color="orange-darken-2" size="40">mdi-food</v-icon>
            </v-avatar>

            <h3 class="text-h4 font-weight-bold mb-2">
              {{ randomRestaurant.name }}
            </h3>

            <v-divider class="my-4" />

            <div class="text-left">
              <div class="d-flex align-center mb-3">
                <v-icon class="mr-3" color="primary">mdi-map-marker</v-icon>
                <span class="text-body-1">{{ randomRestaurant.address }}</span>
              </div>

              <div
                v-if="randomRestaurant.phone"
                class="d-flex align-center mb-3"
              >
                <v-icon class="mr-3" color="primary">mdi-phone</v-icon>
                <span class="text-body-1">{{ randomRestaurant.phone }}</span>
              </div>

              <div class="d-flex align-center mb-3">
                <v-icon class="mr-3" color="primary">mdi-city</v-icon>
                <span class="text-body-1">{{ randomRestaurant.city }}</span>
              </div>
            </div>

            <v-divider class="my-4" />

            <p class="text-body-1 text-grey-darken-1 mb-4">
              恭喜！這就是為您抽選的餐廳，希望您用餐愉快！️
            </p>
          </div>

          <!-- 錯誤狀態 -->
          <div v-else-if="hasError" class="text-center py-8">
            <v-icon color="error" size="64">mdi-alert-circle</v-icon>
            <p class="text-body-1 mt-4">無法取得餐廳資料，請稍後再試</p>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            color="orange-darken-2"
            variant="outlined"
            @click="closeDialog"
          >
            關閉
          </v-btn>
          <v-btn
            v-if="randomRestaurant"
            color="orange-darken-2"
            :loading="loadingRandom"
            @click="getRandomRestaurant"
          >
            再抽一次
          </v-btn>
          <v-btn
            v-else
            color="orange-darken-2"
            :loading="loadingRandom"
            @click="getRandomRestaurant"
          >
            開始抽選
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Footer -->
    <v-footer class="bg-grey-darken-4 text-white">
      <v-container class="py-8">
        <v-row class="justify-center">
          <v-col class="text-center" cols="12" md="8">
            <div class="d-flex justify-center mb-6">
              <v-btn
                v-for="icon in socialIcons"
                :key="icon.name"
                class="mx-2"
                color="white"
                :icon="icon.icon"
                size="large"
                variant="text"
              />
            </div>

            <v-divider class="mb-6" color="white" opacity="0.3" />

            <p class="text-body-1 mb-4 opacity-80">
              JiaNice 致力於為您提供最佳的飲食體驗，讓健康與美味並存
            </p>

            <p class="text-caption opacity-60">
              © {{ new Date().getFullYear() }} JiaNice. 版權所有
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSnackbar } from "vuetify-use-dialog";
import VisionCard from "@/components/VisionCard.vue";
import restaurantService from "@/services/restaurant";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const router = useRouter();
const createSnackbar = useSnackbar();

// 隨機餐廳相關狀態
const randomRestaurantDialog = ref(false);
const randomRestaurant = ref(null);
const loadingRandom = ref(false);
const selectedCity = ref("");
const hasError = ref(false); // 新增錯誤狀態

// 縣市選項
const cities = [
  { label: "全部縣市", value: "" },
  { label: "台北市", value: "臺北市" },
  { label: "新北市", value: "新北市" },
  { label: "桃園市", value: "桃園市" },
  { label: "台中市", value: "臺中市" },
  { label: "台南市", value: "臺南市" },
  { label: "高雄市", value: "高雄市" },
  { label: "基隆市", value: "基隆市" },
  { label: "新竹市", value: "新竹市" },
  { label: "嘉義市", value: "嘉義市" },
  { label: "新竹縣", value: "新竹縣" },
  { label: "苗栗縣", value: "苗栗縣" },
  { label: "彰化縣", value: "彰化縣" },
  { label: "南投縣", value: "南投縣" },
  { label: "雲林縣", value: "雲林縣" },
  { label: "嘉義縣", value: "嘉義縣" },
  { label: "屏東縣", value: "屏東縣" },
  { label: "宜蘭縣", value: "宜蘭縣" },
  { label: "花蓮縣", value: "花蓮縣" },
  { label: "台東縣", value: "台東縣" },
  { label: "澎湖縣", value: "澎湖縣" },
  { label: "金門縣", value: "金門縣" },
  { label: "連江縣", value: "連江縣" },
];

const features = ref([
  {
    image: "https://cdn-icons-gif.flaticon.com/11686/11686496.gif",
    icon: "mdi-dice-multiple",
    title: "隨機抽餐廳",
    route: "/restaurant",
    points: [
      "不再為「要吃什麼？」煩惱",
      "透過轉盤或拉霸的方式，讓選擇多一點驚喜",
      "幫助快速決定，也讓用餐更有趣",
    ],
    hover: false,
  },
  {
    image: "https://cdn-icons-gif.flaticon.com/15578/15578646.gif",
    image: "https://cdn-icons-gif.flaticon.com/11779/11779519.gif",

    icon: "mdi-nutrition",
    title: "營養管理",
    route: "/nutrition",
    points: [
      "系統會根據你的紀錄，提醒缺少的營養素",
      "自動推薦對應的食物與餐廳",
      "讓健康飲食變得更直觀、更貼近生活",
    ],
    hover: false,
  },
  {
    image: "https://cdn-icons-gif.flaticon.com/15747/15747266.gif",
    icon: "mdi-newspaper",
    title: "健康新聞",
    route: "/hpanews",
    points: [
      "即時抓取健康署發布的最新健康新聞",
      "內容可靠，避免不正確的飲食資訊",
      "隨時掌握營養與健康的最新趨勢",
    ],
    hover: false,
  },
  {
    image: "https://cdn-icons-gif.flaticon.com/12743/12743782.gif",
    icon: "mdi-book-heart",
    title: "回憶保存",
    route: "/diary",
    points: [
      "不只是記錄「吃了什麼」，還能記錄「和誰、在什麼心情下吃」",
      "支援加密保護，讓某些回憶只屬於你",
      "打造專屬的飲食日記，讓每一次用餐都留下痕跡",
    ],
    hover: false,
  },
]);

const socialIcons = [
  { name: "github", icon: "mdi-github" },
  { name: "instagram", icon: "mdi-instagram" },
  { name: "facebook", icon: "mdi-facebook" },
  { name: "twitter", icon: "mdi-twitter" },
];

const scrollToInfo = () => {
  const el = document.querySelector("#info");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

// 處理功能卡片點擊
const handleFeatureClick = (feature) => {
  if (feature.title === "隨機抽餐廳") {
    openRandomDialog();
  } else {
    navigateToFeature(feature.route);
  }
};

// 打開隨機餐廳對話框
const openRandomDialog = () => {
  randomRestaurantDialog.value = true;
  randomRestaurant.value = null;
  selectedCity.value = "";
  hasError.value = false; // 重置錯誤狀態
};

// 關閉對話框
const closeDialog = () => {
  randomRestaurantDialog.value = false;
  randomRestaurant.value = null;
  selectedCity.value = "";
  hasError.value = false; // 重置錯誤狀態
};

// 隨機選取餐廳
const getRandomRestaurant = async () => {
  loadingRandom.value = true;
  hasError.value = false; // 重置錯誤狀態

  try {
    const params = { count: 1 };
    if (selectedCity.value) {
      params.city = selectedCity.value;
    }

    const { data } = await restaurantService.getRandom(params);

    if (data.success && data.restaurants && data.restaurants.length > 0) {
      randomRestaurant.value = data.restaurants[0];
      hasError.value = false; // 確保成功時清除錯誤狀態
    } else {
      throw new Error("沒有可用的餐廳資料");
    }
  } catch (error) {
    console.error("隨機選取餐廳失敗:", error);
    hasError.value = true; // 設定錯誤狀態
    createSnackbar({
      text: "隨機選取餐廳失敗，請稍後再試",
      snackbarProps: {
        color: "red",
      },
    });
  } finally {
    loadingRandom.value = false;
  }
};

// 修正：使用 useRouter() 來獲取路由實例
const navigateToFeature = (route) => {
  router.push(route);
};
</script>

<style scoped>
/* 新增：讓卡片具有可點擊的視覺效果 */
.feature-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

/* 修復主要功能卡片文字截斷問題 */
.feature-point-text {
  white-space: normal !important;
  line-height: 1.5 !important;
}

/* 讓勾勾圖示顏色更深 */
.feature-check-icon {
  opacity: 1 !important;
}

/* 確保卡片高度自適應 */
.v-card {
  min-width: 300px;
}
</style>

<route lang="yaml">
meta:
  title: "首頁"
  admin: false
</route>
