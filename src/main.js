import { createApp } from 'vue'
import pinia from './stores/index'
import '@/assets/scss/default.scss'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.use(pinia)

app.mount('#app')
