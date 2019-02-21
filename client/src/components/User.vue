<template>
  <div class="wrapper">
    <header class="user" @click="login">
      <img :src="userAvator ? userAvator : '/static/imgs/user.svg'" class="user-img">
      <span>{{ userName ? userName : '立即登录畅享高品质' }}</span>
    </header>
    <main class="main">
      <section class="main-header">
        <div v-for="(item, index) in selects" :key="item.text" :class="{'main-header-active': currentHeader === index}" class="main-header-item" @click="changeHeader">
          <i :class="item.icon"/>
          <span>{{ item.text }}</span>
        </div>
      </section>
      <scroll ref="scroll" class="scroll">
        <song-list :songs="songs" class="song-list" @select="selectSong"/>
      </scroll>
    </main>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Scroll from '@/base/scroll'
import SongList from '@/base/songList'
import Song from '@/common/js/song'
import { playlistMixin } from '@/common/js/mixin'
export default {
  name: 'User',
  components: {
    Scroll,
    SongList
  },
  mixins: [playlistMixin],
  data() {
    return {
      selects: [
        {
          icon: 'icon-heart-o',
          text: '我喜欢'
        },
        {
          icon: 'icon-clock-o',
          text: '最近播放'
        }
      ],
      currentHeader: 0,
      songs: []
    }
  },
  computed: {
    ...mapGetters(['userName', 'userAvator', 'playHistory', 'favoriteList'])
  },
  watch: {
    currentHeader(newValue) {
      this.songs = newValue ? this.playHistory : this.favoriteList
    }
  },
  mounted() {
    this.songs = this.favoriteList
  },
  methods: {
    ...mapActions(['insertSong']),
    handlePlaylist(playlist) {
      // 底部播放器自适应高度
      const height = playlist.length > 0 ? '25rem' : ''
      this.$refs.scroll.$el.style.height = height
      this.$refs.scroll.refresh()
      // refresh 重新计算高度
    },
    changeHeader(event) {
      // songlist 中传入的值是对应的值
      if (event.currentTarget.parentNode.children[0] === event.currentTarget) this.currentHeader = 0
      else this.currentHeader = 1
    },
    login() {
      if (!this.userName) {
        this.$router.push({ name: 'Login' })
      }
    },
    selectSong(song) {
      console.log('sssss')
      this.insertSong(new Song(song))
    }
  }
}
</script>
<style scoped>
.user-img {
  width: 3rem;
  border-radius: 50%;
}
.user {
  text-align: center;
  padding: 1rem;
}
.main {
  margin: 0 auto;
  width: 90%;
}
.main-header {
  display: flex;
  flex-direction: row;
  box-shadow: 2px 2px 2px 1px #eee, 0 -1px 1px #eee;
  border-radius: .4rem;
}
.main-header-item {
  padding: 1rem 0;
  width: 50%;
  text-align: center;
}
.main-header > :first-child {
  /* border-right: 1px solid #eee; */
}
.main-header-active {
  box-shadow: 1px 1px 1px 1px #999;
  border-radius: .4rem;
}
.scroll {
  position: relative;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  margin: 1rem 0;
  height: 26rem;
}
</style>
