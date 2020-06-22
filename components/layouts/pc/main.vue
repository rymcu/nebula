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
    name: "PcMain",
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

</style>
