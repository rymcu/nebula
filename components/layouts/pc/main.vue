<template>
  <el-container>
    <el-header>
      <header-view/>
    </el-header>
    <el-main>
      <aside-view key="aside"/>
    </el-main>
    <el-footer>
      <footer-view/>
    </el-footer>
  </el-container>
</template>

<script>
  import HeaderView from "./header";
  import FooterView from "./footer";
  import AsideView from './aside/main';

  export default {
    name: "PcMain",
    components: {
      HeaderView,
      FooterView,
      AsideView
    }
  }
</script>

<style scoped>

</style>
