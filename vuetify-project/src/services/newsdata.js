import apiService from './api'

export default {
  create (data) {
    return apiService.apiAuth.post('/newsdata', data)
  },

  getAll () {
    return apiService.apiAuth.get('/newsdata/all')
  },

  get () {
    return apiService.api.get('/newsdata')
  },

  getId (id) {
    return apiService.api.get('/newsdata/' + id)
  },

  update (id, data) {
    return apiService.apiAuth.patch(`/newsdata/${id}`, data)
  },
}
