<template>
  <vue-scroll
      ref="VueScroll"
      class="scroll-pane"
      :ops="ops"
      :style="'width:' + scrollWidth + ';height:' + scrollHeight">
    <slot/>
  </vue-scroll>
</template>

<script>
  export default {
    name: "ScrollPane",
    props: {
      hasX: {
        type: Boolean,
        default: false
      },
      hasY: {
        type: Boolean,
        default: true
      },
      scrollWidth: {
        type: String,
        default: '100%'
      },
      scrollHeight: {
        type: String,
        default: '100%'
      }
    },
    data() {
      return {
        ops: {
          vuescroll: {
            wheelScrollDuration: 300
          },
          scrollPanel: {
            scrollingX: this.hasX,
            scrollingY: this.hasY,
            speed: 800
          },
          bar: {
            onlyShowBarOnScroll: false,
            background: '#C1C1C1',
          },
          rail: {
            onlyShowBarOnScroll: false,
            background: '#C1C1C1',
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '../scss/index';

  .scroll-pane {
    .__bar-is-vertical:hover, .__bar-is-horizontal:hover {
      background: #A8A8A8 !important;
    }
  }
</style>
