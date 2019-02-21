<template>
  <div class="navbar-wrapper">
    <div class="sidebar" @click="openSidebar">
      <svg xmlns="http://www.w3.org/2000/svg" class="hamburger" viewBox="0 0 1024 1024" width="64" height="64" data-v-4e6f274c="">
        <line x1="100" y1="100" x2="700" y2="100" style="stroke:rgb(255,255,255);stroke-width:60" />
        <line x1="100" y1="500" x2="700" y2="500" style="stroke:rgb(255,255,255);stroke-width:60" />
        <line x1="100" y1="300" x2="700" y2="300" style="stroke:rgb(255,255,255);stroke-width:60" />
      </svg>
    </div>
    <div class="tab">
      <router-link v-for="nav in navs" :key="nav" :to="{ name: nav }" tag="div" class="tab-item">
        <span class="tab-link">{{ navsJsonp[nav] }}</span>
      </router-link>
    </div>
    <div class="search">
      <p class="search-text"><i class="icon-search"/>搜索</p>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'Navbar',
  data() {
    return {
      navs: ['User', 'MusicHall', 'Find'],
      navsJsonp: {
        'User': '我的',
        'MusicHall': '音乐馆',
        'Find': '发现'
      }
    }
  },
  methods: {
    ...mapActions(['openSidebar'])
  }
}
</script>
<style scoped>
.navbar-wrapper {
  background-color: #31c27c;
  color: #fff;
  padding-bottom: .4rem;
}
.tab {
  display: flex;
  justify-content: center;
}
.tab-item {
  margin: .8rem;
}
.router-link-active .tab-link {
  font-weight: 900;
}
.search {
  background-color: #22a566eb;
  width: 96%;
  margin: 0 auto;
}
.search-text {
  text-align: center;
}
.sidebar {
  position:fixed;
  margin-top: .6rem;
}
.hamburger {
  width: 2.6rem;
  height: 2rem;
  cursor: pointer;
  display: inline-block;
}
</style>
