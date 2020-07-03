<template>
  <el-container>
    <el-header>
      <header-view/>
    </el-header>
    <el-main>
      <nuxt :nuxt-child-key="$route.name" />
    </el-main>
    <el-footer>
      <footer-view/>
    </el-footer>
  </el-container>
</template>

<script>
  import { mapState } from 'vuex'
  import HeaderView from "./header";
  import FooterView from "./footer";

  export default {
    name: "MobileMain",
    components: {
      HeaderView,
      FooterView
    },
    computed: {
      ...mapState('global', [])
    }
  }
</script>

<style scoped>
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
