import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Gallery from '../views/Gallery.vue'
import Media from '../views/Media.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/gallery', name: 'Gallery', component: Gallery },
  { path: '/media', name: 'Media', component: Media },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
