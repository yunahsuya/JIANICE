<template>
  <v-card
    class="d-flex flex-column h-100"
    elevation="4"
    rounded="lg"
    @click="handleCardClick"
  >
    <!-- 餐廳圖片 -->
    <div class="position-relative">
      <v-img
        class="rounded-t-lg"
        cover
        height="200"
        :src="defaultImage"
      />
      <!-- 收藏按鈕 -->
      <div style="position: absolute; top: 8px; right: 8px; z-index: 10;">
        <v-btn
          :color="isFavorite ? 'red' : 'white'"
          :icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
          size="small"
          style="background: rgba(0,0,0,0.3); backdrop-filter: blur(4px);"
          variant="text"
          @click.stop="toggleFavorite"
        />
      </div>
    </div>

    <!-- 餐廳資訊 -->
    <v-card-text class="pa-5 flex-grow-1 d-flex flex-column">
      <h3 class="text-h6 font-weight-semibold text-grey-darken-1 mb-4 text-truncate">{{ name }}</h3>

      <div class="d-flex align-start mb-3">
        <v-icon class="mr-2 flex-shrink-0" color="primary" icon="mdi-map-marker" size="small" />
        <span class="text-body-2 text-grey-darken-2 text-truncate">{{ address }}</span>
      </div>

      <div v-if="phone" class="d-flex align-start mb-3">
        <v-icon class="mr-2 flex-shrink-0" color="primary" icon="mdi-phone" size="small" />
        <span class="text-body-2 text-grey-darken-2 text-truncate">{{ phone }}</span>
      </div>

      <div v-if="mobile" class="d-flex align-start mb-3">
        <v-icon class="mr-2 flex-shrink-0" color="primary" icon="mdi-cellphone" size="small" />
        <span class="text-body-2 text-grey-darken-2 text-truncate">{{ mobile }}</span>
      </div>

      <div class="d-flex align-start mb-3">
        <v-icon class="mr-2 flex-shrink-0" color="primary" icon="mdi-city" size="small" />
        <span class="text-body-2 text-grey-darken-2 text-truncate">{{ city }}</span>
      </div>
    </v-card-text>

    <!-- 操作按鈕 -->
    <v-card-actions class="pa-4 pt-0 mt-auto">
      <div class="d-flex flex-column flex-md-row w-100">
        <v-btn
          class="font-weight-medium flex-1 mb-3 mr-md-2"
          color="success"
          rounded="lg"
          style="min-width: 160px;"
          variant="outlined"
          @click.stop="showNutritionTips = true"
        >
          <v-icon class="mr-2" icon="mdi-food-apple" />
          營養提示
        </v-btn>

        <v-btn
          class="font-weight-medium flex-1"
          color="primary"
          rounded="lg"
          style="min-width: 160px;"
          variant="elevated"
          @click.stop="openGoogleMaps"
        >
          <v-icon class="mr-2" icon="mdi-map-marker" />
          詳情
        </v-btn>
      </div>
    </v-card-actions>

    <!-- 詳情對話框 -->
    <v-dialog v-model="showDetails" max-width="600" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="text-h5 font-weight-semibold text-grey-darken-1 pa-6 pb-0">
          <v-icon class="mr-3" color="primary" icon="mdi-food" />
          {{ name }}
        </v-card-title>

        <v-card-text class="pa-6">
          <div class="d-flex align-start mb-5">
            <v-icon class="mr-3 mt-1" color="primary" icon="mdi-map-marker" />
            <div class="text-body-1 text-grey-darken-2">
              <strong>地址：</strong>{{ address }}
            </div>
          </div>

          <div v-if="phone" class="d-flex align-start mb-5">
            <v-icon class="mr-3 mt-1" color="primary" icon="mdi-phone" />
            <div class="text-body-1 text-grey-darken-2">
              <strong>電話：</strong>{{ phone }}
            </div>
          </div>

          <div v-if="mobile" class="d-flex align-start mb-5">
            <v-icon class="mr-3 mt-1" color="primary" icon="mdi-cellphone" />
            <div class="text-body-1 text-grey-darken-2">
              <strong>手機：</strong>{{ mobile }}
            </div>
          </div>

          <div class="d-flex align-start">
            <v-icon class="mr-3 mt-1" color="primary" icon="mdi-city" />
            <div class="text-body-1 text-grey-darken-2">
              <strong>縣市：</strong>{{ city }}
            </div>
          </div>

          <div v-if="latitude && longitude" class="d-flex align-start mb-5">
            <v-icon class="mr-3 mt-1" color="primary" icon="mdi-crosshairs-gps" />
            <div class="text-body-1 text-grey-darken-2">
              <strong>座標：</strong>{{ latitude }}, {{ longitude }}
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0 justify-center">
          <v-btn
            color="primary"
            rounded="lg"
            variant="elevated"
            @click="showDetails = false"
          >
            關閉
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 營養提示對話框 -->
    <v-dialog v-model="showNutritionTips" max-width="500" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="text-h5 font-weight-semibold text-success pa-6 pb-0">
          <v-icon class="mr-3" icon="mdi-food-apple" />
          {{ name }} - 營養提示
        </v-card-title>

        <v-card-text class="pa-6">
          <!-- 檢測到的餐廳類型 -->
          <v-alert
            class="mb-4"
            :type="getNutritionAlertType()"
            variant="tonal"
          >
            <template #prepend>
              <v-icon :icon="getNutritionIcon()" />
            </template>
            <strong>檢測到的類型：</strong>{{ getRestaurantType() }}
          </v-alert>

          <!-- 營養建議 -->
          <v-alert
            class="mb-4"
            type="info"
            variant="tonal"
          >
            <template #prepend>
              <v-icon icon="mdi-lightbulb" />
            </template>
            {{ getGeneralNutritionTip() }}
          </v-alert>

          <!-- 營養建議清單 -->
          <v-list class="bg-transparent">
            <v-list-subheader class="text-success font-weight-semibold">
              健康飲食建議
            </v-list-subheader>
            <v-list-item
              v-for="(tip, index) in getNutritionTips()"
              :key="index"
              class="mb-2"
              :prepend-icon="tip.icon"
              :subtitle="tip.description"
              :title="tip.title"
            />
          </v-list>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0 justify-center">
          <v-btn
            color="success"
            rounded="lg"
            variant="elevated"
            @click="showNutritionTips = false"
          >
            了解
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
  import { computed, ref, onMounted } from 'vue'
  import { useSnackbar } from 'vuetify-use-dialog'
  import localFavoriteService from '@/stores/localFavorite'

  const createSnackbar = useSnackbar()

  const props = defineProps({
    restid: String,
    name: String,
    address: String,
    phone: String,
    mobile: String,
    latitude: String,
    longitude: String,
    city: String,
  })

   // 定義 emit 事件
   const emit = defineEmits(['favorite-changed'])
