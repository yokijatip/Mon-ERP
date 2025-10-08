// main.ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'   // pastikan path sesuai dan gunakan default export
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App)

// urutan pemanggilan plugin
app.use(createPinia())
app.use(router)
app.component('ApexChart', VueApexCharts)

app.mount('#app')
