import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home'
import Users from './pages/Users'
import Profile from './pages/Profile'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: "/dashboard/",
    routes: [
        {
            path: '',
            name: 'home',
            component: Home
        },
        {
            path: '/users',
            name: 'users',
            component: Users
        },
        {
            path: '/profile/:initTab',
            name: 'profile',
            component: Profile,
            props: true
        },
        {
            path: '/profile',
            redirect: '/profile/general'
        }
    ]
}) 