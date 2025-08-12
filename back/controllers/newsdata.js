// models 有甚麼，controllers 就要有甚麼

// 要接政府的 Api，要寫在 controllers

/* 
  主要流程：從資料庫取得全部新聞 → 成功回 200 + 資料；若有錯誤 → log 錯誤並回 500
*/

import Newsdata from '../models/newsdata.js'

import { StatusCodes } from 'http-status-codes'

import validator from 'validator'

// req => 請求
// res => 回覆
export const create = async (req, res) => {
  try {
    const newsdata = await Newsdata.create({
      // 標題
      title: req.body.title,

      // 內文
      content: req.body.content,

      // 連結
      url: req.body.url,

      // 日期
      date: req.body.date,

      // 分類
      category: req.body.category,
    })

    // 回覆
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: '健康新聞建立成功',
      newsdata,
    })
  } catch (error) {
    console.log('controllers/news.js create')
    console.log(error)

    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.errors[key].message,
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器內部錯誤',
      })
    }
  }
}

export const getAll = async (req, res) => {
  try {
    // 抓「全部」新聞資料，不管它的 sell 是 true 還是 false
    // 通常是管理員用的，因為管理員需要看到所有新聞，不管它有沒有上架
    const newsdatas = await Newsdata.find()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '健康新聞列表取得成功',
      newsdatas,
    })
  } catch (error) {
    console.log('controllers/newsdata.js getAll')
    console.error(error)

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}

export const get = async (req, res) => {
  try {
    // 只抓「sell 為 true」的新聞，也就是有上架（對外公開）的新聞
    // 給普通使用者看，因為他們不該看到還沒上架或下架的新聞
    const newsdatas = await Newsdata.find({ sell: true })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '健康新聞列表取得成功',
      newsdatas,
    })
  } catch (error) {
    // controllers/newsdata.js => 錯誤發生在哪個檔案
    // getAll => 檔案中的哪個函式
    console.log('controllers/newsdata.js getAll')
    console.error(error)

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}

// export 讓這個函式可以被其他檔案引用 (通常是路由會用到它)
// async => 非同步函式 (在等待資料庫回應時，伺服器還可以去處理其他人的請求)
/* 
  為什麼要用非同步？
  在程式裡，有些事情會花比較久時間（像是泡麵要 3 分鐘）：

  存取資料庫（例如 await Restaurant.find()）

  讀寫檔案

  請求 API

  圖片上傳

  加密/解密資料
*/
// 接收兩個參數：req（請求物件，代表前端送來的資料）和 res（回應物件，用來回傳結果給前端）
export const update = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) {
      throw new Error('NEWS ID')
    }

    const newsdata = await Newsdata.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: req.file?.path,
      },
      {
        new: true,
        runValidators: true,
      },
      // .orFail(new Error('NEWS NOT FOUND')) → 如果找不到該 ID，會丟出錯誤，訊息是 'NEWS NOT FOUND'
    ).orFail(new Error('NEWS NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '健康新聞更新成功',
      newsdata,
    })
  } catch (error) {
    console.log('controllers/newsdata.js update')
    console.error(error)

    if (error.message === 'NEWS ID') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '無效的健康新聞 ID',
      })
    } else if (error.message === 'NEWS  NOT FOUND') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '健康新聞不存在',
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.errors[key].message,
      })
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器內部錯誤',
      })
    }
  }
}

// 意思：宣告並匯出一個名為 getId 的非同步（async）函式，讓其他檔案可以 import 來使用
/* 
  參數：
  req：request 物件，包含前端傳來的資料（例如 URL、body、params）。
  res：response 物件，用來回傳資料給前端
*/
export const getId = async (req, res) => {
  try {
    // req.params.id => 取得 URL 裡的 :id 參數，例如 /news/66ab1234cdef5678abcd9012 → 取到那串 ID
    // validator.isMongoId(...) => 檢查這個字串是不是合法的 MongoDB ObjectId 格式。 !：反轉結果，意思是「如果不是合法 ID」
    if (!validator.isMongoId(req.params.id)) {
      // throw new Error('NEWS ID') => 直接丟一個錯誤，並帶上錯誤訊息 'NEWS ID'（後面 catch 會用來判斷錯誤類型）
      throw new Error('NEWS ID')
    }

    // Newsdata.findById(req.params.id) => 去資料庫找符合這個 _id 的健康新聞資料
    // .orFail(...) => 如果找不到，就丟出一個錯誤，訊息是 'NEWS NOT FOUND'
    // await => 等待資料庫查詢完成，才往下執行（因為是非同步操作）
    // const newsdata = ... => 把查到的結果存在 newsdata 變數裡
    const newsdata = await Newsdata.findById(req.params.id).orFail(new Error('NEWS NOT FOUND'))

    // res.status(StatusCodes.OK) => 設定 HTTP 狀態碼為 200（成功）
    // .json({...}) => 回傳 JSON 格式的資料給前端
    res.status(StatusCodes.OK).json({
      // success: true => 代表請求成功
      success: true,
      // message => 回傳提示訊息給前端
      message: '健康新聞取得成功',
      // newsdata => 把剛剛查到的新聞資料也送回去
      newsdata,
    })
  } catch (error) {
    // 方便 debug，告訴開發者錯誤發生在 controllers/newsdata.js 的 getId 函式
    console.log('controllers/newsdata.js getId')
    // 印出完整錯誤訊息（包含錯誤堆疊 stack），方便追蹤問題
    console.error(error)

    // 如果錯誤訊息是 'NEWS ID'，就回傳 400（Bad Request），告訴前端「你的 ID 格式錯誤」
    if (error.message === 'NEWS ID') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '無效的健康新聞 ID',
      })
      // 如果錯誤訊息是 'NEWS NOT FOUND'，就回傳 404（Not Found），告訴前端「這筆資料不存在」
    } else if (error.message === 'NEWS NOT FOUND') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '健康新聞不存在',
      })
      // 其他錯誤（不在上面兩種情況內）就回傳 500（Internal Server Error），表示是後端自己的問題
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器內部錯誤',
      })
    }
  }
}

/*   
  整體流程：

  確認 ID 格式正確 → 如果錯誤直接回 400。

  去資料庫找那筆新聞 → 找不到就回 404。

  找到就回 200 並附上資料。

  任何非預期錯誤 → 回 500

*/
