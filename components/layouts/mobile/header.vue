<template>
  <el-row justify="space-between" type="flex">
    <el-col :span="24">
      <el-col :xs="8" :sm="4" :md="4" :xl="3" style="padding-top: .5rem;">
        <a class="navbar-brand" href="/" rel="nofollow">
          <img src="@/assets/rymcu.png" alt="RYMCU" class="navbar-brand-img">
        </a>
      </el-col>
      <el-col :xs="0" :sm="12" :md="8" :xl="8" style="text-align: center;">
        <el-row type="flex" justify="center">
          <el-col>
            <el-menu :default-active="activeMenu" style="margin-top: -2px;border: 0;" mode="horizontal"
                     @select="handleSelectMenu">
              <el-menu-item index="index">首页</el-menu-item>
              <el-menu-item index="topic">专题</el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="16" :sm="8" :md="6" :xl="3" style="padding-top: 1rem;">
        <client-only>
          <el-col v-if="loggedIn" style="text-align: right;">
            <el-link rel="nofollow" :underline="false" style="padding-left: 10px;padding-right: 10px;"
                     href="/article/post">发帖
            </el-link>
            <el-link rel="nofollow" :underline="false" style="padding-left: 10px;padding-right: 10px;">
              <el-dropdown trigger="click" @command="handleCommand">
                <el-badge :value="notificationNumbers" class="item">
                  <el-link rel="nofollow" :underline="false" style="font-size: 1.4rem;" class="el-icon-bell"></el-link>
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
                <el-avatar v-if="loggedIn" size="small" :src="user.avatarUrl"></el-avatar>
                <el-avatar v-else size="small" src="https://static.rymcu.com/article/1578475481946.png"></el-avatar>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="user" style="align-items: center;">
                    <el-avatar class="mr-3" v-if="user.avatarUrl" size="small" style="margin-top: 1rem;"
                               :src="loggedIn"></el-avatar>
                    <el-avatar class="mr-3" v-else size="small" style="margin-top: 1rem;"
                               src="https://static.rymcu.com/article/1578475481946.png"></el-avatar>
                    <el-link rel="nofollow" :underline="false" style="margin-left: 10px;margin-bottom: 1rem;">
                      {{ user.nickname }}
                    </el-link>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="hasPermissions" command="admin-dashboard">系统管理</el-dropdown-item>
                  <el-dropdown-item command="user-info">资料与账号</el-dropdown-item>
                  <el-dropdown-item command="drafts">我的草稿</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-link>
          </el-col>
          <el-col v-else style="text-align: right;">
            <nuxt-link to="/login">
              <el-link rel="nofollow" :underline="false" style="margin-left: 10px;">登录</el-link>
            </nuxt-link>
            <nuxt-link to="/register">
              <el-link rel="nofollow" :underline="false" style="margin-left: 10px;">注册</el-link>
            </nuxt-link>
          </el-col>
        </client-only>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "MobileHeader",
  computed: {
    ...mapState({
      activeMenu: state => state.activeMenu,
      user: state => state.auth.user,
      loggedIn: state => state.auth.loggedIn
    }),
    hasPermissions() {
      return this.$auth.hasScope('blog_admin');
    }
  },
  data() {
    return {
      restaurants: [],
      state: '',
      timeout: null,
      show: false,
      notifications: [],
      notificationNumbers: ""
    };
  },
  watch: {
    user: function () {
      this.getUnreadNotifications();
    }
  },
  methods: {
    handleSelectMenu(item) {
      let _ts = this;
      let activeMenu = _ts.$store.state.activeMenu;
      if (activeMenu !== item) {
        switch (item) {
          case 'topic':
            _ts.$router.push({
              path: '/topic/news'
            })
            break;
          case 'github':
            window.open("https://github.com/rymcu");
            return false;
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
            path: '/user/' + _ts.user.account
          })
          break;
        case 'user-info':
          _ts.$router.push({
            path: '/user/settings/account'
          })
          break;
        case 'logout':
          _ts.$auth.reset()
          item = 'login';
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
            _ts.$set(_ts, 'notificationNumbers', res.pagination.total === 0 ? "" : res.pagination.total);
          }
        })
      }
    },
    browserFingerprint() {
      let _ts = this
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      let txt = 'https://rymcu.com/';
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.textBaseline = "rymcu";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText(txt, 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText(txt, 4, 17);
      let b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
      let bin = atob(b64);
      let fingerprint = _ts.bin2hex(bin.slice(-16, -12));
      _ts.$store.commit('setFingerprint', fingerprint);
    },
    bin2hex(str) {
      let _ts = this
      let result = "";
      for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        // 高字节
        result += _ts.byte2Hex(c >> 8 & 0xff);
        // 低字节
        result += _ts.byte2Hex(c & 0xff);
      }
      return result;
    },
    byte2Hex(b) {
      if (b < 0x10) {
        return "0" + b.toString(16);
      } else {
        return b.toString(16);
      }
    }
  },
  mounted() {
    let _ts = this
    let user = _ts.user;
    if (user) {
      _ts.getUnreadNotifications();
    }
    let fingerprint = _ts.$store.state.fingerprint
    if (!fingerprint) {
      _ts.browserFingerprint();
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
  line-height: 2rem;
}

.navbar-brand-img {
  height: 2rem;
  line-height: 2rem;
  vertical-align: bottom;
  margin-right: .5rem;
  width: auto;
}
</style>
