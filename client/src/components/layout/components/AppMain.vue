<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- transition，动态组件 -->
      <keep-alive>
        <!-- keep-alive,要求被切换的组件都有自己的名字。 -->
        <!-- keep-alive,在内部切换的组件会执行actived和deactived两个生命周期钩子函数。 -->
        <router-view :key="key"/>
      </keep-alive>
    </transition>
  </section>
</template>
<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.fullPath
    }
  }
}
</script>
<style scoped>
</style>
