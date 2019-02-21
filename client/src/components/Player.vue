<template>
  <div v-show="playList.length > 0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div v-show="fullScreen" ref="normal" class="normal-player">
        <section class="bg-img"><img :src="currentSong.image"></section>
        <section class="top">
          <i class="icon-angle-down" @click="back"/>
          <p class="top-song-name">{{ currentSong.name }}</p>
          <p class="top-singer-name">———— {{ currentSong.singer }} ————</p>
        </section>
        <section class="middle" @touchstart.prevent="middleTouchStart" @touchmove="middleTouchMove" @touchend="middleTouchEnd">
          <article ref="middleL" class="middle-left">
            <img ref="middleImg" :src="currentSong.image" :class="imgActionClass" class="middle-left-img">
            <p class="middle-left-text">{{ playingLyric }}</p>
          </article>
          <Scroll ref="middleR" :bounce="false" :data="currentLyric && currentLyric.lines" class="middle-right">
            <section class="middle-right-inner">
              <div v-if="currentLyric">
                <p
                  v-for="(line, index) in currentLyric.lines"
                  ref="lyrics"
                  :key="line.lineNum"
                  :class="{'middle-right-text-active': currentLineNum === index}"
                  class="middle-right-text"
                >{{ line.txt }}</p>
              </div>
            </section>
          </Scroll>
        </section>
        <section class="bottom">
          <article class="bottom-dots">
            <div :class="{'dot-active': currentShow === 'cd'}" class="dot"/>
            <div :class="{'dot-active': currentShow === 'lyric'}" class="dot"/>
          </article>
          <article class="bottom-progress">
            <span class="bottom-progress-time">{{ format(currentTime) }}</span>
            <progress-bar :percent="percent" @percentChange="onProgressChange"/>
            <span class="bottom-progress-time">{{ format(currentSong.duration) }}</span>
          </article>
          <article class="bottom-operators">
            <i :class="modeIcon" @click="changeMode"/>
            <i :class="disable" class="icon-chevron-circle-left" @click="preSong"/>
            <i :class="[playIconClass, disable]" @click="togglePlaying"/>
            <i :class="disable" class="icon-chevron-circle-right" @click="nextSong"/>
            <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"/>
          </article>
        </section>
      </div>
    </transition>
    <transition name="mini">
      <div v-show="!fullScreen" class="mini-player" @click="show">
        <img :src="currentSong.image" :width="miniImg" :height="miniImg" class="mini-player-img">
        <section class="mini-player-text">
          <p class="mini-player-name">{{ currentSong.name }}</p>
          <p class="mini-player-singer">{{ currentSong.singer }}</p>
        </section>
        <progress-circle :percent="percent" :radius="40" class="mini-play-progress">
          <i :class="miniPlayClass" class="mini-player-play" @click.stop="togglePlaying"/>
        </progress-circle>
        <i class="icon-list" @click.stop="showPlayList"/>
      </div>
    </transition>
    <play-list ref="playlist"/>
    <audio
      ref="audio"
      src="http://183.240.120.20/amobile.music.tc.qq.com/C400001J5QJL1pRQYB.m4a?guid=9635518726&vkey=9134FCED40BF3413A29EC51B519CDDB0F1ED01A82F47CACFCED9550B5EE2B35CE8D6B89B5B4F44D202334EFD389BB610826132FA04FF5412&uin=1793&fromtag=66"
      height="0"
      width="0"
      @play="audioReady"
      @error="audioError"
      @timeupdate="audioUpdateTime"
      @ended="audioEnd"
    />
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import ProgressBar from '@/base/progressBar'
import ProgressCircle from '@/base/progressCircle'
import { playerMixin } from '@/common/js/mixin'
import Scroll from '@/base/scroll'
import { prefixStyle } from '@/common/js/dom'
import Lyric from 'lyric-parser'
import animations from 'create-keyframe-animation'
import { playMode } from '@/common/js/config'
import PlayList from '@/components/PlayList'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  components: {
    ProgressBar,
    ProgressCircle,
    PlayList,
    Scroll
  },
  mixins: [playerMixin],
  data() {
    return {
      miniImg: 50,
      currentLyric: null,
      playingLyric: '',
      currentTime: 0,
      songReady: false,
      currentShow: 'cd',
      currentLineNum: 0
    }
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playing'
    ]),
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    // this.playing, 相关的属性，不能放在playing的watch中检测赋值，因为watch只有变化了才赋值，第一次不会有效。
    playIconClass() {
      return this.playing ? 'icon-pause-circle-o' : 'icon-play-circle-o'
    },
    miniPlayClass() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    imgActionClass() {
      return this.playing && this.songReady ? 'img-play' : 'img-play img-pause'
    },
    disable() {
      return this.songReady ? '' : 'disable-btn'
    }
  },
  watch: {
    playing(newValue) {
      if (!newValue) this.currentLyric.stop()
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newValue ? audio.play() : audio.pause()
      })
    },
    currentSong(newSong, oldSong) {
      if (!newSong.id || newSong.id === oldSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
      }
      clearTimeout(this.timmer)
      this.$refs.audio.load()
      // 重新加载音频需要时间，
      this.timmer = setTimeout(() => {
        this.currentTime = 0
        this.$refs.audio.play()
        this._getLyric()
      }, 1000)
    },
    fullScreen(newValue) {
      if (newValue) this.$refs.normal.style.zIndex = 9999
      else this.$refs.normal.style.zIndex = -1
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    ...mapMutations({
      setPlaying: 'SET_PLAYING_STATE',
      setFullscreen: 'SET_FULLSCREEN_STATE'
    }),
    ...mapActions(['savePlayHistory']),
    showPlayList() {
      // 调用子组件的方法
      this.$refs.playlist.show()
    },
    show() {
      this.setFullscreen(true)
    },
    audioUpdateTime(event) {
      this.currentTime = event.target.currentTime
    },
    audioReady() {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    audioError() {
      this.songReady = true
    },
    audioEnd() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.nextSong()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlaying(true)
      if (this.currentLyric) this.currentLyric.seek(0)
    },
    middleTouchStart(event) {
      this.touch.initiated = true
      this.touch.startx = event.touches[0].pageX
      this.touch.starty = event.touches[0].pageY
    },
    middleTouchMove(event) {
      if (!this.touch.initiated) {
        return
      }
      const deltax = event.touches[0].pageX - this.touch.startx
      const deltay = event.touches[0].pageY - this.touch.starty
      if (Math.abs(deltax) < Math.abs(deltay)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltax))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      console.log(this.touch.percent)
      this.middleTransform(1 - this.touch.percent, offsetWidth)
    },
    middleTouchEnd() {
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.2) {
          offsetWidth = -window.innerWidth
          this.currentShow = 'lyric'
          opacity = 0
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.8) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      this.middleTransform(opacity, offsetWidth, 300)
      this.touch.initiated = false
    },
    middleTransform(opacity, offsetWidth, time = 0) {
      this.$refs.middleR.$el.style[transform] = `translateX(${offsetWidth}px)`
      this.$refs.middleR.$el.style[transitionDuration] = time
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = time
    },
    preSong() {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) this.loop()
      else {
        let index = this.currentIndex - 1
        if (index < 0) index = 0
        this.setCurrentIndex(index)
        this.setPlaying(true)
      }
      this.songReady = false
    },
    nextSong() {
      if (!this.songReady) {
        return
      }
      // 各种特殊情况，需要测试才能发现
      if (this.playList.length === 1) this.loop()
      else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) index = 0
        this.setCurrentIndex(index)
        this.setPlaying(true)
      }
      this.songReady = false
    },
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      this.setPlaying(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
        // togglePlay 切换歌词播放/暂停状态
      }
    },
    onProgressChange(percent) {
      this.currentTime = percent * this.currentSong.duration
      this.$refs.audio.currentTime = this.currentTime
      this.setPlaying(true)
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000)
        // seek(startTime) 歌词的跳转
      }
    },
    format(time) {
      time = time | 0
      const min = time / 60 | 0
      const second = this._pad(time % 60)
      return `${min}: ${second}`
    },
    back() {
      this.setFullscreen(false)
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale()
      const animation = {
        0: { transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` },
        60: { transform: `translate3d(0, 0, 0) scale(1.1)` },
        100: { transform: `translate3d(0, 0, 0) scale(1)` }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400, // 动画时长
          easing: 'linear' // 动画曲线
        }
      })
      // 绑定动画元素，done -- 到下一步afterEnter
      animations.runAnimation(this.$refs.middleImg, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.middleImg.style.animation = ''
    },
    leave(el, done) {
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.middleImg.style.transition = 'all 0.4s'
      this.$refs.middleImg.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.middleImg.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.middleImg.style.transition = ''
      this.$refs.middleImg.style[transform] = ''
    },
    _pad(num, n = 2) {
      let length = num.toString().length
      while (length < n) {
        num = '0' + num
        length++
      }
      return num
    },
    _getLyric() {
      this.currentSong.getLyric().then(lyric => {
        this.currentLyric = new Lyric(lyric, this._handleLyric)
        if (this.playing) this.currentLyric.play()
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    _handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        const lineElement = this.$refs.lyrics[lineNum - 5]
        this.$refs.middleR.scrollToElement(lineElement, 1000)
      } else {
        this.$refs.middleR.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    _getPosAndScale() {
      const targetWidth = this.miniImg
      const paddingLeft = this.miniImg
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerWidth - paddingTop - width / 2 - paddingBottom
      return { x, y, scale }
    }
  }
}
</script>
<style scoped>
.normal-enter-active, .normal-leave-active {
  transition: all 0.4s;
}
.normal-enter, .normal-leave-to {
  opacity: 0;
}
.normal-enter-active > .top, .normal-leave-active > .top,
.normal-enter-active > .bottom, .normal-leave-active > .bottom {
  transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
.normal-enter > .top, .normal-leave-to > .top {
  transform: translateY(-100px);
}
.normal-enter > .bottom, .normal-leave-to > .bottom {
  transform: translateY(100px);
}
.mini-enter-active, .mini-leave-active {
  transition: all 0.4s;
}
.mini-enter, .mini-leave-to {
  opacity: 0;
}
.disable-btn:before {
  color: #333!important;
}
.bottom {
  position: absolute;
  width: 80%;
  bottom: 3rem;
  left: 10%;
}
.icon-random:before, .icon-undo:before, .icon-chevron-circle-left:before, .icon-arrow-circle-o-down:before,
.icon-play-circle-o:before, .icon-pause-circle-o:before, .icon-chevron-circle-right:before, .icon-refresh:before {
  color: #fff;
  font-size: 1.6rem;
}
.icon-pause-circle-o:before, .icon-play-circle-o:before {
  font-size: 2.4rem;
}
.bottom-operators {
  display: flex;
  width: 100%;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
}
.bottom-dots {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: .8rem;
}
.dot {
  width: 8px;
  height: 8px;
  background-color: #fff;
  border-radius: 50%;
  margin-right: 1rem;
}
.dot-active {
  background-color: #31c27c;
}
.bottom-progress {
  display: flex;
  align-items: center;
}
.bottom-progress-time {
  flex-shrink: 0;
}
.normal-player {
  background-color: #fff;
  z-index: 9999;
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  color: #fff;
}
.top {
  text-align: center;
  position: relative;
  margin-top: 2rem;
}
.top-song-name {
  margin-bottom: 1.2rem;
  font-size: 1.2rem;
}
.top-singer-name {
  margin-bottom: 2rem;
}
.icon-angle-down {
  position: absolute;
  left: 1rem;
  top: -1rem;
}
.icon-angle-down::before {
  font-size: 2rem;
  color: #fff;
}
.bg-img {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: -1;
  opacity: 0.6;
  filter: blur(20px);
}
.bg-img img {
  width: 100%;
  height: 100%;
}
.middle {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  text-align: center;
}
.middle-left ,.middle-right {
  flex-shrink: 0;
  width: 100vw;
}
.middle-right-inner {
  width: 80%;
  margin: 0 auto;
}
.middle-left-img {
  border-radius: 50%;
  width: 80%;
}
.img-play {
  animation: rotate 20s linear infinite;
}
.img-pause {
  animation-play-state: paused;
}
.middle-left-text {
  margin: 2rem 0;
}
.middle-right {
  height: 24rem;
  overflow: hidden;
}
.middle-right-inner {
  overflow: hidden;
  z-index: -1;
}
.middle-right-text {
  line-height: 2rem;
}
.middle-right-text-active {
  color: #31c27c;
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.mini-player {
  background-color: #fff;
  z-index: 999;
  position: fixed;
  bottom: 0;
  height: 4rem;
  width: 100%;
  display: flex;
  align-items: center;
}
.mini-player-img {
  border-radius: 50%;
  margin: auto 1rem;
}
.mini-player-text {
  width: 100%;
  padding: 1rem;
}
.mini-player-name {
  color: #31c27c;
  padding-bottom: .6rem;
}
.mini-player-singer {
  color: #999;
}
.mini-player-play {
  position: absolute;
  left: .8rem;
  top: .6rem;
}
.mini-play-progress {
  margin: 1rem;
}
.mini-player-play::before {
  font-size: 1.2rem!important;
}
.icon-list {
  padding: 0 1rem;
}
.icon-list::before {
  font-size: 1.6rem;
}
</style>
