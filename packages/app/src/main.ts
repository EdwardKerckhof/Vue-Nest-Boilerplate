import '@/assets/css/tailwind.css'

import { createPinia } from 'pinia'
import { createApp, h } from 'vue'

import App from '@/App.vue'

import filters from './helpers/filters'
import router from './router'

const app = createApp({ render: () => h(App) })

app.use(router)
app.use(createPinia())

app.config.performance = true
app.config.globalProperties.$filters = filters
app.mount('#app')