const showDetails = ref(false)
const showNutritionTips = ref(false)
const defaultImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop'
const isFavorite = ref(false)

  // 檢查收藏狀態
  const checkFavoriteStatus = () => {
    isFavorite.value = localFavoriteService.isFavorite(props.restid)
  }

  // 切換收藏狀態
  const toggleFavorite = () => {
    if (isFavorite.value) {
      // 移除收藏
      const result = localFavoriteService.removeFavorite(props.restid)
      if (result.success) {
        isFavorite.value = false
        // 觸發收藏變化事件
        emit('favorite-changed')
        createSnackbar({
          text: result.message,
          snackbarProps: {
            color: 'error',
          },
        })
      }
    } else {
      // 添加收藏
      const restaurant = {
        restid: props.restid,
        name: props.name,
        address: props.address,
        city: props.city,
        phone: props.phone
      }

      const result = localFavoriteService.addFavorite(restaurant)
      if (result.success) {
        isFavorite.value = true
        // 觸發收藏變化事件
        emit('favorite-changed')
        createSnackbar({
          text: result.message,
          snackbarProps: {
            color: 'success',
          },
        })
      } else {
        createSnackbar({
          text: result.message,
          snackbarProps: {
            color: 'warning',
          },
        })
      }
    }
  }

  // 處理卡片點擊事件 - 修改為顯示營養提示
  const handleCardClick = () => {
    showNutritionTips.value = true
  }

  // 打開 Google Maps
  const openGoogleMaps = () => {
    // 優先使用餐廳名稱搜尋，這樣 Google Maps 會顯示餐廳的詳細資訊
    let searchQuery = props.name

    // 如果有地址，加上地址讓搜尋更精確
    if (props.address) {
      searchQuery += ` ${props.address}`
    }

    // 如果有城市資訊，也加上城市
    if (props.city) {
      searchQuery += ` ${props.city}`
    }

    const encodedQuery = encodeURIComponent(searchQuery)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`
    window.open(url, '_blank')
  }

  // 根據餐廳名稱智能判斷餐廳類型
  const getRestaurantType = () => {
    const name = props.name.toLowerCase()

    // 台式料理關鍵字
    if (name.includes('台菜') || name.includes('台式') || name.includes('台灣')
      || name.includes('滷肉飯') || name.includes('牛肉麵') || name.includes('小籠包')
      || name.includes('珍珠奶茶') || name.includes('臭豆腐') || name.includes('蚵仔煎')
      || name.includes('肉圓') || name.includes('雞排') || name.includes('鹽酥雞')
      || name.includes('滷味') || name.includes('麵線') || name.includes('肉粽')
      || name.includes('燒餅') || name.includes('油條') || name.includes('豆漿')) {
      return '台式料理'
    }

    // 日式料理關鍵字
    if (name.includes('壽司') || name.includes('拉麵') || name.includes('天婦羅')
      || name.includes('生魚片') || name.includes('刺身') || name.includes('丼飯')
      || name.includes('烏龍麵') || name.includes('蕎麥麵') || name.includes('味噌湯')
      || name.includes('日式') || name.includes('日本') || name.includes('和食')
      || name.includes('居酒屋') || name.includes('燒肉') || name.includes('炸豬排')
      || name.includes('咖哩') || name.includes('茶泡飯') || name.includes('飯糰')) {
      return '日式料理'
    }

    // 韓式料理關鍵字
    if (name.includes('韓式') || name.includes('韓國') || name.includes('泡菜')
      || name.includes('烤肉') || name.includes('石鍋拌飯') || name.includes('韓式炸雞')
      || name.includes('部隊鍋') || name.includes('辣炒年糕') || name.includes('海鮮煎餅')
      || name.includes('韓式燒肉') || name.includes('韓式料理') || name.includes('韓食')) {
      return '韓式料理'
    }

    // 義式料理關鍵字
    if (name.includes('義式') || name.includes('義大利') || name.includes('義大利麵')
      || name.includes('披薩') || name.includes('pizza') || name.includes('pasta')
      || name.includes('義大利餐廳') || name.includes('義式餐廳') || name.includes('義大利料理')
      || name.includes('燉飯') || name.includes('risotto') || name.includes('提拉米蘇')
      || name.includes('義式咖啡') || name.includes('義式冰淇淋')) {
      return '義式料理'
    }

    // 美式料理關鍵字
    if (name.includes('美式') || name.includes('美國') || name.includes('漢堡')
      || name.includes('burger') || name.includes('hot dog') || name.includes('熱狗')
      || name.includes('牛排') || name.includes('steak') || name.includes('美式餐廳')
      || name.includes('美式料理') || name.includes('炸雞') || name.includes('fried chicken')
      || name.includes('薯條') || name.includes('fries') || name.includes('美式早餐')
      || name.includes('pancake') || name.includes('鬆餅') || name.includes('waffle')
      || name.includes('華夫餅')) {
      return '美式料理'
    }

    // 中式料理關鍵字
    if (name.includes('中式') || name.includes('中國') || name.includes('川菜')
      || name.includes('粵菜') || name.includes('湘菜') || name.includes('魯菜')
      || name.includes('蘇菜') || name.includes('浙菜') || name.includes('閩菜')
      || name.includes('徽菜') || name.includes('火鍋') || name.includes('麻辣')
      || name.includes('小炒') || name.includes('炒菜') || name.includes('蒸菜')
      || name.includes('燒烤') || name.includes('烤鴨') || name.includes('餃子')
      || name.includes('包子') || name.includes('饅頭') || name.includes('麵條')) {
      return '中式料理'
    }

    // 泰式料理關鍵字
    if (name.includes('泰式') || name.includes('泰國') || name.includes('泰式料理')
      || name.includes('泰式餐廳') || name.includes('冬陰功') || name.includes('tom yum')
      || name.includes('泰式炒河粉') || name.includes('pad thai') || name.includes('泰式咖哩')
      || name.includes('泰式奶茶') || name.includes('泰式甜點') || name.includes('泰式沙拉')) {
      return '泰式料理'
    }

    // 越式料理關鍵字
    if (name.includes('越式') || name.includes('越南') || name.includes('越南河粉')
      || name.includes('pho') || name.includes('越式春捲') || name.includes('越式咖啡')
      || name.includes('越式料理') || name.includes('越式餐廳')) {
      return '越式料理'
    }

    // 蔬食料理關鍵字
    if (name.includes('蔬食') || name.includes('素食') || name.includes('素食餐廳')
      || name.includes('蔬食餐廳') || name.includes('vegan') || name.includes('vegetarian')
      || name.includes('有機') || name.includes('健康') || name.includes('養生')
      || name.includes('輕食') || name.includes('沙拉') || name.includes('salad')) {
      return '蔬食料理'
    }

    // 飲料店關鍵字
    if (name.includes('飲料') || name.includes('茶飲') || name.includes('手搖飲')
      || name.includes('奶茶') || name.includes('咖啡') || name.includes('coffee')
      || name.includes('tea') || name.includes('果汁') || name.includes('juice')
      || name.includes('冰沙') || name.includes('smoothie') || name.includes('飲品')) {
      return '飲料店'
    }

    // 早餐店關鍵字
    if (name.includes('早餐') || name.includes('早午餐') || name.includes('brunch')
      || name.includes('蛋餅') || name.includes('三明治') || name.includes('sandwich')
      || name.includes('吐司') || name.includes('toast') || name.includes('蛋包飯')
      || name.includes('早餐店') || name.includes('早午餐店')) {
      return '早餐店'
    }

    // 甜點店關鍵字
    if (name.includes('甜點') || name.includes('蛋糕') || name.includes('cake')
      || name.includes('餅乾') || name.includes('cookie') || name.includes('冰淇淋')
      || name.includes('ice cream') || name.includes('布丁') || name.includes('pudding')
      || name.includes('泡芙') || name.includes('馬卡龍') || name.includes('macaron')
      || name.includes('甜點店') || name.includes('蛋糕店')) {
      return '甜點店'
    }

    // 火鍋店關鍵字
    if (name.includes('火鍋') || name.includes('hot pot') || name.includes('麻辣鍋')
      || name.includes('涮涮鍋') || name.includes('小火鍋') || name.includes('火鍋店')) {
      return '火鍋店'
    }

    // 燒烤店關鍵字
    if (name.includes('燒烤') || name.includes('烤肉') || name.includes('bbq')
      || name.includes('燒肉') || name.includes('烤鴨') || name.includes('燒烤店')) {
      return '燒烤店'
    }

    // 麵食店關鍵字
    if (name.includes('麵') || name.includes('麵食') || name.includes('麵店')
      || name.includes('拉麵') || name.includes('烏龍麵') || name.includes('蕎麥麵')
      || name.includes('義大利麵') || name.includes('pasta') || name.includes('麵條')) {
      return '麵食店'
    }

    // 飯食店關鍵字
    if (name.includes('飯') || name.includes('便當') || name.includes('盒飯')
      || name.includes('丼飯') || name.includes('燉飯') || name.includes('炒飯')
      || name.includes('飯店') || name.includes('便當店')) {
      return '飯食店'
    }

    return '一般餐廳'
  }

  // 根據餐廳類型獲取營養提示
  const getGeneralNutritionTip = () => {
    const type = getRestaurantType()
    const tips = {
      台式料理: '台式料理通常較為油膩，建議選擇清蒸或水煮的菜色，並注意控制份量。',
      日式料理: '日式料理相對健康，建議選擇生魚片、蒸蛋等低熱量選項，避免過多天婦羅。',
      韓式料理: '韓式料理的泡菜富含益生菌，但注意烤肉和炸雞的熱量，建議搭配大量蔬菜。',
      義式料理: '義式料理的麵食熱量較高，建議搭配大量蔬菜，並選擇番茄醬而非奶油醬。',
      美式料理: '美式料理份量較大且熱量高，建議與朋友分享，並選擇烤製而非油炸的選項。',
      中式料理: '中式料理多樣化，建議選擇清蒸、水煮的菜色，避免過多油炸和重口味調味。',
      泰式料理: '泰式料理口味較重，建議選擇清湯類菜色，避免過多椰奶和重口味調味。',
      越式料理: '越式料理相對清淡，建議選擇生春捲、河粉等低熱量選項。',
      蔬食料理: '蔬食料理富含纖維和維生素，是健康的選擇，但注意調味料的用量。',
      飲料店: '選擇無糖或低糖飲料，避免過多熱量攝取，建議選擇茶類或果汁。',
      早餐店: '早餐是一天最重要的一餐，建議選擇全穀類、蛋白質和水果的組合。',
      甜點店: '甜點熱量較高，建議適量食用，並選擇較健康的選項如水果或優格。',
      火鍋店: '火鍋建議選擇清湯底，多搭配蔬菜，避免過多肉類和加工食品。',
      燒烤店: '燒烤食物熱量較高，建議選擇瘦肉，多搭配蔬菜，避免過多調味料。',
      麵食店: '麵食類建議選擇清湯麵，避免重口味的湯底和過多配料。',
      飯食店: '米飯類建議選擇糙米或五穀米，並控制份量，搭配大量蔬菜。',
      一般餐廳: '建議選擇均衡的餐點，注意控制份量和調味料的使用。',
    }

    return tips[type] || '建議選擇均衡的餐點，注意控制份量和調味料的使用。'
  }

  const getNutritionAlertType = () => {
    const type = getRestaurantType()
    const types = {
      蔬食料理: 'success',
      日式料理: 'info',
      早餐店: 'info',
      越式料理: 'info',
      飲料店: 'warning',
      甜點店: 'warning',
      燒烤店: 'warning',
      火鍋店: 'warning',
    }
    return types[type] || 'info'
  }

  const getNutritionIcon = () => {
    const type = getRestaurantType()
    const icons = {
      蔬食料理: 'mdi-leaf',
      日式料理: 'mdi-food-variant',
      早餐店: 'mdi-coffee',
      飲料店: 'mdi-cup-water',
      甜點店: 'mdi-cake-variant',
      火鍋店: 'mdi-pot-steam',
      燒烤店: 'mdi-fire',
      麵食店: 'mdi-food-fork-drink',
      飯食店: 'mdi-food-rice',
      越式料理: 'mdi-food-variant',
      泰式料理: 'mdi-food-variant',
    }
    return icons[type] || 'mdi-food-apple'
  }

  const getNutritionTips = () => {
    const type = getRestaurantType()
    const tips = {
      台式料理: [
        { icon: 'mdi-lightbulb', title: '選擇清蒸菜色', description: '避免油炸和重口味調味' },
        { icon: 'mdi-scale-balance', title: '控制份量', description: '台式料理份量通常較大' },
        { icon: 'mdi-food-apple', title: '搭配蔬菜', description: '增加纖維攝取' },
      ],
      日式料理: [
        { icon: 'mdi-fish', title: '選擇生魚片', description: '低熱量且富含蛋白質' },
        { icon: 'mdi-food-variant', title: '蒸蛋料理', description: '營養豐富且易消化' },
        { icon: 'mdi-food-apple', title: '避免天婦羅', description: '油炸食物熱量較高' },
      ],
      韓式料理: [
        { icon: 'mdi-food-kimchi', title: '泡菜益處', description: '富含益生菌助消化' },
        { icon: 'mdi-food-apple', title: '搭配蔬菜', description: '烤肉時多搭配生菜' },
        { icon: 'mdi-food-chicken', title: '注意炸雞', description: '炸雞熱量較高要適量' },
      ],
      義式料理: [
        { icon: 'mdi-pasta', title: '選擇番茄醬', description: '避免奶油醬的高熱量' },
        { icon: 'mdi-food-salad', title: '搭配沙拉', description: '增加蔬菜攝取' },
        { icon: 'mdi-scale-balance', title: '控制麵量', description: '義大利麵熱量較高' },
      ],
      美式料理: [
        { icon: 'mdi-food-burger', title: '選擇烤製', description: '避免油炸食物' },
        { icon: 'mdi-account-group', title: '分享餐點', description: '美式料理份量較大' },
        { icon: 'mdi-food-salad', title: '搭配沙拉', description: '增加蔬菜攝取' },
      ],
      中式料理: [
        { icon: 'mdi-food-variant', title: '選擇清蒸', description: '避免重口味調味' },
        { icon: 'mdi-food-apple', title: '多樣化選擇', description: '中式料理種類豐富' },
        { icon: 'mdi-scale-balance', title: '控制份量', description: '注意熱量攝取' },
      ],
      泰式料理: [
        { icon: 'mdi-food-variant', title: '選擇清湯', description: '避免過多椰奶' },
        { icon: 'mdi-food-apple', title: '搭配蔬菜', description: '增加纖維攝取' },
        { icon: 'mdi-scale-balance', title: '控制調味', description: '泰式料理口味較重' },
      ],
      越式料理: [
        { icon: 'mdi-food-variant', title: '選擇生春捲', description: '低熱量且營養豐富' },
        { icon: 'mdi-food-apple', title: '河粉選擇', description: '選擇清湯河粉' },
        { icon: 'mdi-scale-balance', title: '清淡口味', description: '越式料理相對清淡' },
      ],
      蔬食料理: [
        { icon: 'mdi-leaf', title: '纖維豐富', description: '富含膳食纖維助消化' },
        { icon: 'mdi-food-apple', title: '維生素多', description: '多種維生素和礦物質' },
        { icon: 'mdi-scale-balance', title: '注意調味', description: '避免過多調味料' },
      ],
      飲料店: [
        { icon: 'mdi-cup-water', title: '選擇無糖', description: '避免過多糖分攝取' },
        { icon: 'mdi-food-apple', title: '選擇茶類', description: '茶類飲料較健康' },
        { icon: 'mdi-scale-balance', title: '控制份量', description: '飲料熱量不容忽視' },
      ],
      早餐店: [
        { icon: 'mdi-coffee', title: '均衡搭配', description: '選擇蛋白質和纖維' },
        { icon: 'mdi-food-apple', title: '全穀類選擇', description: '選擇全麥麵包或燕麥' },
        { icon: 'mdi-scale-balance', title: '適量食用', description: '早餐份量要適中' },
      ],
      甜點店: [
        { icon: 'mdi-cake-variant', title: '適量食用', description: '甜點熱量較高' },
        { icon: 'mdi-food-apple', title: '選擇水果', description: '水果是較健康的甜點' },
        { icon: 'mdi-scale-balance', title: '控制份量', description: '避免過多甜食' },
      ],
      火鍋店: [
        { icon: 'mdi-pot-steam', title: '選擇清湯', description: '避免重口味湯底' },
        { icon: 'mdi-food-apple', title: '多搭配蔬菜', description: '增加纖維攝取' },
        { icon: 'mdi-scale-balance', title: '控制肉類', description: '避免過多加工食品' },
      ],
      燒烤店: [
        { icon: 'mdi-fire', title: '選擇瘦肉', description: '避免過多油脂' },
        { icon: 'mdi-food-apple', title: '搭配蔬菜', description: '增加纖維攝取' },
        { icon: 'mdi-scale-balance', title: '控制調味', description: '避免過多調味料' },
      ],
      麵食店: [
        { icon: 'mdi-food-fork-drink', title: '選擇清湯', description: '避免重口味湯底' },
        { icon: 'mdi-food-apple', title: '搭配蔬菜', description: '增加營養均衡' },
        { icon: 'mdi-scale-balance', title: '控制份量', description: '麵食熱量較高' },
      ],
      飯食店: [
        { icon: 'mdi-food-rice', title: '選擇糙米', description: '糙米營養更豐富' },
        { icon: 'mdi-food-apple', title: '搭配蔬菜', description: '增加纖維攝取' },
        { icon: 'mdi-scale-balance', title: '控制份量', description: '米飯熱量較高' },
      ],
    }

    return tips[type] || [
      { icon: 'mdi-food-apple', title: '均衡飲食', description: '選擇多樣化的食物' },
      { icon: 'mdi-scale-balance', title: '控制份量', description: '注意熱量攝取' },
      { icon: 'mdi-water', title: '多喝水', description: '保持身體水分' },
    ]
  }

  // 組件掛載時檢查收藏狀態
  onMounted(() => {
    checkFavoriteStatus()
  })
</script>

<style scoped>
.restaurant-card:hover {
  transform: translateY(-8px);
  transition: all 0.3s ease;
}
</style>
