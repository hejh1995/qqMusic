<template>
  <div>
    <scroll ref="scroll" :bounce="false" :listen-scroll="true" :data="singerList" :probe-type="3" class="singer-wrapper" @scroll="mainScroll">
      <ul>
        <li v-for="item in singerList" ref="list" :key="item.title" class="singer-list-item">
          <p class="singer-list-title">{{ item.title }}</p>
          <ul v-for="singer in item.items" :key="singer.id">
            <li class="singer-item" @click="onSinger(singer)">
              <!-- 左侧固定，右侧满的布局 -->
              <img :src="singer.avator" class="singer-item-avator">
              <p class="singer-name">{{ singer.name }}</p>
            </li>
          </ul>
        </li>
      </ul>
      <section ref="topTitle" class="top">
        <i class="icon-arrow-left" @click="back"/>
        <span class="top-text">{{ currentTitle }}</span>
      </section>
    </scroll>
    <section ref="rightList" class="right-list" @touchstart="rightTouchStart" @touchmove.stop.prevent="rightTouchMove">
      <ul>
        <li
          v-for="(item, index) in shortList"
          :key="item"
          :data-index="index"
          :class="{active: index == currentIndex}"
          class="right-list-item">
          {{ item }}
        </li>
      </ul>
    </section>
    <router-view/>
  </div>
</template>
<script>
import Scroll from '@/base/scroll'
import { getSingerList } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import Singer from '@/common/js/singer'
import { getData } from '@/common/js/dom'
import { mapMutations } from 'vuex'
import { playlistMixin } from '@/common/js/mixin'

const HOT_NAME = '热'
const HOT_SINGER_LEN = 10
export default {
  name: 'Singer',
  components: {
    Scroll
  },
  mixins: [playlistMixin],
  data() {
    return {
      currentTitle: HOT_NAME,
      singerList: [],
      shortList: [],
      currentIndex: 0
    }
  },
  watch: {
    singerList(newValue) {
      // 数据变化延时20ms，等DOM渲染好之后计算买每个list的高度
      newValue.forEach(item => {
        this.shortList.push(item.title)
      })
      setTimeout(() => this._calculateHeight(), 20)
    },
    currentIndex(newValue) {
      this.currentTitle = this.singerList[newValue] ? this.singerList[newValue].title : ''
    }
  },
  mounted() {
    this._getSingerList()
    this.topTitleHeight = this.$refs.topTitle.clientHeight
    this.currentIndex = 0
    this.touch = {}
  },
  methods: {
    ...mapMutations({
      'setSinger': 'SET_SINGER'
    }),
    handlePlaylist(playlist) {
      // 底部播放器自适应高度
      const bottom = playlist.length > 0 ? '2rem' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
      const bottom2 = playlist.length > 0 ? '4rem' : ''
      this.$refs.rightList.style.bottom = bottom2
      // refresh 重新计算高度
    },
    rightTouchStart() {
      this.touch.y1 = event.touches[0].pageY
      this.touch.firstIndex = +getData(event.target, 'index')
      // target 一定 是li，跳转到对应的元素，如果不是呢
      this._scrollTo(this.touch.firstIndex)
    },
    rightTouchMove(event) {
      // 因为移动之后，不知道到了哪个元素，它的target还是开始触摸的DOM，
      // 所以计算移动的距离，除以一个元素的高度，就知道移动后到哪个元素了.
      this.touch.y2 = event.touches[0].pageY
      const delta = (this.touch.y2 - this.touch.y1) / this.rightItemHeight | 0
      this._scrollTo(delta + this.touch.firstIndex)
    },
    mainScroll(scroll) {
      this.scroll_y = -scroll.y
      if (this.scroll_y < 0) {
        this.currentIndex = 0
        return
      }
      // 计算每一个隔断的长度，当大于长度的时候，跟换 currentTitle 。
      if (this.scroll_y >= this.listHeight[this.currentIndex + 1]) {
        this.currentIndex++
      }
      if (this.scroll_y <= this.listHeight[this.currentIndex]) {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : 0
      }
      this._topTitleTransform()
    },
    back() {
      this.$router.go(-1)
    },
    onSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _topTitleTransform() {
      const diff = this.listHeight[this.currentIndex + 1] - this.scroll_y
      const topDiff = (diff > 0 && diff < this.topTitleHeight) ? diff - this.topTitleHeight : 0
      if (this.topHeight === topDiff) {
        return
      }
      this.topHeight = topDiff
      this.$refs.topTitle.style.transform = `translate3d(0, ${topDiff}px, 0)`
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singerList = this._normalSinger(res.data.list)
        }
      })
    },
    _normalSinger(list) {
      // 将获取到的数据变为自己适用的
      const map = []
      const hot = {
        title: HOT_NAME,
        items: []
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          hot.items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }
        // 歌手可以属于热门也可以属于下面的
        const exist = map.find(mapItem => {
          if (mapItem.title === item.Findex) {
            mapItem.items.push((new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            })))
            return mapItem
          }
        })
        if (!exist && item.Findex.match(/[a-zA-Z]/)) {
          map.push({
            title: item.Findex,
            items: [new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            })]
          })
        }
      })
      map.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
      map.unshift(hot)
      return map
    },
    _calculateHeight() {
      this.listHeight = []
      const list = Array.from(this.$refs.list)
      let height = 0
      this.listHeight.push(height)
      list.forEach(item => {
        height += item.clientHeight
        // const h = document.defaultView.getComputedStyle(item, null).height
        // height += +h.slice(0, h.length - 2)
        this.listHeight.push(height)
      })
      this.rightItemHeight = this.$refs.rightList.clientHeight / this.listHeight.length
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) index = 0
      else if (index > this.listHeight.length) index = this.listHeight.length - 2
      // 利用scroll里的方法，跳转至对应的元素，这样父组件可以调用子组件的方法
      this.$refs.scroll.scrollToElement(this.$refs.list[index], 0)
      this.currentIndex = index
    }
  }
}
</script>
<style scoped>
.right-list {
  position: fixed;
  right: 1rem;
  bottom: 3rem;
  z-index: 999;
  background-color: #e3e8e6;
  border-radius: 1.1rem;
  padding-bottom: .6rem;
}
.right-list-item {
  padding: .4rem;
  padding-bottom: 0;
}
.active {
  color: red;
}
.singer-item {
  display: flex;
  flex-direction: row;
  padding: 1rem;
  padding-bottom: 0;
  align-items: center;
  box-sizing: border-box;
}
.singer-item-avator {
  width: 4em;
  height: 4em;
  border-radius: 50%;
  flex-shrink: 0;
}
.singer-name {
  width: 100%;
  height: 4rem;
  line-height: 4rem;
  margin-left: 1rem;
  border-bottom: 1px solid #000;
}
.singer-list-title {
  font-size: 1.2em;
  padding: 1em;
  padding-bottom: 0;
}
.singer-wrapper {
  position: fixed;
  top: 0;
  z-index: 100;
  background-color: #fff;
  bottom: 0;
  width: 100%;
  margin-bottom: 2rem;
}
.top {
  position: absolute;
  top: 0;
  padding: .8em;
  background-color: #fff;
  width: 100%;
  z-index: 9;
}
.icon-arrow-left::before {
  color: #000;
}
.top-text {
  margin-left: 1rem;
  font-size: 1.2rem;
}
</style>
