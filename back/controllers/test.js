// import { StatusCodes } from 'http-status-codes'
// import axios from 'axios'

// // 國民健康署API基礎URL
// const HPA_API_BASE_URL = 'https://www.hpa.gov.tw/wf'

// // 建立axios實例
// const hpaApi = axios.create({
//   baseURL: HPA_API_BASE_URL,
//   timeout: 15000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// })

// // 從國民健康署API取得新聞資料
// export const fetchFromHpaApi = async (params = {}) => {
//   try {
//     const response = await hpaApi.get('/newsapi.ashx', { params })
//     return response.data
//   } catch (error) {
//     console.error('國民健康署API請求失敗:', error)
//     throw new Error('無法從國民健康署取得資料')
//   }
// }

// // 取得所有新聞
// export const getAllNews = async (req, res) => {
//   try {
//     const data = await fetchFromHpaApi()
    
//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: '取得國民健康署新聞成功',
//       data
//     })
//   } catch (error) {
//     console.error('取得國民健康署新聞失敗:', error)
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: error.message || '取得新聞失敗'
//     })
//   }
// }

// // 根據關鍵字搜尋新聞
// export const searchNewsByKeyword = async (req, res) => {
//   try {
//     const { keyword } = req.query
    
//     if (!keyword) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: '請提供搜尋關鍵字'
//       })
//     }

//     const data = await fetchFromHpaApi({ keyword })
    
//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: '搜尋國民健康署新聞成功',
//       data
//     })
//   } catch (error) {
//     console.error('搜尋國民健康署新聞失敗:', error)
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: error.message || '搜尋新聞失敗'
//     })
//   }
// }

// // 根據日期範圍搜尋新聞
// export const searchNewsByDate = async (req, res) => {
//   try {
//     const { startdate, enddate } = req.query
    
//     const params = {}
//     if (startdate) params.startdate = startdate
//     if (enddate) params.enddate = enddate

//     const data = await fetchFromHpaApi(params)
    
//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: '根據日期搜尋國民健康署新聞成功',
//       data
//     })
//   } catch (error) {
//     console.error('根據日期搜尋國民健康署新聞失敗:', error)
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: error.message || '搜尋新聞失敗'
//     })
//   }
// }

// // 綜合搜尋（關鍵字 + 日期）
// export const searchNews = async (req, res) => {
//   try {
//     const { keyword, startdate, enddate } = req.query
    
//     const params = {}
//     if (keyword) params.keyword = keyword
//     if (startdate) params.startdate = startdate
//     if (enddate) params.enddate = enddate

//     const data = await fetchFromHpaApi(params)
    
//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: '搜尋國民健康署新聞成功',
//       data
//     })
//   } catch (error) {
//     console.error('搜尋國民健康署新聞失敗:', error)
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: error.message || '搜尋新聞失敗'
//     })
//   }
// }

// // 取得最新新聞（最近30天）
// export const getLatestNews = async (req, res) => {
//   try {
//     const today = new Date()
//     const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))
    
//     const startdate = thirtyDaysAgo.toLocaleDateString('zh-TW', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit'
//     }).replace(/\//g, '/')
    
//     const data = await fetchFromHpaApi({ startdate })
    
//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: '取得最新國民健康署新聞成功',
//       data
//     })
//   } catch (error) {
//     console.error('取得最新國民健康署新聞失敗:', error)
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: error.message || '取得新聞失敗'
//     })
//   }
// }