import { StatusCodes } from 'http-status-codes'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

const HPA_API_BASE_URL = 'https://www.hpa.gov.tw/wf'

const hpaApi = axios.create({
  baseURL: HPA_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// 動態取得當前年份
const getCurrentYear = () => {
  return new Date().getFullYear()
}

// 快取檔案路徑
const CACHE_FILE_PATH = path.join(process.cwd(), 'cache', 'hpa-news-cache.json')

// 快取機制 - 按年份分別快取
const cache = {
  data: {}, // 改為物件，以年份為key
  timestamp: {},
  // 快取時間：48小時（ 2 * 24 * 60 * 60 * 1000 毫秒）
  ttl: 2 * 24 * 60 * 60 * 1000,
}

// 確保快取目錄存在
const ensureCacheDir = () => {
  const cacheDir = path.dirname(CACHE_FILE_PATH)
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true })
  }
}

// 從檔案載入快取
const loadCacheFromFile = () => {
  try {
    ensureCacheDir()
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const cacheData = fs.readFileSync(CACHE_FILE_PATH, 'utf8')
      const parsed = JSON.parse(cacheData)
      cache.data = parsed.data || {}
      cache.timestamp = parsed.timestamp || {}
      console.log('快取已從檔案載入')
    }
  } catch (error) {
    console.log('載入快取檔案失敗，使用空快取:', error.message)
    cache.data = {}
    cache.timestamp = {}
  }
}

// 儲存快取到檔案
const saveCacheToFile = () => {
  try {
    ensureCacheDir()
    const cacheData = {
      data: cache.data,
      timestamp: cache.timestamp,
    }
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cacheData, null, 2))
    console.log('快取已儲存到檔案')
  } catch (error) {
    console.error('儲存快取檔案失敗:', error.message)
  }
}

// 檢查快取是否有效
const isCacheValid = (year) => {
  if (!cache.data[year] || !cache.timestamp[year]) return false
  const now = Date.now()
  return now - cache.timestamp[year] < cache.ttl
}

// 取得快取資料
const getCachedData = (year) => {
  return cache.data[year]
}

// 設定快取資料
const setCachedData = (year, data) => {
  cache.data[year] = data
  cache.timestamp[year] = Date.now()
  console.log(`快取已更新，年份: ${year}，時間:`, new Date().toLocaleString())
  // 儲存到檔案
  saveCacheToFile()
}

// 清除快取
const clearCache = (year = null) => {
  if (year) {
    // 清除特定年份的快取
    delete cache.data[year]
    delete cache.timestamp[year]
    console.log(`快取已清除，年份: ${year}`)
  } else {
    // 清除所有快取
    cache.data = {}
    cache.timestamp = {}
    console.log('所有快取已清除')
  }
  // 更新檔案
  saveCacheToFile()
}

const buildYearRange = (year) => {
  return { startdate: `${year}/1/1`, enddate: `${year}/12/31` }
}

const fetchFromHpaApi = async (params = {}) => {
  try {
    const { data } = await hpaApi.get('/newsapi.ashx', { params })
    return data
  } catch (error) {
    console.error('國民健康署API請求失敗:', error?.message || error)
    throw new Error('無法從國民健康署取得資料')
  }
}

// 檢查日期是否為指定年份
const isTargetYear = (dateStr, targetYear) => {
  if (!dateStr) return false
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return false
    return d.getFullYear() === targetYear
  } catch {
    return false
  }
}

// 過濾指定年份的新聞
const filterByYear = (list, targetYear) => {
  if (!Array.isArray(list)) return []

  console.log(`原始資料筆數: ${list.length}`)
  console.log(`API參數範圍: ${targetYear}/1/1 - ${targetYear}/12/31`)

  const filtered = list.filter((item) => {
    if (!item || typeof item !== 'object') return false

    const publishDate = item['發布日期']
    const modifyDate = item['修改日期']

    // 發布日期必須是指定年份
    const publishedInTargetYear = isTargetYear(publishDate, targetYear)

    // 暫時只檢查發布日期
    const shouldInclude = publishedInTargetYear

    if (shouldInclude) {
      console.log('符合條件:', {
        標題: item['標題'],
        發布日期: publishDate,
        修改日期: modifyDate,
      })
    } else {
      console.log('不符合條件:', {
        標題: item['標題'],
        發布日期: publishDate,
        修改日期: modifyDate,
        發布日期是否目標年份: publishedInTargetYear,
      })
    }

    return shouldInclude
  })

  console.log(`過濾後筆數: ${filtered.length}`)
  return filtered
}

