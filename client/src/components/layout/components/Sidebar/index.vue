<template>
  <div v-if="sidebar" class="sidebar-wrapper">
    <ul class="bars">
      <li v-for="item in bars" :key="item.text" class="bar-item">
        <p>{{ item.text }}</p>
        <section v-if="item.action === '个数'">
          <span v-if="item.num > 0" class="baritem-num">{{ item.num }}</span>
        </section>
        <section v-if="item.action === '开关'" @click="toggleBtn(item.text)">
          <i :class="item.toggleIcon"/>
        </section>
        <section v-if="item.rightText" class="item-right-text">{{ item.rightText }}</section>
      </li>
    </ul>
    <footer ref="footer" class="footer">
      <article v-for="item in footerBtn" :key="item.text" class="footer-item" @click="footerAction(item.text)">
        <i :class="item.icon"/>
        <span>{{ item.text }}</span>
      </article>
    </footer>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { logout } from '@/api/user'
import { playlistMixin } from '@/common/js/mixin'

export default {
  name: 'Sidebar',
  mixins: [playlistMixin],
  data() {
    return {
      bars: [
        {
          text: '个性装扮',
          rightText: '默认套装'
        },
        {
          text: '消息中心',
          action: '个数',
          num: 1
        },
        {
          text: '定时关闭',
          action: '开关',
          toggleIcon: 'icon-toggle-off'
        },
        {
          text: '流量提醒',
          action: '开关',
          toggleIcon: 'icon-toggle-off'
        },
        {
          text: '帮助反馈'
        }
      ],
      footerBtn: [
        {
          text: '设置',
          icon: 'icon-cog'
        },
        {
          text: '退出登录',
          icon: 'icon-caret-square-o-left'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  methods: {
    ...mapMutations({
      'logoutClient': 'CLEAR_USER',
      'closeSidebar': 'CLOSE_SIDEBAR'
    }),
    handlePlaylist(playlist) {
      // 底部播放器自适应高度
      const bottom = playlist.length > 0 ? '5rem' : ''
      this.$refs.footer.style.bottom = bottom
    },
    toggleBtn(item) {
      console.log(item)
      this.bars.forEach(bar => {
        if (bar.text === item) {
          bar.toggleIcon = bar.toggleIcon === 'icon-toggle-off' ? 'icon-toggle-on' : 'icon-toggle-off'
        }
      })
    },
    footerAction(action) {
      if (action === '设置') {
        console.log('she-zhi')
      } else if (action === '退出登录') {
        // 登录需要设置session，此时要通过API，从后台登出。
        logout().then(res => {
          this.logoutClient()
        })
      }
      this.closeSidebar()
    }
  }
}
</script>
<style scoped>
.sidebar-wrapper {
  position: absolute;
  width: 80%;
  height: 100vh;
  background-color: #fff;
  z-index: 999;
}
.footer {
  position: absolute;
  bottom: 0;
  border-top: 1px solid #999;
  width: 90%;
  display: flex;
  justify-content: space-around;
  margin: 1rem;
}
.bar-item {
  display: flex;
  margin: 1.2rem;
  justify-content: space-between;
}
.footer-item {
  margin-top: .6rem;
}
.baritem-num {
  background-color: red;
  border-radius: 50%;
  display: inline-block;
  width: 1.2rem;
  height: 1.2rem;
  line-height: 1.2rem;
  color: #fff;
  text-align: center;
  font-size: .8rem;
}
.item-right-text {
  color: #999;
}
</style>
