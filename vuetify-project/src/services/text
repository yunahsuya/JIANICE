/*
  匯入 apiService
  import apiService from './api'

  apiService 是預先設定好的 axios 物件（或類似工具）
  負責幫你送 HTTP 請求給後端

  裡面可能分成兩種：apiAuth（需要驗證的請求）和 api（不需要驗證的）
*/
import apiService from './api'

/*
  export default 物件
  這個物件裡包了多個方法，方便其他地方用
*/
export default {

  /*
    create(data) {
    return apiService.apiAuth.post('/restaurant', data)

    送一個 POST 請求到 /restaurant
    用來「新增一間餐廳」
    data 是要新增的餐廳資料
    使用 apiAuth，代表這個請求需要帶驗證（token）
}
  */
  create (data) {
    return apiService.apiAuth.post('/restaurant', data)
  },

  /*
    getAll() {
    return apiService.apiAuth.get('/restaurant/all')

    送 GET 請求到 /restaurant/all
    用來「取得所有餐廳的完整資料」
    同樣需要驗證（通常是管理員權限）
    }
  */
  getAll () {
    return apiService.apiAuth.get('/restaurant/all')
  },

  /*
    get() {
      return apiService.api.get('/restaurant')
    }

    送 GET 請求到 /restaurant
    用來「取得餐廳列表」
    不一定需要驗證（給一般使用者看）
  */
  get () {
    return apiService.api.get('/restaurant')
  },

  /*
    getId (id) {
      return apiService.api.get('/restaurant/' + id)
    }

    送 GET 請求到 /restaurant/某個id
    用來「取得特定餐廳的詳細資料」
    需要帶上餐廳的 id
  */
  getId (id) {
    return apiService.api.get('/restaurant/' + id)
  },

  /*
    update(id, data) {
      return apiService.apiAuth.patch(`/restaurant/${id}`, data)
    }

    送 PATCH 請求到 /restaurant/某個id
    用來「更新特定餐廳的資料」
    需要帶餐廳 id 和新的資料
    需要驗證（管理員權限）
  */
  update (id, data) {
    return apiService.apiAuth.patch(`/restaurant/${id}`, data)
  },
}
