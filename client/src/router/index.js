import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/MusicHall'
    },
    {
      path: '/MusicHall',
      name: 'MusicHall',
      component: () => import('@/components/MusicHall')
    },
    {
      path: '/User',
      name: 'User',
      component: () => import('@/components/User')
    },
    {
      path: '/Find',
      name: 'Find',
      component: () => import('@/components/Find')
    },
    {
      path: '/singer',
      name: 'singer',
      component: () => import('@/components/Singer'),
      children: [
        {
          path: ':id',
          component: () => import('@/components/SingerItem')
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: () => import('@/components/Rank')
    },
    {
      path: '/Login',
      name: 'Login',
      component: () => import('@/components/login')
    },
    {
      path: '/Register',
      name: 'Register',
      component: () => import('@/components/register')
    }
  ]
})
