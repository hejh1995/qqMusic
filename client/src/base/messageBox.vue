<template>
  <div>
    <div class="draw-bg"/>
    <main class="main">
      <section class="content">
        <slot/>
      </section>
      <section class="btns">
        <button class="btn btn-red" @click="$emit('clear')">取消</button>
        <button class="btn btn-green" @click="$emit('save')">确定</button>
      </section>
    </main>
  </div>
</template>
<script>

export default {
  name: 'MessageBox'
}
</script>
<style scoped>
.draw-bg {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  /* background: #999; */
  background-color: rgba(234, 234, 234, 0.75);
}
.main {
  margin: 1rem auto;
  position: relative;
  top: 50%;
  transform: translateY(50%);
  background-color: #fff;
  width: 80%;
  border-radius: 1rem;
}
.btns {
  display: flex;
  flex-direction: row;
}
.btn {
  width: 5rem;
  height: 2rem;
}
.content {
  padding: 1rem;
  text-align: center;
}
</style>
