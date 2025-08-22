import apiService from './api'

export default {
  // 取得所有餐廳（從環保署API）
  get () {
    return apiService.api.get('/restaurant')
  },

  // 根據城市篩選餐廳
  getByCity (city) {
    return apiService.api.get(`/restaurant/city/${city}`)
  },

  // 搜尋餐廳
  search (params) {
    return apiService.api.get('/restaurant/search', { params })
  }
}
