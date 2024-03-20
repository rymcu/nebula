<template>
  <el-row type="flex" justify="center" :gutter="8">
    <el-col v-if="hasPermissions" :span="20">
      <el-col :span="4" v-if="menus">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          @select="handleSelectMenu">
          <template v-for="menu in menus">
            <el-menu-item v-if="!(menu.isEdit)||false" :key="menu.name" :index="menu.name">
              <i :class="menu.icon"></i>
              <span slot="title">{{ menu.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <el-card>

          <el-row>
            <el-tabs :value="editableTabsValue" type="card" @tab-remove="handleRemoveTab" @tab-click="handleClick">
              <el-tab-pane
                :key="item.name"
                v-for="(item, index) in editableTabs"
                :label="item.title"
                :name="item.name"
                :closable="item.closable">
              </el-tab-pane>
            </el-tabs>

          </el-row>
          <el-row>
            <nuxt-child keep-alive
                        :keep-alive-props="{include: editableTabs}"/>
          </el-row>

        </el-card>
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
import _ from 'lodash'
import {mapState} from 'vuex';

export default {
  name: "Admin",
  middleware: 'auth',
  data() {
    return {
      menus: [
        {
          title: 'Dashboard',
          name: 'admin-dashboard',
          path: '/admin/dashboard',
          icon: 'el-icon-s-data',
          closable: false
        },
        {
          title: '文章管理',
          name: 'admin-articles',
          path: '/admin/articles',
          icon: 'el-icon-tickets',
          closable: true
        },
        {
          title: '评论管理',
          name: 'admin-comments',
          path: '/admin/comments',
          icon: 'el-icon-chat-line-square',
          closable: true
        },
        {
          title: '用户管理',
          name: 'admin-users',
          path: '/admin/users',
          icon: 'el-icon-s-custom',
          closable: true
        },
        {
          title: '角色管理',
          name: 'admin-roles',
          path: '/admin/roles',
          icon: 'el-icon-s-check',
          closable: true
        },
        {
          title: '专题管理',
          name: 'admin-topics',
          path: '/admin/topics',
          icon: 'el-icon-postcard',
          closable: true
        },
        {
          title: '标签管理',
          name: 'admin-tags',
          path: '/admin/tags',
          icon: 'el-icon-price-tag',
          closable: true
        },
        {
          title: '银行管理',
          name: 'admin-banks',
          path: '/admin/banks',
          icon: 'el-icon-office-building',
          closable: true
        },
        {
          title: '银行卡管理',
          name: 'admin-bank-accounts',
          path: '/admin/bank-accounts',
          icon: 'el-icon-bank-card',
          closable: true
        },
        {
          title: '货币规则',
          name: 'admin-currency-rules',
          path: '/admin/currency-rules',
          icon: 'el-icon-document',
          closable: true
        },
        {
          title: '产品管理',
          name: 'admin-products',
          path: '/admin/products',
          icon: 'el-icon-box',
          closable: true
        },
        {
          title: '产品编辑',
          name: 'admin-product-post-product_id',
          path: '/admin/product/post/:id?',
          icon: 'el-icon-postcard',
          closable: true,
          isEdit: true
        }
      ]
    }
  },
  computed: {
    ...mapState({
      editableTabs() {
        return this.$store.state.admin.tabs;
      },
      editableTabsValue() {
        return this.$store.state.admin.activeTab;
      },
      activeMenu: state => state.activeMenu,
      hasPermissions() {
        return this.$auth.hasScope('admin') || this.$auth.hasScope('blog_admin');
      }
    })
  },
  methods: {
    handleRemoveTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.$store.commit('admin/updateTags', tabs.filter(tab => tab.name !== targetName))

      this.handleSelectMenu(activeName)
    },
    handleClick(item) {
      this.handleSelectMenu(item.name)
    },
    handleSelectTab(item) {
      let _ts = this
      this.$store.commit('admin/updateActiveTab', item);
      let reset = '0'
      let result = _.findIndex(_ts.editableTabs, function (tab) {
        return tab.name === item;
      })
      if (result === -1) {
        let index = _.findIndex(_ts.menus, function (menu) {
          return menu.name === item;
        })
        _ts.$store.commit('admin/pushTags', _ts.menus[index])
        reset = '1'
      }
      let params = _ts.$route.params
      params.reset = reset
      let query = _ts.$route.query
      _ts.$router.push({
        name: item,
        params,
        query
      })
    },
    handleSelectMenu(item) {
      let _ts = this;
      let activeMenu = _ts.$store.state.activeMenu;
      if (activeMenu !== item) {
        _ts.$store.commit('setActiveMenu', item);
        _ts.handleSelectTab(item)
      }
    }
  },
  mounted() {
    this.handleSelectMenu(this.$route.name)
  }
}
</script>

<style scoped>

</style>
