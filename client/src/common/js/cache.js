import storage from 'good-storage'

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) arr.splice(index, 1)
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
export function saveFavorite(song) {
  const songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => song.id === item.id, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}
export function delFavorite(song) {
  const songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => item.id === song.id)
  storage.set(FAVORITE_KEY, songs)
  return songs
}
// history
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}
export function savePlay(song) {
  const songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}
