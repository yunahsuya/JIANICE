// Utilities

// createPinia：建立 Pinia 狀態管理 的核心實例（類似 Vuex，但更輕量）
import { createPinia } from 'pinia'

// pinia-plugin-persistedstate：讓 Pinia 的資料可以 永久保存 到 localStorage 或 sessionStorage，即使重新整理網頁，資料也不會消失
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

/*
  建立 Pinia 實例
  const pinia = createPinia()

  這相當於蓋了一個 倉庫，所有全域的狀態（例如使用者登入資訊、購物車內容）都會放進來
*/
const pinia = createPinia()

/*
  安裝插件
  pinia.use(piniaPluginPersistedstate)

  讓 Pinia 的倉庫具備「自動保存」功能

  沒安裝的話，資料在重新整理後會重置；安裝後，它會自動同步到瀏覽器的儲存空間
*/
pinia.use(piniaPluginPersistedstate)

/*
  匯出給 Vue 用
  export default pinia

  把這個「已經具備自動保存功能的倉庫」交出去

  在 main.js 裡就可以用 app.use(pinia) 把它安裝到整個 Vue 應用
*/
export default pinia
