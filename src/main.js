import { createApp } from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
import store from './store'
import 'ant-design-vue/dist/antd.css'
import antd from 'ant-design-vue'
createApp(App).use(store).use(router).use(antd).mount('#app')
