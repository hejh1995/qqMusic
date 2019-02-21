<template>
  <div ref="slider" class="slider">
    <div ref="sliderGrop" class="slider-grop">
      <section v-for="img in imgs" :key="img.id" class="slider-section">
        <a :href="img.linkUrl"><img :src="img.picUrl" class="slider-img"></a>
      </section>
    </div>
    <footer class="dots">
      <span v-for="index in imgs.length" :key="index" :class="{dotActive: currentPageIndex === index - 1}" class="dot" />
    </footer>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
  name: 'Slider',
  props: {
    imgs: {
      type: Array,
      default: () => []
    },
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      currentPageIndex: 0
    }
  },
  mounted() {
    // 初始化
    // 轮播图，利用better-scroll，实现原理是子元素的宽度大于父元素的宽度就出现滚动
    // 所以需要在初始化的时候计算框的宽度。
    // 20ms延迟，一般网页的延迟是17ms
    setTimeout(() => {
      this._setSliderWidth()
      this._initSilder()
      if (this.autoPlay) this._play()
    }, 200)
  },
  destroyed() {
    clearTimeout(this.timer)
  },
  methods: {
    _initSilder() {
      this.slider = new BScroll('.slider', {
        scrollX: true, // 横向滚动
        scrollY: false, // 纵向滚动
        momentum: false, // true则开启滚动动画
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 100
        }
      })
      this.slider.on('scrollEnd', () => {
        this.currentPageIndex = this.slider.getCurrentPage().pageX
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _setSliderWidth(isResize) {
      const sliderWidth = this.$refs.slider.clientWidth
      const length = this.loop ? this.imgs.length + 2 : this.imgs.length
      this.$refs.sliderGrop.style.width = sliderWidth * length + 'px'
    },
    _play() {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  }
}
</script>
<style scoped>
.dot {
  display: inline-block;
  width: .4rem;
  height: .4rem;
  border-radius: 50%;
  background-color: #999;
  margin: 2px;
}
.dots {
  position: relative;
  bottom: 1rem;
  text-align: center;
}
.dotActive {
  background-color: #fff;
}
.slider {
  min-height: 1px;
  position: relative;
}
.slider-grop {
  display: flex;
  flex-wrap: nowrap;
  flex-shrink: 0;
}
.slider-img {
  display: block;
  width: 100%;
  background-position: center center;
  background-size: cover;
}
</style>
