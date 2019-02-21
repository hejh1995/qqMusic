<template>
  <div class="song-list">
    <ul>
      <li v-for="(song, index) in songs" :key="song.id" class="song-item" @click="selectItem(song, index)">
        <div v-show="rank" class="song-rank">
          <p :class="getRankCls(index)">{{ getRankText(index) }}</p>
        </div>
        <div class="song-content">
          <h2 class="song-content-name">{{ song.name }}</h2>
          <p class="song-content-desc">{{ song.singer }}-{{ song.album }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit('select', item, index)
    },
    // 图标的设置很好
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>
<style scoped>
.song-item {
  border-bottom: 1px solid #e6e6e6;
  margin-left: 2rem;
  padding: 1rem 0;
}
.song-content {
  font-size: .9rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.song-content-desc {
  color: #999;
  padding: .4rem 0;
}
.song-list {
  background-color: #fff;
}
</style>
