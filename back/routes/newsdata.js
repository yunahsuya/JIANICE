// 從 Express 這個套件裡面拿到 Router 這個功能
// Router 就像一個「小導覽員」，幫你整理一群相關的路由（API 路徑）
import { Router } from 'express'

// 把 auth.js 這個中間件模組所有東西都抓進來，放到 auth 這個物件裡
// 這些是驗證使用者身份和權限的「守門員」，確保只有有權限的人才能使用某些 API
import * as auth from '../middlewares/auth.js'

// 把負責「處理新聞資料邏輯」的 controller 函式全部抓進 newsdata
// 這裡面的函式才是真正「幹活兒」，像你之前寫的 getId、update、getAll 等
import * as newsdata from '../controllers/newsdata.js'

// 引入處理檔案上傳的中間件（通常是基於 multer 實作）
// 負責接收前端送來的檔案，並且處理存放路徑
import upload from '../middlewares/upload.js'

// Router() 是建立一個路由器，專門放新聞相關的 API 路徑 (這樣路由清楚分門別類，維護起來更方便)
const router = Router()

// 每個 router.方法(路徑, 中間件..., handler) 是對應不同的 API 路由
// newsdata.xxx 是真正執行功能的 controller 函式
// 當前端用 GET 方法請求 /（新聞的根路徑，例如 /news）時，呼叫 newsdata.get 這個 controller 來處理
// newsdata.get 會執行你定義的邏輯（像是回傳「有上架的新聞」）
router.get('/', newsdata.get)

// auth.token 跟 auth.admin 是認證中間件，確保只有有權限的人才能呼叫該 API
//

/* 
  前端用 GET 方法請求 /all（比如 /news/all）時，
  
  先執行 auth.token：確認使用者有登入（有沒有 token）。

  再執行 auth.admin：確認使用者是管理員身分。

  最後才執行 newsdata.getAll：回傳所有新聞（不限定有上架或沒上架）。

  這樣確保只有有權限的人才能看到全部資料。
*/
router.get('/all', auth.token, auth.admin, newsdata.getAll)

/* 
  前端用 GET 方法請求 / 後面帶一個 ID（例如 /news/123abc），

  就會觸發 newsdata.getId 這個函式，去撈那筆指定 ID 的新聞。
*/
router.get('/:id', newsdata.getId)

// upload 是處理檔案上傳的中間件（通常用 multer）
/* 
  用 POST 方法請求 /news（新增新聞）。

  流程：先驗證 auth.token → 確認管理員 auth.admin → 允許檔案上傳 upload → 最後執行 newsdata.create 新增新聞。

  這樣才能讓系統安全地新增帶圖片的新聞
*/
router.post('/', auth.token, auth.admin, upload, newsdata.create)

/* 
  用 PATCH 方法請求 /news/:id（更新指定新聞）。

  同樣先做身份與權限驗證，再處理檔案上傳，最後呼叫 newsdata.update 去更新該筆新聞
*/
router.patch('/:id', auth.token, auth.admin, upload, newsdata.update)

// 把這個「新聞路由器」物件匯出給別的地方使用（通常會被主程式 app.js 引入，變成整個服務的一部分）
export default router

/* 
  這裡的中間件（auth.token、auth.admin、upload）其實就是串在請求流程裡的「關卡」，每個請求都會按照順序過關。

  如果中間件沒通過（例如沒 token、不是 admin），後面的 controller 就不會被執行，直接回錯誤給前端
*/
