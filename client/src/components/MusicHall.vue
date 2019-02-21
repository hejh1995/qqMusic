<template>
  <scroll ref="scroll" :listen-scroll="true" :probe-type="3" class="scroll" @scroll="scroll">
    <div class="musichall-wrapper">
      <div ref="sliderWrapper" class="slider-wrapper">
        <!-- 需要一个外层元素限制宽高 -->
        <slider v-if="sliderImg.length" :imgs="sliderImg"/>
      </div>
      <div ref="navWrapper" class="nav-wrapper">
        <router-link v-for="nav in navs" :key="nav.text" :to="{ name: nav.path}" tag="div" class="nav-item">
          <i :class="nav.icon" class="nav-item-icon"/>
          <span class="nav-item-text">{{ nav.text }}</span>
        </router-link>
      </div>
      <div class="recommend-wrapper">
        <h2 class="recommend-title">为你推荐歌单</h2>
        <div class="recommend">
          <section v-for="item in recommend" :key="item.dissid" class="recommend-item">
            <img v-lazy="item.imgurl" class="recommend-img">
            <h2 class="recommend-text">{{ item.dissname }}</h2>
          </section>
        </div>
        <p class="footer">----- 没有了！-----</p>
      </div>
    </div>
  </scroll>
</template>
<script>
import Slider from '@/base/slider'
import { getScrollImg, getrecommed } from '@/api/musichall'
import { ERR_OK } from '@/api/config'
import Scroll from '@/base/scroll'
import { playlistMixin } from '@/common/js/mixin'

const sliderHeight = 150
const navbarHeight = 12
export default {
  components: {
    Slider,
    Scroll
  },
  mixins: [playlistMixin],
  data() {
    return {
      sliderImg: [],
      recommend: [],
      navs: [
        {
          path: 'singer',
          icon: 'icon-user-o',
          text: '歌手'
        },
        {
          path: 'rank',
          icon: 'icon-signal',
          text: '排行'
        },
        {
          path: 'rank',
          icon: 'icon-th-large',
          text: '分类歌单'
        },
        {
          path: 'rank',
          icon: 'icon-bullhorn',
          text: '电台'
        },
        {
          path: 'singer',
          icon: 'icon-video-camera',
          text: '视频'
        }
      ]
    }
  },
  mounted() {
    this._getSliderImg()
    this._getRecommend()
  },
  methods: {
    handlePlaylist(playlist) {
      // 底部播放器自适应高度
      console.log('ddd', this.$refs.scroll.$el.style.bottom)
      const height = playlist.length > 0 ? '8rem' : ''
      this.$refs.scroll.$el.style.height = `calc(100vh - ${height})`
      this.$refs.scroll.refresh()
      // refresh 重新计算高度
    },
    _getSliderImg() {
      getScrollImg().then(res => {
        if (res.code === ERR_OK) {
          this.sliderImg = res.data.slider
        }
      })
    },
    _getRecommend() {
      getrecommed().then(res => {
        if (res.code === ERR_OK) {
          this.recommend = res.data.list
        }
      })
    },
    scroll(pos) {
      if (pos.y < 0 && pos.y > -sliderHeight) {
        const scale = 1 - (-pos.y) / sliderHeight
        this.$refs.sliderWrapper.style.WebkitFilter = `brightness(${scale * 100}%)`
      } else {
        this.$refs.sliderWrapper.style.WebkitFilter = 'brightness(1)'
      }
      if (pos.y < 0 && pos.y < -navbarHeight) {
        this.$refs.navWrapper.style.top = '0px'
        this.$refs.navWrapper.style.boxShadow = '0 0'
      } else {
        // 再加个动画比较好
        this.$refs.navWrapper.style.top = '-1.2rem'
        this.$refs.navWrapper.style.boxShadow = '0 1px 1px #999'
      }
    }
  }
}
</script>
<style scoped>
.scroll {
  height: 100vh;
}
.slider-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.nav-wrapper {
  position: relative;
  background-color: #fff;
  width: 90%;
  top: -1.4rem;
  margin: 0 auto;
  box-shadow: 0 1px 1px #999;
  display: flex;
  justify-content: space-between;
}
.nav-item {
  margin: .8rem;
  text-align: center;
}
.nav-item-text {
  display: block;
  padding-top: 6px;
}
.recommend{
  display: grid;
  grid-template-columns: 30% 30% 30%;
  grid-gap: 1rem;
  margin: 1.2rem 1rem;
}
.recommend-img {
  width: 100%;
}
.recommend-text {
  font-size: .8rem;
  overflow: hidden; /*自动隐藏文字*/
  text-overflow: ellipsis;/*文字隐藏后添加省略号*/
  white-space: nowrap;/*强制不换行*/
}
.recommend-title {
  text-align: center;
  font-size: 1rem;
  font-weight: 900;
}
.footer {
  text-align: center;
  font-size: .8rem;
  padding-bottom: .8rem;
}
</style>
