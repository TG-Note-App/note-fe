import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NoteView from '../views/NoteView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import AddNoteView from '../views/AddNoteView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/',
        redirect: '/notes'
    },
    {
      path: '/notes',
      name: 'home',
      component: HomeView
    },
    {
      path: '/notes/:id',
      name: 'note',
      component: NoteView,
      props: true,
      beforeEnter: (to, from, next) => {
        if (to.params.id) {
          next()
        } else {
          next('/notes')
        }
      }
    },
    {
      path: '/notes/new',
      name: 'new-note',
      component: AddNoteView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    },
    {
      path: '/landing',
      name: 'landing',
      component: () => import('../views/LandingView.vue')
    }
  ]
})

export default router 