<template>
  <div class="login-wrapper">
    <header>
      <span class="header-text" @click="goback">取消</span>
    </header>
    <main>
      <h2 class="main-title"><i class="icon-music"/>我的音乐</h2>
      <section ref="btns" class="btns">
        <input v-model="user.name" type="text" placeholder="请输入账号" class="my-input">
        <input v-model="user.password" type="password" placeholder=" 请输入密码" class="my-input">
        <button class="btn btn-green" @click="onLogin">账号登录</button>
        <button class="btn btn-blue" @click="register">账号注册</button>
      </section>
    </main>
    <message v-if="hasError" @close="hasError = false">
      <p>{{ errorText }}</p>
    </message>
  </div>
</template>
<script>
import { login } from '@/api/user'
import { testPass, testNmae } from '@/utils/user'
import Message from '@/base/message'
import { mapMutations } from 'vuex'
import { playlistMixin } from '@/common/js/mixin'

export default {
  name: 'Login',
  components: {
    Message
  },
  mixins: [playlistMixin],
  data() {
    return {
      hasError: false,
      errorText: '',
      user: {
        name: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapMutations({
      'saveUser': 'SET_USER'
    }),
    handlePlaylist(playlist) {
      // 底部播放器自适应高度
      const top = playlist.length > 0 ? '20rem' : ''
      this.$refs.btns.style.top = top
    },
    goback() {
      this.$router.go(-1)
    },
    onLogin() {
      // 后台验证后将user保存到本地，并跳转至前一页。
      if (!testNmae(this.user.name)) {
        this.hasError = true
        this.errorText = '账号不能为空！'
        return
      }
      if (!testPass(this.user.password)) {
        this.hasError = true
        this.errorText = '密码错误！'
        this.user.password = ''
        return
      }
      login(this.user).then(res => {
        console.log(res)
        if (res.code === 1) {
          // 将得到的数据保存到store
          this.saveUser(res.data)
          this.goback(res)
        } else if (res.code === 0) {
          this.hasError = true
          this.errorText = '账号或密码错误！'
        }
        this.user.password = ''
        this.user.name = ''
      })
    },
    register() {
      this.$router.push({
        name: 'Register'
      })
    }
  }
}
</script>
<style scoped>
.login-wrapper {
  background: url('/static/imgs/login_bg.jpg') 50% no-repeat;
  color: #fff;
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 100;
}
main {
  text-align: center;
}
.main-title{
  position: relative;
  font-size: 2rem;
  top: 6rem;
}
.icon-music::before {
  font-size: 2.6rem;
  margin-right: 1rem;
}
.btns {
  position: relative;
  top: 22rem;
}
.icon-weixin::before, .icon-qq::before {
  color: #fff;
  margin-right: 1rem;
}
.btn-bottom-text {
  color: #999;
  padding-bottom: .8rem;
  margin-left: 2px;
}
.header-text {
  position: relative;
  top: 1rem;
  left: 1rem;
}
</style>
