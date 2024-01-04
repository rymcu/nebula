<template>
  <el-row :gutter="20" justify="space-between" type="flex">
    <el-col :md="4" :span="4" :xs="8">
      <a class="navbar-brand" href="/" rel="nofollow">
        <img alt="RYMCU" class="navbar-brand-img" src="@/assets/rymcu.png">
      </a>
    </el-col>
    <el-col :md="14" :span="10" :xs="0" style="max-height: 58px;overflow: hidden">
      <el-menu :default-active="activeMenu" @select="handleSelectMenu" mode="horizontal"
               style="margin-top: -2px;border: 0;">
        <el-menu-item index="index">首页</el-menu-item>
        <el-menu-item index="topic">专题</el-menu-item>
        <el-menu-item index="portfolios">作品集</el-menu-item>
        <el-menu-item index="products">产品</el-menu-item>
        <el-menu-item index="open-data">开放数据</el-menu-item>
      </el-menu>
    </el-col>

    <el-col :md="10" :span="10" :xs="16" style="margin-top: 12px">
      <client-only>
        <el-col style="text-align: right;" v-if="loggedIn">
          <el-popover
            @show="handleShowPopover"
            placement="bottom"
            trigger="click"
            v-model="showPopover"
            width="400">
            <el-input @keyup.enter.native="querySearchAsync" name="searchInput" placeholder="搜索文章,作品集,用户"
                      v-model="queryString">
              <el-button @click="querySearchAsync" slot="append">
                <svg height="24" style="fill: rgba(0, 0, 0, 1);" viewBox="0 0 24 24" width="24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                  <path
                    d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z"></path>
                </svg>
              </el-button>
            </el-input>
            <el-button circle size="small" slot="reference" style="background-color: transparent">
              <svg height="14" style="fill: rgba(0, 0, 0, 1);" viewBox="0 0 24 24" width="14"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                <path
                  d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z"></path>
              </svg>
            </el-button>
          </el-popover>

          <el-link :underline="false" href="/portfolio/post" rel="nofollow"
                   style="padding-left: 10px;padding-right: 10px;">创建作品集
          </el-link>
          <el-link :underline="false" href="/article/post" rel="nofollow"
                   style="padding-left: 10px;padding-right: 10px;">发帖
          </el-link>
          <el-link :underline="false" rel="nofollow" style="padding-left: 10px;padding-right: 10px;">
            <el-dropdown @command="handleCommand" trigger="click">
              <el-badge :value="notificationNumbers" class="item">
                <el-link :underline="false" rel="nofollow" style="font-size: 1.4rem;">
                  <svg height="24" style="fill: rgba(0, 0, 0, 1);" viewBox="0 0 24 24" width="24"
                       xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 13.586V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.185 4.074 5 6.783 5 10v3.586l-1.707 1.707A.996.996 0 0 0 3 16v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a.996.996 0 0 0-.293-.707L19 13.586zM19 17H5v-.586l1.707-1.707A.996.996 0 0 0 7 14v-4c0-2.757 2.243-5 5-5s5 2.243 5 5v4c0 .266.105.52.293.707L19 16.414V17zm-7 5a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22z"></path>
                  </svg>
                </el-link>
              </el-badge>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :key="notification.idNotification" command="notification"
                                  v-for="notification in notifications">{{ notification.dataSummary }}
                </el-dropdown-item>
                <el-dropdown-item command="notification">查看所有消息</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-link>
          <el-link :underline="false" rel="nofollow" style="margin-left: 10px;">
            <el-dropdown @command="handleCommand" trigger="click">
              <el-avatar :src="user.avatarUrl" size="small" v-if="user.avatarUrl"></el-avatar>
              <el-avatar size="small" src="https://static.rymcu.com/article/1578475481946.png" v-else></el-avatar>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item style="align-items: center;">
                  <el-avatar :src="user.avatarUrl" class="mr-3" size="small" style="margin-top: 1rem;"
                             v-if="user.avatarUrl"></el-avatar>
                  <el-avatar class="mr-3" size="small" src="https://static.rymcu.com/article/1578475481946.png"
                             style="margin-top: 1rem;"
                             v-else></el-avatar>
                  <el-link :underline="false" rel="nofollow" style="margin-left: 10px;margin-bottom: 1rem;">
                    {{ user.nickname }}
                  </el-link>
                </el-dropdown-item>
                <el-dropdown-item command="user">个人中心</el-dropdown-item>
                <el-dropdown-item command="answer" v-if="$auth.user.bankAccount">每日一题</el-dropdown-item>
                <el-dropdown-item command="answer" v-else :disabled="true">每日一题<small>(开通钱包账号激活)</small></el-dropdown-item>
                <el-dropdown-item command="drafts" divided>我的草稿</el-dropdown-item>
                <el-dropdown-item command="wallet">我的钱包</el-dropdown-item>
                <el-dropdown-item command="yuumi">Yuumi(ChatGPT)</el-dropdown-item>
                <el-dropdown-item command="user-info" divided>设置</el-dropdown-item>
                <el-dropdown-item command="admin-dashboard" v-if="hasPermissions">系统管理</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-link>
        </el-col>
        <el-col style="text-align: right;" v-else>
          <el-popover
            @show="handleShowPopover"
            placement="bottom"
            trigger="click"
            v-model="showPopover"
            width="400">
            <el-input @keyup.enter.native="querySearchAsync" name="searchInput" placeholder="搜索文章,作品集,用户"
                      v-model="queryString">
              <el-button @click="querySearchAsync" slot="append">
                <svg height="24" style="fill: rgba(0, 0, 0, 1);" viewBox="0 0 24 24" width="24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                  <path
                    d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z"></path>
                </svg>
              </el-button>
            </el-input>
            <el-button circle size="small" slot="reference">
              <svg height="14" style="fill: rgba(0, 0, 0, 1);" viewBox="0 0 24 24" width="14"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                <path
                  d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z"></path>
              </svg>
            </el-button>
          </el-popover>
          <el-link :underline="false" @click="login" rel="nofollow" style="margin-left: 10px;">登录</el-link>
          <el-link :underline="false" href="/register" rel="nofollow" style="margin-left: 10px;">注册</el-link>
        </el-col>
      </client-only>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';
