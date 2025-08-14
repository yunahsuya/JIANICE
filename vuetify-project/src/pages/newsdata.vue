<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <!-- <h1 class="text-center">健康新聞</h1> -->

        <v-text-field
          v-model="search"
          flat
          hide-details
          placeholder="搜尋健康新聞"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          @update:model-value="page = 1"
        />

        <!-- 多選 => multiple (如果選到別類，再回來會不見)-->
        <v-chip-group
          v-model="selectedCategory"
          mandatory
          @update:model-value="page = 1"
        >

          <v-chip
            filter
            text="全部"
            :value="''"
            variant="outlined"
          />

          <v-chip
            v-for="option in categoryOptions"
            :key="option"
            filter
            :text="option"
            :value="option"
            variant="outlined"
          />

          <v-spacer />

          <v-menu>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                append-icon="mdi-chevron-down"
                :ripple="false"
                variant="outlined"
              >
                {{ sortOptions[selectedSort].text }}
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="(option, i) in sortOptions"
                :key="option.text"
                @click="selectedSort = i; page = 1"
              >
                {{ option.text }}
              </v-list-item>
            </v-list>
          </v-menu>
        </v-chip-group>
      </v-col>

      <v-col
        v-for="newsdata in currentPageNewsdatas"
        :key="newsdata._id"
        cols="12"
        lg="9"
        md="6"
      >

        <NewsdataCard v-bind="newsdata" />

      </v-col>

      <v-col cols="12">
        <v-pagination
          v-model="page"
          circle
          :length="totalPages"
          :total-visible="5"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useSnackbar } from 'vuetify-use-dialog'

  import NewsdataCard from '@/components/NewsdataCard.vue'

  import newsdataService from '@/services/newsdata'

  const createSnackbar = useSnackbar()

  const newsdatas = ref([])

  const filteredNewsdatas = computed(() => {
    return newsdatas.value.filter(newsdata => {
      const matchesSearch = newsdata.title.toLowerCase().includes(search.value.toLowerCase())
      const matchesCategory = selectedCategory.value
        ? (Array.isArray(newsdata.category) ? newsdata.category.includes(selectedCategory.value) : newsdata.category === selectedCategory.value)
        : true
      return matchesSearch && matchesCategory
    }).sort((a, b) => {
      const sortOption = sortOptions[selectedSort.value]

      if (sortOption.key === 'createdAt' || sortOption.key === 'updatedAt') {
        return sortOption.direction * (new Date(a[sortOption.key]) - new Date(b[sortOption.key]))
      }
      return sortOption.direction * (a[sortOption.key] > b[sortOption.key] ? 1 : -1)
    })
  })

  const ITEMS_PER_PAGE = 10
  const page = ref(1)
  const totalPages = computed(() => {
    return Math.ceil(filteredNewsdatas.value.length / ITEMS_PER_PAGE)
  })

  const currentPageNewsdatas = computed(() => {
    return filteredNewsdatas.value.slice((page.value - 1) * ITEMS_PER_PAGE, page.value * ITEMS_PER_PAGE)
  })
  const search = ref('')

  const selectedCategory = ref('')
  const categoryOptions = ['癌症', '菸', '飲食', '篩檢', '三高', '二手菸', '熱傷害', '防治', '健康', '其他']

  const selectedSort = ref(0)

  const sortOptions = [
    { text: '標題', key: 'title', direction: 1 },
    // { text: '最新發佈', key: '發布日期', direction: -1 },
    // { text: '最舊發佈', key: '發布日期', direction: 1 },

  ]

  const getNewsdatas = async () => {
    try {
      const { data } = await newsdataService.get()
      console.log(data)

      newsdatas.value = data.newsdatas
    } catch (error) {
      console.error('Error fetching newsdatas', error)
      createSnackbar({
        text: '無法載入健康新聞資料',

        snackbarProps: {
          color: 'red',
        },
      })
    }
  }
  getNewsdatas()
  // getNewsdatas().then(res => console.log(res))

</script>

<route lang="yaml">
  meta:
    # 標題
    title: '健康新聞'
    # 只能在登入的情況下看
    login: ''
    # 不是管理員也能看
    admin: false
</route>
