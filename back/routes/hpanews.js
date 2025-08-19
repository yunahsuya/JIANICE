import { Router } from 'express'
import * as hpaNews from '../controllers/hpaNews.js'

const router = Router()

// 取得所有新聞
router.get('/', hpaNews.getAllNews)

// 根據關鍵字搜尋新聞
router.get('/search/keyword', hpaNews.searchNewsByKeyword)

// 根據日期範圍搜尋新聞
router.get('/search/date', hpaNews.searchNewsByDate)

// 綜合搜尋
router.get('/search', hpaNews.searchNews)

// 取得最新新聞
router.get('/latest', hpaNews.getLatestNews)

export default router