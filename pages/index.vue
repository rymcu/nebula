<template>
  <div>
    <pc-main-view v-if="!isMobile"/>
    <mobile-main-view v-else/>
  </div>
</template>

<script>
import PcMainView from '~/components/layouts/pc/main.vue'
import MobileMainView from '~/components/layouts/mobile/main.vue'

export default {
  components: {
    PcMainView,
    MobileMainView
  },
  computed: {
    theme() {
      return this.$store.state.theme
    },
    isMobile() {
      return this.$store.state.isMobile
    }
  }
}
</script>

<style>
  .el-header {
    padding-bottom: 1rem;
    background: #fff;
    border-bottom: 1px solid rgba(0, 40, 100, 0.12);
    z-index: 80;
  }

  .el-main {
    padding: 20px 0;
    background-attachment: fixed;
    min-height: 280px;
    margin-bottom: 60px;
    overflow-x: hidden;
  }

  .el-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;
    background: #fff;
    border-top: 1px solid rgba(0, 40, 100, 0.12);
    z-index: 80;
  }
</style>
