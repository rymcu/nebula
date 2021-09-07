<template>
  <el-row justify="space-between" type="flex">
    <el-col>
      <el-col :xs="8" :sm="4" :md="4" :xl="3" style="padding-top: .5rem;text-align: left;">
        <a rel="nofollow" class="navbar-brand" href="/">
          <img src="@/assets/rymcu.png" alt="RYMCU" class="navbar-brand-img">
        </a>
      </el-col>
      <el-col :xs="0" :sm="8" :md="8" :xl="12" style="text-align: center;">
        <el-row type="flex" justify="center">
          <el-col>
            <el-menu :default-active="activeMenu" style="margin-top: -2px;border: 0;" mode="horizontal"
                     @select="handleSelectMenu">
              <el-menu-item index="index">首页</el-menu-item>
              <el-menu-item index="topic">专题</el-menu-item>
              <el-menu-item index="portfolios">作品集</el-menu-item>
              <el-submenu index="store">
                <template slot="title">RYMCU Store</template>
                <el-menu-item index="taobao">淘宝店铺</el-menu-item>
                <el-submenu index="weixin">
                  <template slot="title">微信</template>
                  <el-menu-item index="mini" style="height: 200px;">
                    <img src="@/assets/weixinStore.jpg" style="width: 200px;"/>
                  </el-menu-item>
                </el-submenu>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="16" :sm="12" :md="12" :xl="9" style="padding-top: 1rem;">
        <client-only>
          <el-col v-if="user" style="text-align: right;">
            <el-popover
              placement="bottom"
              width="400"
              trigger="click"
              v-model="showPopover"
              @show="handleShowPopover">
              <el-input name="searchInput" v-model="queryString" @keyup.enter.native="querySearchAsync"
                        placeholder="搜索文章,作品集,用户">
                <el-button slot="append" @click="querySearchAsync">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                       style="fill: rgba(0, 0, 0, 1);">
                    <path
                      d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                    <path
                      d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z"></path>
                  </svg>
                </el-button>
              </el-input>
              <el-button slot="reference" circle size="small">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                     style="fill: rgba(0, 0, 0, 1);">
                  <path
                    d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                  <path
                    d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z"></path>
                </svg>
              </el-button>
            </el-popover>
            <el-link rel="nofollow" :underline="false" style="padding-left: 10px;padding-right: 10px;"
                     href="/portfolio/post">创建作品集
            </el-link>
            <el-link rel="nofollow" :underline="false" style="padding-left: 10px;padding-right: 10px;"
                     href="/article/post">发帖
            </el-link>
            <el-link rel="nofollow" :underline="false" style="padding-left: 10px;padding-right: 10px;">
              <el-dropdown trigger="click" @command="handleCommand">
                <el-badge :value="notificationNumbers" class="item">
                  <el-link rel="nofollow" :underline="false" style="font-size: 1.4rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                         style="fill: rgba(0, 0, 0, 1);">
                      <path
                        d="M19 13.586V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.185 4.074 5 6.783 5 10v3.586l-1.707 1.707A.996.996 0 0 0 3 16v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a.996.996 0 0 0-.293-.707L19 13.586zM19 17H5v-.586l1.707-1.707A.996.996 0 0 0 7 14v-4c0-2.757 2.243-5 5-5s5 2.243 5 5v4c0 .266.105.52.293.707L19 16.414V17zm-7 5a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22z"></path>
                    </svg>
                  </el-link>
                </el-badge>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="notification in notifications" :key="notification.idNotification"
                                    command="notification">{{ notification.dataSummary }}
                  </el-dropdown-item>
                  <el-dropdown-item command="notification">查看所有消息</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-link>
            <el-link rel="nofollow" :underline="false" style="margin-left: 10px;">
              <el-dropdown trigger="click" @command="handleCommand">
                <el-avatar v-if="avatarURL" size="small" :src="avatarURL"></el-avatar>
                <el-avatar v-else size="small" src="https://static.rymcu.com/article/1578475481946.png"></el-avatar>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item style="align-items: center;">
                    <el-avatar class="mr-3" v-if="avatarURL" size="small" style="margin-top: 1rem;"
                               :src="avatarURL"></el-avatar>
                    <el-avatar class="mr-3" v-else size="small" style="margin-top: 1rem;"
                               src="https://static.rymcu.com/article/1578475481946.png"></el-avatar>
                    <el-link rel="nofollow" :underline="false" style="margin-left: 10px;margin-bottom: 1rem;">
                      {{ nickname }}
                    </el-link>
                  </el-dropdown-item>
                  <el-dropdown-item command="user">个人中心</el-dropdown-item>
                  <el-dropdown-item command="answer">每日一题</el-dropdown-item>
                  <el-dropdown-item command="drafts" divided>我的草稿</el-dropdown-item>
                  <el-dropdown-item command="wallet">我的钱包</el-dropdown-item>
                  <el-dropdown-item command="user-info" divided>设置</el-dropdown-item>
                  <el-dropdown-item v-if="hasPermissions" command="admin-dashboard">系统管理</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-link>
          </el-col>
          <el-col v-else style="text-align: right;">
            <el-popover
              placement="bottom"
              width="400"
              trigger="click"
              v-model="showPopover"
              @show="handleShowPopover">
              <el-input name="searchInput" v-model="queryString" @keyup.enter.native="querySearchAsync"
                        placeholder="搜索文章,作品集,用户">
                <el-button slot="append" @click="querySearchAsync">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                       style="fill: rgba(0, 0, 0, 1);">
                    <path
                      d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                    <path
                      d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z"></path>
                  </svg>
                </el-button>
              </el-input>
              <el-button slot="reference" circle size="small">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                     style="fill: rgba(0, 0, 0, 1);">
                  <path
                    d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                  <path
                    d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z"></path>
                </svg>
              </el-button>
            </el-popover>
            <el-link rel="nofollow" :underline="false" style="margin-left: 10px;" @click="login">登录</el-link>
            <el-link href="/register" rel="nofollow" :underline="false" style="margin-left: 10px;">注册</el-link>
          </el-col>
        </client-only>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';
