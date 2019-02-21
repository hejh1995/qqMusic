<template>
  <div class="uplod-wrapper">
    <section ref="upWrapper" class="up-wrapper" @click="upload">
      <input ref="upBtn" type="file" class="up-btn" @change="upImg">
      <p v-if="!src" class="plus-icon">+</p>
      <img v-else :src="src" class="img" @click="showImg">
    </section>
    <button v-if="src" class="btn btn-blue" @click="changeImg">重新上传头像</button>
    <section v-if="imgShow" ref="showImg" class="show-img-wrapper">
      <button class="btn close-btn" @click="closeShow">X</button>
      <img :src="src" class="show-img">
    </section>
  </div>
</template>
<script>

export default {
  data() {
    return {
      src: '',
      imgShow: false,
      hasError: false,
      errorText: ''
    }
  },
  mounted() {
    this._initHeight()
  },
  methods: {
    _initHeight() {
      const height = document.defaultView.getComputedStyle(this.$refs.upWrapper, null).width
      this.$refs.upWrapper.style.height = height
    },
    upload() {
      if (!this.src) {
        this.$refs.upBtn.click()
      }
    },
    upImg(event) {
      const file = this.$refs.upBtn.files[0]
      if (!file) {
        console.log('文件为空')
        return
      }
      const reg = /image\/\w+/
      if (!reg.test(file.type)) {
        this.$emit('upimgerr', '抱歉，只支持图片类型哦！')
        return
      }
      if (file.size > 1024 * 1024 * 2) {
        console.log('fileSize', file.size)
        this.$emit('upimgerr', '图片应小于2MB！')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        this.src = event.target.result
        // event.target.result 就是base64格式的
        this.$emit('getfile', file)
      }
      reader.readAsDataURL(file)
    },
    changeImg() {
      this.$refs.upBtn.click()
    },
    showImg() {
      this.imgShow = true
    },
    closeShow() {
      this.imgShow = false
    }
  }
}
</script>
<style scoped>
/* .upload-wrapper {
  position: relative;
  height: 100%;
} */
.up-wrapper {
  background-color: #fff;
  width: 50vw;
  margin: 0 auto;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
}
.up-btn {
  visibility: hidden;
  position: absolute;
  width: 10%;
  top: 2rem;
}
.plus-icon {
  font-size: 3rem;
  color: #999;
  font-weight: 100;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.img {
  width: 100%;
  height: 100%;
}
.show-img-wrapper {
  position: absolute;
  top: 20%;
  left: 5%;
  width: 90%;
}
.show-img {
  width: 100%;
  height: 100%;
}
.close-btn {
  width: 1.4rem;
  height: 1.4rem;
  background-color: red;
  border: none;
  position: absolute;
  top: -1.4rem;
  right: -.8rem;
}
.btn-blue {
  width: 50%;
}
</style>
