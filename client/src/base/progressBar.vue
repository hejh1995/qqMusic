<template>
  <div class="wrapper" @click="onClick">
    <div ref="progress" class="progress">
      <section ref="progressLeft" class="progress-left"/>
      <section ref="progressBtn" class="progress-btn" @touchstart.prevent="touchStart" @touchmove.prevent="touchMove" @touchend="touchEnd"/>
    </div>
  </div>
</template>
<script>
import { prefixStyle } from '@/common/js/dom'
const transform = prefixStyle('transform')
const PROGRESS_BTN_WIDTH = 16
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newValue) {
      if (newValue < 0 || this.touch.initiated) {
        return
      }
      const offsetWidth = newValue * (this.$refs.progress.clientWidth - PROGRESS_BTN_WIDTH)
      this._offset(offsetWidth)
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    onClick(event) {
      const rect = this.$refs.progress.getBoundingClientRect()
      const offsetWidth = event.pageX - rect.left - 10
      // rect.left 得到这个元素相对于视口的left位置
      // e.pageX点击的x位置
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    touchStart(event) {
      this.touch.startX = event.touches[0].pageX
      this.touch.initiated = true
      this.touch.left = this.$refs.progressLeft.clientWidth
    },
    touchMove(event) {
      if (!this.touch.initiated) {
        return
      }
      const deltax = event.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progress.clientWidth - PROGRESS_BTN_WIDTH, Math.max(0, this.touch.left + deltax))
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    touchEnd() {
      this.touch.initiated = false
    },
    _offset(width) {
      width = width > 0 ? width : 0
      this.$refs.progressLeft.style.width = width + 'px'
      this.$refs.progressBtn.style[transform] = `translateX(${width}px)`
    },
    _triggerPercent() {
      const barWidth = this.$refs.progress.clientWidth - PROGRESS_BTN_WIDTH
      const percent = this.$refs.progressLeft.clientWidth / barWidth
      this.$emit('percentChange', percent)
    }
  }
}
</script>
<style scoped>
.wrapper {
  width: 100%;
  position: relative;
  margin: 1rem;
}
.progress {
  background-color: #333;
  height: 4px;
}
.progress-left {
  background-color: #31c27c;
  height: 4px;
  width: 0;
  z-index: 9;
}
.progress-btn {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  background-color: #fff;
  border-radius: 50%;
  position: relative;
  top: -.6rem;
  left: 0;
}
</style>
