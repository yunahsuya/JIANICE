// 新聞 api
/* 
  Schema → 用來定義資料表（collection）的欄位結構、型別、驗證規則。
  model  → 根據 Schema 建立實際可以操作 MongoDB 的 Model。
*/
import { Schema, model } from 'mongoose'

// 建立 Schema
// new Schema({...}) → 定義這個 collection 的欄位
const schema = new Schema(
  {
    // 欄位設定

    // 標題
    title: {
      // type: String → 資料型別是字串
      type: String,
      // required: [true, '標題是必填的'] → 必填欄位，沒填會報錯，錯誤訊息是 '標題是必填的'
      required: [true, '標題是必填的'],

      // trim: true → 自動去掉前後空格
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
      // Date 型別，用來存新聞日期
      type: Date,
      required: [true, '日期是必填的'],
    },

    // 分類 (去推薦新聞)
    category: {
      // type: [String] → 字串陣列，可以放多個分類
      type: [String],
      // enum → 限制只能是指定的值，超出就會報錯。
      enum: {
        values: ['癌症', '菸', '飲食', '篩檢', '三高', '二手菸 ', '熱傷害', '防治', '健康', '其他'],

        // message → 自訂錯誤訊息
        message: '請選擇有效的分類',
      },
    },
  },
  /* 
    第二個參數 { versionKey: false, timestamps: true }：

    versionKey: false → 不生成 __v 欄位（Mongoose 用來紀錄版本）。

    timestamps: true → 自動生成 createdAt 和 updatedAt 欄位
  */
  { versionKey: false, timestamps: true },
)

// 建立，並匯出 Model
/* 
  model('news', schema) → 建立一個名為 news 的資料模型。

  export default → 匯出給其他檔案使用，例如：
  import News from './news.model.js'
  const allNews = await News.find()

  這樣就可以操作 news collection 了
*/
export default model('news', schema)

/* 
  Collection 是什麼？
  想像 MongoDB 是一個超大的資料庫倉庫，每個資料庫裡面會有很多「資料夾」，這些資料夾叫做 collection。

  每個 collection 裡面放的都是「同類型的資料」。

  例如：
  news collection → 放新聞資料
  users collection → 放使用者資料
  restaurants collection → 放餐廳資料

  跟關聯式資料庫裡的「table」很像，但 MongoDB 裡的 collection 裡每筆資料不一定要長得完全一樣

*/

/* 
  enum 是什麼？
  enum 是 enumeration（列舉） 的縮寫。

  它用來限制欄位只能是指定的值之一，不能亂填。

  例如：
  category: {
    type: String,
    enum: ['癌症', '菸', '飲食', '篩檢']
  }

  如果有人想存 category: '音樂'，就會報錯，因為不在列舉範圍裡。
  可以想像成「下拉選單裡可以選的選項」，超出選項就不能存

*/
