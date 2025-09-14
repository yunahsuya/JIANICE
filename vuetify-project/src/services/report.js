import apiService from './api'

export default {
  // 提交回報訊息
  async submit(data) {
    const response = await apiService.api.post('/report', data)
    return response.data
  }
}
