<template>
  <el-container>
    <el-header>
      <mobile-header/>
    </el-header>
    <el-main>
      <!--      <nuxt></nuxt>-->
    </el-main>
    <el-footer>
      <mobile-footer/>
    </el-footer>
  </el-container>
</template>

<script>
  import MobileHeader from "./header";
  import MobileFooter from "./footer";

  export default {
    name: "mobileMain",
    components: {MobileFooter, MobileHeader}
  }
</script>

<style scoped>

</style>