import {isBrowser} from '~/environment';
// import sockClient from '~/plugins/sockjs';

const Cookie = process.client ? require('js-cookie') : undefined
export default {
  name: "PcHeader",
  computed: {
    ...mapState({
      activeMenu: state => state.activeMenu,
      user: state => state.oauth
    }),
    avatarURL() {
      let _ts = this;
      if (isBrowser) {
        if (!_ts.$store.state.userInfo) {
          let user = localStorage.getItem('user');
          if (user) {
            _ts.$store.commit('setUser', JSON.parse(user))
          }
        }
      }
      return _ts.$store.state.userInfo?.avatarURL;
    },
    nickname() {
      let _ts = this;
      if (isBrowser) {
        if (!_ts.$store.state.userInfo) {
          let user = localStorage.getItem('user');
          if (user) {
            _ts.$store.commit('setUser', JSON.parse(user))
          }
        }
      }
      return _ts.$store.state.userInfo?.nickname;
    },
    account() {
      let _ts = this;
      if (isBrowser) {
        if (!_ts.$store.state.userInfo) {
          let user = localStorage.getItem('user');
          if (user) {
            _ts.$store.commit('setUser', JSON.parse(user))
          }
        }
      }
      return _ts.$store.state.userInfo?.account;
    },
    hasPermissions() {
      return this.$store.getters.hasPermissions('blog_admin');
    }
  },
  data() {
    return {
      queryString: '',
      timeout: null,
      show: false,
      notifications: [],
      notificationNumbers: "",
      showPopover: false,
      autofocus: false
    };
  },
  watch: {
    user: function () {
      this.getUnreadNotifications();
    }
  },
  methods: {
    querySearchAsync() {
      this.$router.push({
        path: `/search?q=${this.queryString}`
      })
      this.$set(this, 'showPopover', false);
      this.$set(this, 'queryString', '');
    },
    handleShowPopover() {
      setTimeout(function () {
        document.getElementsByName("searchInput")[0].focus()
      }, 500);
    },
    handleSelectMenu(item) {
      let _ts = this;
      let activeMenu = _ts.$store.state.activeMenu;
      if (activeMenu !== item) {
        switch (item) {
          case 'topic':
            _ts.$router.push({
              path: '/topic/news?page=1'
            })
            break;
          case 'portfolios':
            _ts.$router.push({
              path: '/portfolios?page=1'
            })
            break;
          case 'github':
            window.open("https://github.com/rymcu");
            break;
          case 'taobao':
            window.open("https://rymcu.taobao.com?utm_source=rymcu.com");
            break;
          default:
            _ts.$router.push(
              {
                path: '/'
              }
            )
        }
      }
    },
    handleCommand(item) {
      let _ts = this;
      switch (item) {
        case 'user':
          _ts.$router.push({
            path: '/user/' + _ts.account
          })
          break;
        case 'user-info':
          _ts.$router.push({
            path: '/user/settings/account'
          })
          break;
        case 'logout':
          Cookie.remove('auth')
          _ts.$store.commit('setAuth', null)
          item = 'login';
          break;
        default:
          _ts.$router.push({
            name: item
          })
      }
    },
    getUnreadNotifications() {
      let _ts = this;
      if (_ts.user) {
        _ts.$axios.$get('/api/notification/unread').then(function (res) {
          if (res) {
            _ts.$set(_ts, 'notifications', res.notifications);
            _ts.$set(_ts, 'notificationNumbers', res.notifications.length == 0 ? "" : res.notifications.length);
          }
        })
      }
    },
    login() {
      this.$router.push({
        path: '/login',
        query: {
          historyUrl: window.location.href
        }
      })
    }
  },
  mounted() {
    let _ts = this;
    let user = _ts.user;
    if (user) {
      _ts.getUnreadNotifications();
      _ts.$store.dispatch('follow/fetchUserFollowerList');
      _ts.$store.dispatch('follow/fetchUserFollowingList');
      // sockClient.initSocket(this.$store.state.userInfo);
    }
  }

}
</script>

<style scoped>
.navbar-brand {
  color: inherit;
  margin-right: 1rem;
  font-size: 1.25rem;
  white-space: nowrap;
  font-weight: 600;
  padding: 0;
  transition: .3s opacity;
  line-height: 3rem;
}

.navbar-brand-img {
  height: 3rem;
  line-height: 3rem;
  vertical-align: top;
  width: auto;
}

.search-result-box {
  min-width: 20vw !important;
}

.search-result-type {
  padding-right: 5px;
}
</style>
