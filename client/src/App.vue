<template>
  <div id="app">
    <layout/>
    <player/>
  </div>
</template>

<script>
import Layout from '@/components/layout'
import Player from '@/components/Player'
export default {
  name: 'App',
  components: {
    Layout,
    Player
  }
}
</script>
