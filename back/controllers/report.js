import { StatusCodes } from 'http-status-codes'
import { sendReportEmail, sendConfirmationEmail } from './email.js'

// ... 其餘程式碼保持不變

// 創建回報訊息（只發 email，不存資料庫）
export const create = async (req, res) => {
  try {
    const { name, email, category, subject, message } = req.body

    // 基本驗證
    if (!name || !email || !category || !subject || !message) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '所有欄位都是必填的',
      })
    }

    // 驗證 email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '請輸入有效的電子信箱格式',
      })
    }

    // 驗證類別
    const validCategories = ['technical', 'feature', 'content', 'account', 'other']
    if (!validCategories.includes(category)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '無效的回報類別',
      })
    }

    const reportData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category,
      subject: subject.trim(),
      message: message.trim(),
    }

    // 發送 email 給管理員
    await sendReportEmail(reportData)

    // 發送確認 email 給用戶
    await sendConfirmationEmail(reportData)

    res.status(StatusCodes.OK).json({
      success: true,
      message: '回報訊息已成功提交！我們已發送確認 email 給您，並會盡快處理您的問題。',
    })
  } catch (error) {
    console.error('處理回報訊息失敗:', error)

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發送失敗，請稍後再試或直接聯繫我們',
    })
  }
}
