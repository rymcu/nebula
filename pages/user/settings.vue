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
            <span slot="title">基本信息</span>
          </el-menu-item>
<!--          <el-menu-item index="avatar">-->
<!--            <i class="el-icon-picture-outline-round"></i>-->
<!--            <span slot="title">我的头像</span>-->
<!--          </el-menu-item>-->
          <el-menu-item index="security">
            <i class="el-icon-unlock"></i>
            <span slot="title">账户安全</span>
          </el-menu-item>
          <el-menu-item index="login-record">
            <i class="el-icon-monitor"></i>
            <span slot="title">登录记录</span>
          </el-menu-item>
          <el-menu-item v-show="false" index="notification">
            <i class="el-icon-bell"></i>
            <span slot="title">通知方式</span>
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
    middleware: 'auth',
    computed: {
      getActiveMenu () {
        return this.$store.state.activeMenu;
      },
      isLogin () {
        return this.$store.state.auth.user;
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
