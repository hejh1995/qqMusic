<template>
  <div class="message-wrapper">
    <div class="draw-bg"/>
    <main class="main">
      <button class="btn btn-red" @click="$emit('close')">X</button>
      <section class="content">
        <p>{{ errorText }}</p>
        <slot/>
      </section>
    </main>
  </div>
</template>
<script>
export default {
  name: 'MessageBox',
  props: {
    errorText: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped>
.draw-bg {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(234, 234, 234, 0.75);
}
.main {
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  background-color: #999;
  width: 80%;
  left: 10%;
  border-radius: .4rem;
  padding: .8rem;
}
.btn {
  width: 1.2rem;
  height: 1.2rem;
  position: absolute;
  top: -1.4rem;
  right: -.6rem;
}
.content {
  /* height: 1.6rem; */
  line-height: 1.6rem;
  letter-spacing: 2px;
}
</style>
