import apiService from './api'

export default {
  // 今年全部
  getAllThisYear () {
    return apiService.api.get('/hpanews')
  },
  // 今年 + 關鍵字（建議用這支）
  searchThisYear (keyword) {
    const params = {}
    if (keyword) {
      params.keyword = keyword
    }
    return apiService.api.get('/hpanews/search', { params })
  },
  // 今年（別名）
  getLatestThisYear () {
    return apiService.api.get('/hpanews/latest')
  },
}
