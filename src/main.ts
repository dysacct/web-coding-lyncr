import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setAuthRouter } from './composables/useAuth'

const app = createApp(App)
app.use(router)
setAuthRouter(router)
app.mount('#app')
