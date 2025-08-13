// 新聞 api
import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    // 標題
    title: {
      type: String,
      required: [true, '標題是必填的'],
      trim: true,
    },

    // 內容
    content: {
      type: String,
      required: [true, '內容是必填的'],
      trim: true,
    },

    // 連結
    url: {
      type: String,
      required: [true, '連結是必填的'],
      trim: true,
    },

    // 日期
    date: {
      type: Date,
      required: [true, '日期是必填的'],
    },

    // 分類 (去推薦新聞)
    category: {
      type: [String],
      enum: {
        values: ['癌症', '菸', '飲食', '篩檢', '三高', '二手菸 ', '熱傷害', '防治', '健康', '其他'],
        message: '請選擇有效的分類',
      },
    },

    
  },
  { versionKey: false, timestamps: true },
)

export default model('news', schema)
