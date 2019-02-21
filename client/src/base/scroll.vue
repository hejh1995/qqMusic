<template>
  <div ref="scrollWrapper">
    <slot/>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
  name: 'Scroll',
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    bounce: {
      type: Boolean,
      default: true
    },
    click: {
      type: Boolean,
      default: true
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    data() {
      // 监听数据变化就 refresh
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  },
  mounted() {
    setTimeout(() => this._initScroll(), 20)
  },
  methods: {
    _initScroll() {
      if (!this.$refs.scrollWrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.scrollWrapper, {
        // probeType 为1， 会不定时派发scroll事件
        probeType: this.probeType,
        click: this.click,
        bounce: this.bounce
      })
      if (this.listenScroll) {
        this.scroll.on('scroll', pos => {
          this.$emit('scroll', pos)
        })
      }
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScroll + 50)) this.$emit('scrollToEnd')
        })
      }
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    disable() {
      // 禁用
      this.scroll && this.scroll.disable()
    },
    enable() {
      // 启动
      this.scroll && this.scroll.enable()
    },
    refresh() {
      // 当dom结构发送变化时，务必调用，确保滚动的效果正常
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      // 滚动到指定的位置
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  }
}
</script>
<style>
</style>