// 取得或更新快取資料
const getOrUpdateCache = async (year) => {
  // 檢查快取是否有效
  if (isCacheValid(year)) {
    console.log(`使用快取資料，年份: ${year}`)
    return getCachedData(year)
  }

  // 快取無效，從API取得新資料
  console.log(`快取已過期，從API取得新資料，年份: ${year}`)
  const range = buildYearRange(year)
  const data = await fetchFromHpaApi(range)
  const filtered = filterByYear(data, year)

  // 更新快取
  setCachedData(year, filtered)

  return filtered
}

// 2025年全部（使用快取）
export const getAllNews = async (_req, res) => {
  try {
    const currentYear = getCurrentYear()
    console.log(`請求API參數，年份: ${currentYear}`)

    const filtered = await getOrUpdateCache(currentYear)

    res.status(StatusCodes.OK).json({
      success: true,
      message: `${currentYear}年新聞（已過濾）`,
      data: filtered,
      year: currentYear,
      cached: isCacheValid(currentYear),
      cacheTimestamp: cache.timestamp[currentYear]
        ? new Date(cache.timestamp[currentYear]).toLocaleString()
        : null,
    })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message || '取得新聞失敗' })
  }
}

// 當年 + 關鍵字（使用快取並過濾）
export const searchNewsByKeyword = async (req, res) => {
  try {
    const { keyword } = req.query
    if (!keyword) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: '請提供 keyword' })
    }

    const currentYear = getCurrentYear()
    const allData = await getOrUpdateCache(currentYear)

    // 在快取資料中搜尋關鍵字
    const filtered = allData.filter(
      (item) => item['標題']?.includes(keyword) || item['內容']?.includes(keyword),
    )

    res.status(StatusCodes.OK).json({
      success: true,
      message: `${currentYear}年關鍵字新聞（已過濾）`,
      data: filtered,
      year: currentYear,
      cached: isCacheValid(currentYear),
      cacheTimestamp: cache.timestamp[currentYear]
        ? new Date(cache.timestamp[currentYear]).toLocaleString()
        : null,
    })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message || '搜尋新聞失敗' })
  }
}

// 當年 + (可選) 關鍵字（使用快取並過濾）
export const searchNews = async (req, res) => {
  try {
    const { keyword } = req.query
    const currentYear = getCurrentYear()

    const allData = await getOrUpdateCache(currentYear)

    // 如果有關鍵字，在快取資料中搜尋
    let filtered = allData
    if (keyword) {
      filtered = allData.filter(
        (item) => item['標題']?.includes(keyword) || item['內容']?.includes(keyword),
      )
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: `${currentYear}年搜尋新聞（已過濾）`,
      data: filtered,
      year: currentYear,
      cached: isCacheValid(currentYear),
      cacheTimestamp: cache.timestamp[currentYear]
        ? new Date(cache.timestamp[currentYear]).toLocaleString()
        : null,
    })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message || '搜尋新聞失敗' })
  }
}

// 當年最新新聞（使用快取）
export const getLatestNews = async (_req, res) => {
  try {
    const currentYear = getCurrentYear()
    const filtered = await getOrUpdateCache(currentYear)

    res.status(StatusCodes.OK).json({
      success: true,
      message: `${currentYear}年最新新聞（已過濾）`,
      data: filtered,
      year: currentYear,
      cached: isCacheValid(currentYear),
      cacheTimestamp: cache.timestamp[currentYear]
        ? new Date(cache.timestamp[currentYear]).toLocaleString()
        : null,
    })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message || '取得新聞失敗' })
  }
}

// 新增：手動清除快取端點（可選）
export const clearCacheEndpoint = async (req, res) => {
  try {
    const { year } = req.query
    clearCache(year) // 如果沒有提供year，會清除所有快取
    res.status(StatusCodes.OK).json({
      success: true,
      message: year ? `${year}年快取已清除` : '所有快取已清除',
    })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message || '清除快取失敗' })
  }
}

// 在伺服器啟動時載入快取
loadCacheFromFile()
