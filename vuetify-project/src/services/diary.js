import apiService from './api'

export default {
  // 新增一筆日記
  // 用 apiAuth，所以會附帶 token，表示「要登入才能看」的意思
  create (data) {
    return apiService.apiAuth.post('/diary', data)
  },

  // 取得所有日記
  getAll () {
    return apiService.apiAuth.get('/diary/all')
  },

  // 取得目前使用者的日記列表（回憶牆）
  get () {
    return apiService.apiAuth.get('/diary')  // 修改：使用 apiAuth
  },

  // 取得某一篇特定的日記
  getId (id) {
    return apiService.apiAuth.get('/diary/' + id)  // 修改：使用 apiAuth
  },

  // 更新某篇日記
  update (id, data) {
    return apiService.apiAuth.patch(`/diary/${id}`, data)
  },

  // 刪除某篇日記
  delete (id) {
    return apiService.apiAuth.delete(`/diary/${id}`)
  },
}
