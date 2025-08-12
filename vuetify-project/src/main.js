/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

/*
  main.js 是整個 Vue 專案的進入點（入口檔），它會：

  啟動（Bootstraps）Vuetify（UI 套件）和其他插件（plugins）
  最後把 App.vue 掛載（mount）到網頁上
*/

// Composables
/*
  從 Vue 框架匯入 createApp 函式

   createApp 的功能：用來建立一個新的 Vue 應用程式實例
 （就像是蓋房子的地基一樣，之後所有元件、插件都會裝在這個 app 裡）
*/
import { createApp } from 'vue'

// Plugins
/*
   從 @/plugins 匯入 registerPlugins

   @ 代表專案的 src 目錄（Webpack / Vite 的 alias）

   registerPlugins 是一個自訂函式，用來一次註冊專案要用的所有插件（例如 Vuetify、Vue Router、Pinia…）
*/
import { registerPlugins } from '@/plugins'

// Components
/*
  匯入 App.vue

  App.vue 是整個專案的根元件（root component）

  所有頁面與元件，最終都會顯示在 App.vue 的 <template> 裡
*/
import App from './App.vue'

// Styles
/*
  匯入全域的 CSS 樣式檔（unfonts.css）

  這通常是字型或 UI 樣式的設定檔

  一旦在 main.js 匯入，整個專案的畫面都會套用這些樣式
*/
import 'unfonts.css'

/*
  const app = createApp(App) => 用 createApp 建立一個 Vue 應用，並把 App.vue 當成根元件

  app 現在就是一個 Vue 應用實例

  之後可以用 app.use(...) 裝插件

  也可以用 app.component(...) 註冊全域元件
*/
const app = createApp(App)

/*
  registerPlugins(app)

  呼叫剛剛匯入的 registerPlugins，並把 app 傳進去

  這步會一次把所有要用的插件（Vuetify、Router…）裝進 app

  好處：集中管理，不用在 main.js 一行一行 app.use(...)
*/
registerPlugins(app)

/*
  app.mount('#app')

  把整個 Vue 應用掛載到 HTML 裡的 <div id="app"></div>

  這一步之後，Vue 就會接管這個 <div>，並顯示 App.vue 的內容

  你的網站正式開始運作 🎉
*/
app.mount('#app')
