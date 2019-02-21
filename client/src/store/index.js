import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import createLogger from 'vuex/dist/logger'
import app from './modules/app'
import user from './modules/user'
import singer from './modules/singer'
import song from './modules/song'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    app,
    user,
    singer,
    song
  },
  strict: debug,
  // 严格模式，会检测修改是不是来源于mutations。
  plugins: debug ? [createLogger()] : [],
  getters
})

export default store
