function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function shuffle(arr) {
  const _arr = arr.slice()
  // .slice() 赋值数组，这一步一定要有，要不然会改变arr
  for (let i = 0; i < _arr.length; i++) {
    const j = getRandomInt(0, i)
    const temp = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = temp
  }
  return _arr
}
export function findIndex(list, target) {
  return list.findIndex(item => item.id === target.id)
}
