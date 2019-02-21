<template>
  <div class="wrapper">
    <i class="icon-arrow-left" @click="back"/>
    <section ref="top" class="top">
      <div ref="bgImage" :style="computedBg" class="top-bg"/>
      <slot/>
    </section>
    <div ref="layer" class="bg-layer"/>
    <scroll ref="scroll" :data="songs" :listen-scroll="true" :probe-type="3" class="scroll" @scroll="scroll">
      <div v-show="songs.length > 0">
        <div ref="playBtn" class="play" @click="random">
          <i class="icon-play-circle-o"/>
          <span class="play-text">随机播放全部</span>
        </div>
        <song-list :songs="songs" @select="selectSong"/>
      </div>
      <loading v-show="!songs.length" class="loading-container"/>
    </scroll>
  </div>
</template>
<script>
import SongList from '@/base/songList'
import Loading from '@/base/loading'
import Scroll from '@/base/scroll'
import { prefixStyle } from '@/common/js/dom'
import { mapActions } from 'vuex'
import { playlistMixin } from '@/common/js/mixin'

const transform = prefixStyle('transform')
const RESERVED_HEIGHT = 48
const maxBlur = 2
export default {
  components: {
    SongList,
    Loading,
    Scroll
  },
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    computedBg() {
      return `background-image:url(${this.bgImage})`
    }
  },
  mounted() {
    this.bgHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.bgHeight + RESERVED_HEIGHT
    // this.$refs.scroll.$el.style ,,,,,组件样式
    this.$refs.scroll.$el.style.top = this.bgHeight + 'px'
  },
  methods: {
    ...mapActions(['selectPlay', 'randomPlay']),
    handlePlaylist(playlist) {
      // 底部播放器自适应高度
      const bottom = playlist.length > 0 ? '5rem' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
      // refresh 重新计算高度
    },
    scroll(event) {
      const scrolly = event.y
      // console.log('y', event.y)
      const translateY = Math.max(scrolly, this.minTranslateY)
      let scale = 1
      let zIndex = 0
      const percent = Math.abs(scrolly / this.bgHeight)
      if (scrolly > 0) {
        // 下拉放大图片
        scale = 1 + percent
        zIndex = 10
      } else {
        if (scrolly < this.minTranslateY) {
          // 上推到最上面的时候，文字的位置和大小变。
          this.$refs.bgImage.style.height = RESERVED_HEIGHT + 'px'
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.top.style.zIndex = 9
          this.$emit('changeTitleStyle', 'up')
        } else {
          this.$refs.bgImage.style.height = 0
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.filter = `blur(${percent * maxBlur}px)`
          this.$refs.top.style.zIndex = 0
          this.$emit('changeTitleStyle', 'normal')
        }
        // 上推，背景变模糊。
      }
      this.$refs.layer.style[transform] = `translateY(${translateY}px)`
      this.$refs.bgImage.style[transform] = `scale(${scale})`
      this.$refs.bgImage.style.zIndex = zIndex
    },
    back() {
      this.$router.go(-1)
    },
    random() {
      this.randomPlay({
        list: this.songs
      })
    },
    selectSong(song, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    }
  }
}
</script>
<style scoped>
.wrapper {
  background-color: #fff;
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 999;
}
.icon-arrow-left {
  position: absolute;
  z-index: 99;
}
.icon-arrow-left::before {
  color: #fff;
  height: 3rem;
  line-height: 3rem;
  padding-left: 1rem;
}
.top {
  position: fixed;
}
.top-bg {
  width: 100%;
  height: 0;
  padding-top: 70%;
  /* 这样可以保证图片的宽高比为10：7 */
  transform-origin: top;
  background-size: cover;
  /* 这个应该是保证下拉的时候放大一下那种效果 */
  background-color: #fff;
}
.top {
  position: relative;
  background-color: #fff;
}
.bg-layer {
  position: relative;
  height: 100%;
}
.play {
  border-bottom: 1px solid #e6e6e6;
  height: 3rem;
  line-height: 3rem;
  padding-left: 3rem;
  font-size: 1.1rem;
  background-color: #fff;
}
.play-text {
  padding-left: 1rem;
}
.scroll {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
}
.loading-container {
  position: absolute;
  /* top: 5rem; */
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
