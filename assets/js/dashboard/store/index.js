import Vue from 'vue'
import Vuex from 'vuex'
import users from './users'
import profile from './profile'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        users,
        profile
    }
})