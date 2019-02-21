import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from '@/common/js/config'
import { shuffle } from '@/common/js/util'

export const playerMixin = {
  computed: {
    ...mapGetters([
      'playList',
      'currentSong',
      'currentIndex',
      'mode',
      'sequenceList',
      'favoriteList'
    ]),
    modeIcon() {
      return this.mode === playMode.sequence ? 'icon-arrow-circle-o-down' : this.mode === playMode.loop ? 'icon-refresh' : 'icon-random'
    }
  },
  methods: {
    ...mapMutations({
      setPlaying: 'SET_PLAYING_STATE',
      setPlayMode: 'SET_MODE',
      setplaylist: 'SET_PLAY_LIST',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    ...mapActions(['addFavorite', 'deleteFavorite']),
    getFavoriteIcon(song) {
      // console.log('dfghj')
      if (this._isFavorite(song)) return 'icon-heart-red'
      return 'icon-heart-white'
    },
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this._resetCurrentIndex(list)
      this.setplaylist(list)
    },
    toggleFavorite(song) {
      if (this._isFavorite(song)) this.deleteFavorite(song)
      else this.addFavorite(song)
    },
    _isFavorite(song) {
      const index = this.favoriteList.find(item => item.id === song.id)
      return !!index
    },
    _resetCurrentIndex(list) {
      const m = list.findIndex(item => item.id === this.currentSong.id)
      this.setCurrentIndex(m)
    }
  }
}
export const playlistMixin = {
  // 实现缩小播放器后，内容还能够自适应
  // handlePlaylist 是具体的计算高度的函数，所以需要在各自的组件里实现
  computed: {
    ...mapGetters(['playList'])
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    // activated 在keep-alive组件激活时调用
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList(newvalue) {
      this.handlePlaylist(newvalue)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}
