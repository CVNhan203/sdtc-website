import { createApp } from 'vue'
import App from './App.vue'
<<<<<<< HEAD

createApp(App).mount('#app')
=======
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
>>>>>>> origin/huynhFE
