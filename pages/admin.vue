<template>
  <el-row type="flex" justify="center" :gutter="8">
    <el-col v-if="hasPermissions" :span="20">
      <el-col :span="4">
        <el-menu
          :default-active="getActiveMenu"
          class="el-menu-vertical-demo"
          @select="handleSelectMenu">
          <el-menu-item index="admin-dashboard">
            <i class="el-icon-s-data"></i>
            <span slot="title">Dashboard</span>
          </el-menu-item>
          <el-menu-item index="admin-users">
            <i class="el-icon-s-custom"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="admin-roles">
            <i class="el-icon-s-check"></i>
            <span slot="title">角色管理</span>
          </el-menu-item>
          <el-menu-item index="admin-topics">
            <i class="el-icon-postcard"></i>
            <span slot="title">专题管理</span>
          </el-menu-item>
          <el-menu-item index="admin-tags">
            <i class="el-icon-postcard"></i>
            <span slot="title">标签管理</span>
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
    name: "Admin",
    computed: {
      getActiveMenu () {
        return this.$store.state.activeMenu;
      },
      hasPermissions () {
        return this.$store.getters.hasPermissions('blog_admin');
      }
    },
    methods: {
      handleSelectMenu(item) {
        let _ts = this;
        let activeMenu = _ts.$store.state.activeMenu;
        if (activeMenu !== item) {
          _ts.$store.commit('setActiveMenu', item);
          _ts.$router.push(
            {
              name: item
            }
          )
        }
      }
    }
  }
</script>

<style scoped>

</style>
