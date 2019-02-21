export function testPass(str) {
  const reg = /^(?=.*\d)(?=.*[a-z|A-Z])[a-zA-Z0-9]{5,10}$/
  return reg.test(str)
}
export function testNmae(str) {
  return !!+str.length
}
