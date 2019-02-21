<template>
  <div class="app-wrapper">
    <!-- 模糊层 -->
    <div v-if="sidebar" class="drawer-bg" @click="closeSidebar"/>
    <!-- 侧边导航栏 -->
    <div class="sidebar">
      <sidebar/>
    </div>
    <div class="main-container">
      <div class="nav-bar"><navbar/></div>
      <div class="app-Main"><app-main/></div>
    </div>
  </div>
</template>
<script>
import { Sidebar, AppMain, Navbar } from './components'
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'Latout',
  components: {
    Navbar,
    AppMain,
    Sidebar
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  methods: {
    ...mapMutations({
      closeSidebar: 'CLOSE_SIDEBAR'
    })
  }
}
</script>
<style scoped>
.nav-bar {
  position: fixed;
  width: 100%;
  z-index: 9;
}
.app-Main {
  position: relative;
  top: 71px;
  background-color: #fdfdfd;
}
.sidebar {
  position: relative;
  width: 100%;
  height: 100%;
}
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
.drawer-bg {
  background-color: #000;
  opacity: 0.3;
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: 99;
}
</style>
