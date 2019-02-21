<template>
  <div class="register-wrapper">
    <p class="register-title" @click="goback">取消</p>
    <section ref="register" class="register">
      <input v-model="user.name" type="text" placeholder="账号" class="my-input">
      <input v-model="user.password" type="password" placeholder="密码" class="my-input">
      <p class="warning">* 密码必须包含数字和字母，长度应大于5</p>
      <upload-img @getfile="avatorFile" @upimgerr="upImgErr"/>
      <p class="warning">* 上传头像图片不能大于2MB！</p>
      <button class="btn btn-green" @click="onRegister">注册</button>
    </section>
    <message v-if="hasError" :error-text="errorText" @close="hasError = false"/>
  </div>
</template>
<script>
import Message from '@/base/message'
import { testPass, testNmae } from '@/utils/user'
import UploadImg from '@/base/uploadImg'
import axios from 'axios'

export default {
  name: 'Register',
  components: {
    Message,
    UploadImg
  },
  data() {
    return {
      hasError: false,
      errorText: '',
      user: {
        name: '',
        password: '',
        avator: undefined
      }
    }
  },
  methods: {
    goback() {
      this.$router.go(-1)
    },
    onRegister() {
      // 注册，数据应保存到数据库，然后跳转到前一 页
      // console.log(this.user)
      if (!testNmae(this.user.name)) {
        this.hasError = true
        this.errorText = '账号不能为空！'
        return
      }
      if (!testPass(this.user.password)) {
        this.hasError = true
        this.errorText = '密码必须包含数字和字母，长度必须大于5!'
        return
      }
      const data = new FormData()
      data.set('name', this.user.name)
      data.set('password', this.user.password)
      data.append('avator', this.user.avator)
      this.registerApi(data)
    },
    registerApi(data) {
      const url = process.env.BASE_API + '/user/register'
      const self = this
      axios({
        url,
        method: 'post',
        data
        // 允许为上传处理进度事件
        // onUploadProgress: (progressEvent) => {
        //   this.progress = (progressEvent.loaded / progressEvent.total) * 100
        // }
      }).then(res => {
        console.log(res.data.code)
        if (res.data.code === 1) {
          self.goback()
          // console.log(this.progress)
        } else if (res.data.code === 0) {
          this.hasError = true
          this.errorText = '该名称已存在！请重新输入名称'
        }
      }).catch(err => {
        console.log('register', err)
      })
    },
    avatorFile(data) {
      // 获取到base64格式的文件
      console.log('img', data)
      this.user.avator = data
    },
    upImgErr(data) {
      this.hasError = true
      this.errorText = data
    }
  }
}
</script>
<style scoped>
.register-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 100;
  background: url('/static/imgs/register.jpg') 50% no-repeat;
}
.register {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
}
.warning {
  color: #eee;
  margin: .8rem;
  font-size: .9rem;
}
.register-title {
  color: #fff;
  padding: 1rem;
}
</style>
