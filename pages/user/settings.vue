<template>
  <el-row type="flex" justify="center" :gutter="8">
    <el-col v-if="isLogin" :span="20">
      <el-col :span="4">
        <el-menu
          :default-active="getActiveMenu"
          class="el-menu-vertical-demo"
          @select="handleSelectMenu">
          <el-menu-item index="account">
            <i class="el-icon-s-data"></i>
            <span slot="title">资料与账号</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <nuxt :nuxt-child-key="$route.name" />
      </el-col>
    </el-col>
    <el-col v-else class="text-center">
      <el-alert
        title="用户无权限"
        type="warning"
        center
        show-icon
        :closable="false">
      </el-alert>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "Settings",
    computed: {
      getActiveMenu () {
        return this.$store.state.activeMenu;
      },
      isLogin () {
        return this.$store.state.oauth;
      }
    },
    data() {
      return {}
    },
    methods: {
      handleSelectMenu(item) {
        let _ts = this;
        let activeMenu = _ts.$store.state.activeMenu;
        if (activeMenu !== item) {
          _ts.$store.commit('setActiveMenu', item);
          _ts.$router.push(
            {
              path: `/user/settings/${item}`
            }
          )
        }
      }
    }
  }
</script>

<style scoped>

</style>
