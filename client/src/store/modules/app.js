import Cookie from 'js-cookie'

const app = {
  state: {
    sidebar: Cookie.get('sidebarStatus') ? !!+Cookie.get('sidebarStatus') : false
  },
  mutations: {
    OPEN_SIDEBAR: state => {
      Cookie.set('sidebarStatus', 1)
      state.sidebar = true
    },
    CLOSE_SIDEBAR: state => {
      Cookie.set('sidebarStatus', 0)
      state.sidebar = false
    }
  },
  actions: {
    openSidebar: ({ commit }) => {
      commit('OPEN_SIDEBAR')
    }
  }
}

export default app
