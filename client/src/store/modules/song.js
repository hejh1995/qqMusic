import { playMode } from '@/common/js/config'
import { shuffle, findIndex } from '@/common/js/util'
import { saveFavorite, delFavorite, savePlay, loadFavorite, loadPlay } from '@/common/js/cache'

const song = {
  state: {
    fullScreen: false,
    playing: false,
    playList: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    favoriteList: loadFavorite(),
    playHistory: loadPlay()
  },
  mutations: {
    SET_FULLSCREEN_STATE: (state, flag) => {
      state.fullScreen = flag
    },
    SET_PLAYING_STATE: (state, flag) => {
      state.playing = flag
    },
    SET_PLAY_LIST: (state, data) => {
      state.playList = data
    },
    SET_SEQUENCE_LIST: (state, data) => {
      state.sequenceList = data
    },
    SET_MODE: (state, data) => {
      state.mode = data
    },
    SET_CURRENT_INDEX: (state, data) => {
      state.currentIndex = data
    },
    SET_FAVORITE_LIST: (state, data) => {
      state.favoriteList = data
    },
    SET_PLAY_HISTORY: (state, data) => {
      state.playHistory = data
    }
  },
  actions: {
    selectPlay: ({ commit, state }, { list, index }) => {
      commit('SET_SEQUENCE_LIST', list)
      if (state.mode === playMode.random) {
        const song = list[index]
        list = shuffle(list)
        index = findIndex(list, song)
      }
      commit('SET_PLAY_LIST', list)
      commit('SET_CURRENT_INDEX', index)
      commit('SET_FULLSCREEN_STATE', true)
      commit('SET_PLAYING_STATE', true)
    },
    randomPlay: ({ commit }, { list }) => {
      commit('SET_PLAY_MODE', playMode.random)
      commit('SET_SEQUENCE_LIST', list)
      commit('SET_PLAY_LIST', shuffle(list))
      commit('SET_CURRENT_INDEX', 0)
      commit('SET_FULLSCREEN_STATE', true)
      commit('SET_PLAYING_STATE', true)
    },
    deleteFavorite: ({ commit }, song) => {
      commit('SET_FAVORITE_LIST', delFavorite(song))
    },
    addFavorite: ({ commit }, song) => {
      commit('SET_FAVORITE_LIST', saveFavorite(song))
    },
    savePlayHistory: ({ commit }, song) => {
      commit('SET_PLAY_HISTORY', savePlay(song))
    },
    deleteSongList: ({ commit }) => {
      commit('SET_CURRENT_INDEX', -1)
      commit('SET_PLAY_LIST', [])
      commit('SET_SEQUENCE_LIST', [])
      commit('SET_PLAYING_STATE', false)
    },
    deleteSong: ({ commit, state }, song) => {
      const playList = state.playList.slice()
      let currentIndex = state.currentIndex
      const currentSong = playList[currentIndex]
      const playing = state.playing
      const sequenceList = state.sequenceList.slice()
      const pIndex = findIndex(playList, song)
      const sIndex = findIndex(sequenceList, song)
      playList.splice(pIndex, 1)
      sequenceList.splice(sIndex, 1)
      // 删除的歌曲，比一定是正在播放的歌曲。如果删除正在播放的前面的歌曲，currentIndex---
      // 如果是后面的，不管
      if (currentIndex > pIndex || currentIndex === playList.length) currentIndex--
      commit('SET_SEQUENCE_LIST', sequenceList)
      commit('SET_PLAY_LIST', playList)
      commit('SET_CURRENT_INDEX', currentIndex)
      if (!playList.length) commit('SET_PLAYING_STATE', false)
      else commit('SET_PLAYING_STATE', true)
      // 如果删除的不是正在播放的，播放状态不变
      if (currentSong.id === playList[currentIndex].id) commit('SET_PLAYING_STATE', playing)
    },
    insertSong: ({ commit, state }, song) => {
      const playList = state.playList.slice()
      let currentIndex = state.currentIndex
      const currentSong = playList[currentIndex]
      const sequenceList = state.sequenceList.slice()
      const fpIndex = findIndex(playList, song)
      // 插入数据，所以++
      currentIndex++
      playList.splice(currentIndex, 0, song)
      if (fpIndex > -1) {
        if (currentIndex > fpIndex) {
          // 如果当前插入的序号大于列表中的序号
          playList.splice(fpIndex, 1)
          currentIndex--
        } else {
          playList.splice(fpIndex + 1, 1)
        }
      }
      //
      const currentSIndex = findIndex(sequenceList, currentSong) + 1
      const fsIndex = findIndex(sequenceList, song)
      sequenceList.splice(currentSIndex, 0, song)
      if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
          sequenceList.splice(fsIndex, 1)
        } else {
          sequenceList.splice(fsIndex + 1, 1)
        }
      }
      //
      commit('SET_SEQUENCE_LIST', sequenceList)
      commit('SET_PLAY_LIST', playList)
      commit('SET_CURRENT_INDEX', currentIndex)
      commit('SET_PLAYING_STATE', true)
      commit('SET_FULLSCREEN_STATE', true)
    }
  }
}
export default song
