// 本地收藏服務 - 使用瀏覽器的 localStorage
export default {
  // 取得收藏清單
  getFavorites() {
    try {
      const favorites = localStorage.getItem('jianice-favorite-restaurants')
      return favorites ? JSON.parse(favorites) : []
    } catch (error) {
      console.error('取得收藏清單失敗:', error)
      return []
    }
  },

  // 添加收藏
  addFavorite(restaurant) {
    try {
      const favorites = this.getFavorites()

      // 檢查是否已經收藏
      const exists = favorites.some(fav => fav.restid === restaurant.restid)
      if (exists) {
        return { success: false, message: '餐廳已經在收藏清單中' }
      }

      // 添加新收藏
      const newFavorite = {
        restid: restaurant.restid,
        name: restaurant.name,
        address: restaurant.address,
        city: restaurant.city,
        phone: restaurant.phone,
        addedAt: new Date().toISOString()
      }

      favorites.push(newFavorite)
      localStorage.setItem('jianice-favorite-restaurants', JSON.stringify(favorites))

      return { success: true, message: '已加入收藏清單' }
    } catch (error) {
      console.error('添加收藏失敗:', error)
      return { success: false, message: '添加收藏失敗' }
    }
  },

  // 移除收藏
  removeFavorite(restaurantId) {
    try {
      const favorites = this.getFavorites()
      const filtered = favorites.filter(fav => fav.restid !== restaurantId)
      localStorage.setItem('jianice-favorite-restaurants', JSON.stringify(filtered))

      return { success: true, message: '已從收藏清單移除' }
    } catch (error) {
      console.error('移除收藏失敗:', error)
      return { success: false, message: '移除收藏失敗' }
    }
  },

  // 檢查是否已收藏
  isFavorite(restaurantId) {
    try {
      const favorites = this.getFavorites()
      return favorites.some(fav => fav.restid === restaurantId)
    } catch (error) {
      console.error('檢查收藏狀態失敗:', error)
      return false
    }
  },

  // 清空收藏清單
  clearFavorites() {
    try {
      localStorage.removeItem('jianice-favorite-restaurants')
      return { success: true, message: '收藏清單已清空' }
    } catch (error) {
      console.error('清空收藏清單失敗:', error)
      return { success: false, message: '清空收藏清單失敗' }
    }
  },

  // 取得收藏數量
  getFavoriteCount() {
    try {
      const favorites = this.getFavorites()
      return favorites.length
    } catch (error) {
      console.error('取得收藏數量失敗:', error)
      return 0
    }
  }
}
