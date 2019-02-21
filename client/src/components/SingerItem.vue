<template>
  <transition name="slide">
    <music-list :bg-image="singer.avator" :songs="songs" @changeTitleStyle="changeTitleStyle">
      <h1 ref="title" class="title title-normal">{{ singer.name }}</h1>
    </music-list>
  </transition>
</template>
<script>
import MusicList from '@/components/MusicList'
import { getSingerDetail } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import { createSong } from '@/common/js/song'
import { mapGetters } from 'vuex'

export default {
  components: {
    MusicList
  },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters(['singer'])
  },
  mounted() {
    this._getSingerDetail()
  },
  methods: {
    changeTitleStyle(value) {
      this.$refs.title.className = `title title-${value}`
    },
    _getSingerDetail() {
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._nomalizeSongs(res.data.list)
        }
      })
    },
    _nomalizeSongs(list) {
      const res = []
      list.forEach(item => {
        const { musicData } = item
        if (musicData.songid && musicData.albummid) {
          res.push(createSong(musicData))
        }
      })
      return res
    }
  }
}
</script>
<style>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s
}
.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0)
}
.title {
  position: absolute;
  text-align: center;
  width: 100%;
  color: #fff;
}
.title-normal {
  font-size: 2rem;
  bottom: 2rem;
}
.title-up {
  font-size: 1rem;
  top: 1rem;
}
</style>
