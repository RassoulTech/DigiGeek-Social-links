import { createRouter, createWebHistory } from 'vue-router'
import QRPage from '../components/QRModal.vue'
import LinksPage from '../components/LinkCard.vue'

const routes = [
  { path: '/', redirect: '/qr' },
  { path: '/qr', component: QRPage },
  { path: '/links', component: LinksPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router