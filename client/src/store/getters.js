const getters = {
  sidebar: state => state.app.sidebar,
  userName: state => state.user.name,
  userAvator: state => state.user.avator,
  singer: state => state.singer.singer,
  fullScreen: state => state.song.fullScreen,
  playing: state => state.song.playing,
  playList: state => state.song.playList,
  sequenceList: state => state.song.sequenceList,
  mode: state => state.song.mode,
  currentIndex: state => state.song.currentIndex,
  currentSong: state => state.song.playList[state.song.currentIndex] || {},
  favoriteList: state => state.song.favoriteList,
  playHistory: state => state.song.playHistory
}
export default getters
