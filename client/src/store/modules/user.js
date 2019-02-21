import Cookie from 'js-cookie'

const app = {
  state: {
    name: Cookie.get('userName') ? Cookie.get('userName') : '',
    avator: Cookie.get('userAvator') ? Cookie.get('userAvator') : ''
  },
  mutations: {
    SET_USER: (state, user) => {
      Cookie.set('userName', user.name)
      Cookie.set('userAvator', user.avator)
      state.name = user.name
      state.avator = user.avator
    },
    CLEAR_USER: state => {
      Cookie.set('userName', '')
      Cookie.set('userAvator', '')
      state.name = ''
      state.avator = ''
    }
  }
}

export default app
