<template>
  <div v-show="showFlag" class="wrapper">
    <header class="header">
      <section @click="changeMode">
        <i :class="modeIcon" class="extend-icon"/>
        <span>{{ modeText }}</span>
      </section>
      <section>
        <i class="icon-plus extend-icon"/>
        <i class="icon-trash extend-icon" @click="deleteAll"/>
      </section>
    </header>
    <scroll ref="scroll" :data="sequenceList" class="scroll">
      <ul>
        <li v-for="(item, index) in sequenceList" ref="listItem" :key="item.id" :class="{'active-item': currentIndex === index}" class="list-item" @click="selectItem(item, index)">
          <span class="list-item-text">{{ item.name }}</span>
          <i :class="getFavoriteIcon(item)" class="small-icon" @click.stop="toggleFavorite(item)"/>
          <i class="icon-trash extend-icon small-icon" @click.stop="deleteOne(item)"/>
        </li>
      </ul>
    </scroll>
    <footer class="footer" @click="hidden">
      <span>关闭</span>
    </footer>
    <message-box v-if="waring" @close="waring = false" @save="confirm">
      <p>{{ waringText }}</p>
    </message-box>
  </div>
</template>
<script>
import { playerMixin } from '@/common/js/mixin'
import MessageBox from '@/base/messageBox'
import Scroll from '@/base/scroll'
import { playMode } from '@/common/js/config'
import { mapActions } from 'vuex'

export default {
  components: {
    MessageBox,
    Scroll
  },
  mixins: [playerMixin],
  data() {
    return {
      waringText: '',
      waring: false,
      showFlag: false
    }
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '循环播放' : '随机播放'
    }
  },
  methods: {
    ...mapActions(['deleteSongList', 'deleteSong']),
    show() {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.scroll.refresh()
        const index = this.sequenceList.findIndex(song => song.id === this.currentSong.id)
        this.$refs.scroll.scrollToElement(this.$refs.listItem[index], 300)
      })
    },
    hidden() {
      this.showFlag = false
    },
    deleteAll() {
      this.warning = true
      this.waringText = '确定要删除整个列表吗？'
    },
    confirm() {
      this.deleteSongList()
      this.hidden()
    },
    selectItem(song, index) {
      if (this.mode === playMode.random) {
        index = this.palyList.findIndex(item => item.id === song.id)
      }
      this.setCurrentIndex(index)
      this.setPlaying(true)
    },
    deleteOne(item) {
      this.deleteSong(item)
    }
  }
}
</script>
<style scoped>
.icon-plus:before, .icon-trash:before {
  color: rgba(255,255,255,0.3);
}
.wrapper {
  position: fixed;
  z-index: 999;
  bottom: 0;
  left: 0;
  width: 100%;
  color: #fff;
}
.header {
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1c1c1c;
}
.extend-icon {
  padding: 0 1rem;
}
.scroll {
  max-height: 15rem;
  overflow: hidden;
  background-color: #363636;
}
.list-item {
  display: flex;
  height: 2rem;
  align-items: center;
  margin: 0 1rem;
}
.active-item {
  color: #31c27c;
}
.list-item-text {
  width: 100%;
}
.small-icon:before {
  font-size: 1rem;
}
.footer {
  height: 3rem;
  text-align: center;
  line-height: 3rem;
  background-color: #000;
  opacity: 0.7;
}
</style>
