import User from '../models/user.js'  // 改為引入 User 模型
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'

// 新增日記
export const create = async (req, res) => {
  try {
    // 除錯：檢查 req.user 是否存在
    console.log('create diary - req.user:', req.user)
    console.log('create diary - req.user._id:', req.user?._id)
    
    if (!req.user || !req.user._id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: '用戶未登入或登入資訊無效',
      })
    }

    // 處理多檔案上傳，將所有圖片 URL 存入陣列
    const imageUrls = req.files ? req.files.map((file) => file.path) : []

    // 準備新的日記資料
    const newDiary = {
      date: req.body.date,
      title: req.body.title || '',  // 確保標題不為 undefined
      description: req.body.description,
      image: imageUrls,
      sell: req.body.sell,
      category: req.body.category,
    }
    console.log('create diary - newDiary:', newDiary)

    // 更新用戶的日記陣列
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { diary: newDiary } },
      { new: true }
    )

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '用戶不存在',
      })
    }

    console.log('create diary - updated user:', user)
    
    // 取得剛新增的日記（陣列中的最後一個）
    const createdDiary = user.diary[user.diary.length - 1]
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: '成功建立日記',
      diary: createdDiary,
    })
  } catch (error) {
    console.log('controllers/diary.js create - error:')
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

// 取得所有日記
export const getAll = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '用戶不存在',
      })
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: '日記列表取得成功',
      diarys: user.diary || [],
    })
  } catch (error) {
    console.log('controllers/diary.js getAll')
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}

// 日記取得 - 只取得當前用戶的公開日記
export const get = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '用戶不存在',
      })
    }

    // 過濾出公開的日記
    const publicDiarys = (user.diary || []).filter(diary => diary.sell === true)

    res.status(StatusCodes.OK).json({
      success: true,
      message: '日記取得成功',
      diarys: publicDiarys,
    })
  } catch (error) {
    console.log('controllers/diary.js get')
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}

// 更新日記
export const update = async (req, res) => {
  try {
    console.log('update diary - req.params.id:', req.params.id)
    console.log('update diary - req.body:', req.body)
    
    if (!validator.isMongoId(req.params.id)) {
      throw new Error('DIARY ID')
    }

    // 處理多檔案上傳
    const imageUrls = req.files ? req.files.map((file) => file.path) : []

    // 準備更新資料
    const updateData = { ...req.body }

    // 確保 sell 欄位被正確處理為布林值
    if (req.body.sell !== undefined) {
      updateData.sell = req.body.sell === 'true' || req.body.sell === true
      console.log('update diary - sell value:', req.body.sell, 'converted to:', updateData.sell)
    }

    // 處理圖片更新邏輯
    let finalImages = []

    // 如果有現有圖片，解析並加入
    if (req.body.existingImages) {
      try {
        const existingImages = JSON.parse(req.body.existingImages)
        finalImages = [...existingImages]
      } catch (error) {
        console.error('解析現有圖片失敗:', error)
      }
    }

    // 如果有新上傳的圖片，加入
    if (imageUrls.length > 0) {
      finalImages = [...finalImages, ...imageUrls]
    }

    // 只有在有圖片時才更新 image 欄位
    if (finalImages.length > 0) {
      updateData.image = finalImages
    }

    // 使用 $set 操作符來更新特定的日記項目，避免觸發整個陣列的驗證
    const result = await User.updateOne(
      { 
        _id: req.user._id,
        'diary._id': req.params.id 
      },
      { 
        $set: { 
          'diary.$.date': updateData.date,
          'diary.$.title': updateData.title,
          'diary.$.description': updateData.description,
          'diary.$.category': updateData.category,
          'diary.$.sell': updateData.sell
        }
      }
    )

    // 如果有圖片要更新
    if (finalImages.length > 0) {
      await User.updateOne(
        { 
          _id: req.user._id,
          'diary._id': req.params.id 
        },
        { 
          $set: { 
            'diary.$.image': finalImages
          }
        }
      )
    }

    if (result.matchedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '用戶或日記不存在',
      })
    }

    if (result.modifiedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '日記不存在',
      })
    }

    // 取得更新後的日記資料
    const user = await User.findById(req.user._id)
    const updatedDiary = user.diary.find(diary => diary._id.toString() === req.params.id)

    res.status(StatusCodes.OK).json({
      success: true,
      message: '日記更新成功',
      diary: updatedDiary,
    })
  } catch (error) {
    console.log('controllers/diary.js update - error:')
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}

export const getId = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) {
      throw new Error('DIARY ID')
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '用戶不存在',
      })
    }

    const diary = user.diary.find(diary => diary._id.toString() === req.params.id)
    if (!diary) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '日記不存在',
      })
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: '日記取得成功',
      diary,
    })
  } catch (error) {
    console.log('controllers/diary.js getId')
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}

// 刪除日記
export const deleteDiary = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) {
      throw new Error('DIARY ID')
    }

    // 使用 updateOne 和 $pull 來刪除日記 - 這是最安全的方法
    const result = await User.updateOne(
      { _id: req.user._id },
      { $pull: { diary: { _id: req.params.id } } }
    )

    if (result.matchedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '用戶不存在',
      })
    }

    if (result.modifiedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '日記不存在',
      })
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: '日記刪除成功',
    })
  } catch (error) {
    console.log('controllers/diary.js deleteDiary')
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}