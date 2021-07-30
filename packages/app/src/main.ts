import '@/assets/css/tailwind.css'

import { createApp, h } from 'vue'

import App from '@/App.vue'

import router from './router'

const app = createApp({ render: () => h(App) })

app.use(router)

app.config.performance = true
app.mount('#app')
