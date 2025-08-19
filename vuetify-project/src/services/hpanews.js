import apiService from './api'

export default {
  // 取得所有新聞
  getAllNews () {
    return apiService.api.get('/hpanews')
  },

  // 根據關鍵字搜尋新聞
  searchNewsByKeyword (keyword) {
    return apiService.api.get('/hpanews/search/keyword', {
      params: { keyword }
    })
  },

  // 根據日期範圍搜尋新聞
  searchNewsByDate (startdate, enddate) {
    return apiService.api.get('/hpanews/search/date', {
      params: { startdate, enddate }
    })
  },

  // 綜合搜尋
  searchNews (keyword, startdate, enddate) {
    const params = {}
    if (keyword) params.keyword = keyword
    if (startdate) params.startdate = startdate
    if (enddate) params.enddate = enddate

    return apiService.api.get('/hpanews/search', { params })
  },

  // 取得最新新聞
  getLatestNews () {
    return apiService.api.get('/hpanews/latest')
  }
}