// import sockClient from '~/plugins/sockjs';

export default {
  name: "PcHeader",
  computed: {
    ...mapState({
      activeMenu: state => state.activeMenu,
      user: state => state.auth.user,
      loggedIn: state => state.auth.loggedIn
    }),
    hasPermissions() {
      return this.$auth.hasScope('admin') || this.$auth.hasScope('blog_admin');
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
        case 'products':
          _ts.$router.push({
            path: '/products?page=1'
          })
          break;
        case 'github':
          window.open("https://github.com/rymcu");
          break;
        case 'taobao':
          window.open("https://rymcu.taobao.com?utm_source=rymcu.com");
          break;
        case 'open-data':
          _ts.$router.push({
            path: '/open-data'
          })
          break;
        default:
          _ts.$router.push(
            {
              path: '/'
            }
          )
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
        case 'yuumi':
          _ts.$router.push({
            path: '/chats/yuumi'
          })
          break;
        case 'logout':
          _ts.$auth.logout()
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
            _ts.$set(_ts, 'notifications', res.list);
            _ts.$set(_ts, 'notificationNumbers', res.total === 0 ? "" : res.total);
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
    let _ts = this;
    let user = _ts.user;
    if (user) {
      _ts.getUnreadNotifications();
      _ts.$store.dispatch('follow/fetchUserFollowerList');
      _ts.$store.dispatch('follow/fetchUserFollowingList');
      // sockClient.initSocket(this.$store.state.auth.user);
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
  line-height: 3rem;
}

.navbar-brand-img {
  height: 60px;
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

.el-menu {
  background-color: transparent !important;
}

.icon_sun {
  cursor: pointer;
  margin: 0 5px;
}

</style>
