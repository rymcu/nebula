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
            </el-menu>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="10" :sm="6" :md="6" :xl="6" style="padding-top: 1rem;text-align: right;">
        <el-autocomplete
          v-model="queryString"
          size="small"
          value-key="label"
          :fetch-suggestions="querySearchAsync"
          placeholder="搜索帖子、作品集和用户"
          :trigger-on-focus="false"
          @select="handleSelect"
          style="width: 80%;"
          popper-class="search-result-box"
        >
          <template slot-scope="{ item }">
            <el-col>
              <span class="search-result-type">
                <small class="text-muted" v-html="getSearchResultType(item.type)"></small>
              </span>
              <span>{{ item.label }}</span>
            </el-col>
          </template>
          <!--          <template slot="append">-->
          <!--            <el-button size="small" icon="el-icon-search" @click="search"></el-button>-->
          <!--          </template>-->
        </el-autocomplete>
      </el-col>
      <el-col :xs="6" :sm="6" :md="6" :xl="3" style="padding-top: 1rem;">
        <client-only>
          <el-col v-if="user" style="text-align: right;">
            <el-link rel="nofollow" :underline="false" style="padding-left: 10px;padding-right: 10px;"
                     href="/portfolio/post">创建作品集
            </el-link>
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
import {isBrowser} from '~/environment';

const Cookie = process.client ? require('js-cookie') : undefined
export default {
  name: "PcHeader",
  computed: {
    ...mapState({
      activeMenu: state => state.activeMenu,
      user: state => state.oauth,
      initialSearchData: state => state.search.list
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
      notificationNumbers: ""
    };
  },
  watch: {
    user: function () {
      this.getUnreadNotifications();
    }
  },
  methods: {
    querySearchAsync(queryString, cb) {
      let initialSearchData = this.initialSearchData;
      let results = queryString ? initialSearchData.filter(this.createStateFilter(queryString)) : initialSearchData;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        if (state && state.label) {
          return (state.label.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
        }
      };
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
    handleSelect(item) {
      console.log(item);
      let _ts = this;
      if (item) {
        _ts.$router.push({
          path: `/${item.type}/${item.value}`
        })
      }
    },
    handleCommand(item) {
      let _ts = this;
      switch (item) {
        case 'user':
          _ts.$router.push({
            path: '/user/' + _ts.nickname
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
    search() {
      console.log(this.queryString)
    },
    getSearchResultType(type) {
      switch (type) {
        case 'article':
          type = '文章';
          break;
        case 'portfolio':
          type = '作品集';
          break;
        case 'user':
          type = '用户';
          break;
      }
      return type;
    }
  },
  mounted() {
    let user = this.user;
    if (user) {
      this.getUnreadNotifications();
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
