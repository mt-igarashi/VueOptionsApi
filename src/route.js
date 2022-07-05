import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from './components/HelloWorld'

const routes = [
    {
      path: "/",
      name: "Home",
      component: HelloWorld
    },
    {
      path: "/movielist",
      name: "MovieList",
      component: () => import("./components/MovieList.vue"),
      props: true
    },
    {
      path: "/moviedetail/:id",
      name: "MovieDetail",
      component: () => import("./components/MovieDetail.vue"),
      props: true
    },
    {
      path: "/moviecreate",
      name: "MovieCreate",
      component: () => import("./components/MovieCreate.vue")
    },
    {
      path: "/movieeidt/:id",
      name: "MovieEdit",
      component: () => import("./components/MovieEdit.vue"),
      props: true
    }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router