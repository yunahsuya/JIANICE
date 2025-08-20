// 全域快取服務 - 靜默版本
class CacheService {
  constructor () {
    this.cache = new Map()
    this.defaultTTL = 2 * 24 * 60 * 60 * 1000 // 48小時 (2天)
  }

  // 設定快取
  set (key, data, ttl = this.defaultTTL) {
    const timestamp = Date.now()
    this.cache.set(key, {
      data,
      timestamp,
      ttl,
    })
  }

  // 取得快取
  get (key) {
    const item = this.cache.get(key)
    if (!item) {
      return null
    }

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  // 檢查快取是否存在且有效
  has (key) {
    const item = this.cache.get(key)
    if (!item) {
      return false
    }

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  // 清除特定快取
  delete (key) {
    this.cache.delete(key)
  }

  // 清除所有快取
  clear () {
    this.cache.clear()
  }

  // 取得快取統計
  getStats () {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

// 創建全域快取實例
const cacheService = new CacheService()

export default cacheService
