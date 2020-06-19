<template>
  <el-container>
    <el-header>
      <header-view/>
    </el-header>
    <el-main>
      <!--      <nuxt></nuxt>-->
    </el-main>
    <el-footer>
      <footer-view/>
    </el-footer>
  </el-container>
</template>

<script>
  import HeaderView from "./header";
  import FooterView from "./footer";

  export default {
    name: "PcMain",
    components: {
      HeaderView,
      FooterView
    }
  }
</script>

<style scoped>

</style>
