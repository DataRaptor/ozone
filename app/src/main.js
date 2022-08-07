import { createApp } from "vue"
import App from "./App.vue"
import vuetify from "./plugins/vuetify"
import Toast from "vue-toastification"
import { loadFonts } from "./plugins/webfontloader"
import { createPinia } from "pinia"
import { router } from "./router"

import "vue-toastification/dist/index.css"
import "./main.css"

loadFonts()

const pinia = createPinia()
const app = createApp(App)

app.use(vuetify).use(pinia).use(router).use(Toast, {}).mount("#app")
