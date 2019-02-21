<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-bg" r="50" cx="50" cy="50" fill="transparent"/>
      <circle :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset" class="progress-bar" r="50" cx="50" cy="50" fill="transparent"/>
      <!-- fill 组件的填充颜色
r 是半径， cx，cy是圆点坐标
stroke-dasharray 属性用来设置描边的点划线的图案范式。就是设置实线和虚线的宽度，两个数字就是，一个实线一个虚线。
stroke-dashoffset 就是实线虚线绘制的起点距路径开始的距离 ，把绘制的线左移多少-->
    </svg>
    <slot/>
  </div>
</template>
<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    dashOffset() {
      return (1 - this.percent) * this.dashArray
    }
  }
}
</script>
<style scoped>
.progress-circle {
  position: relative;
}
circle {
  stroke-width: 6px;
  /* stroke-width ，边框的宽度 */
  transform-origin: center;
}
.progress-bg {
  transform: scale(0.9);
  stroke: #31c27c;
  /* stroke 边框颜色  */
}
.progress-bar {
  transform: scale(0.8) rotate(-90deg);
  stroke-width: .6rem;
  stroke: #31c27c;
}
</style>
