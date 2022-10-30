<template>
  <el-row>
    <el-col :xs="24" :xl="24">
      <div class="card card-profile">
        <div v-if="user.bgImgUrl" class="card-header"
             :style="{backgroundImage:'url('+user.bgImgUrl+')', backgroundSize:'cover', backgroundPosition:'50%'}"></div>
        <div v-else class="card-header"
             :style="{backgroundImage:'url(' + backgroundImage + ')', backgroundSize:'800px auto', backgroundPosition:'50%'}"></div>
        <div class="card-body text-center">
          <img v-if="user.avatarUrl" class="card-profile-img-avatar" :src="user.avatarUrl">
          <img v-else class="card-profile-img" src="https://static.rymcu.com/article/1578475481946.png">
          <h3 class="mb-3">{{ user.nickname }}</h3>
          <p class="mb-4" v-html="user.signature"></p>
          <div v-if="userExtend" style="margin-bottom: 1rem;">
            <el-link v-if="userExtend.blog" class="user-link" title="博客" :underline="false" :href="userExtend.blog"
                     target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);"><path d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-.943-.944-2.199-1.465-3.535-1.465s-2.592.521-3.535 1.465L4.929 12a5.008 5.008 0 0 0 0 7.071 4.983 4.983 0 0 0 3.535 1.462A4.982 4.982 0 0 0 12 19.071l.707-.707-1.414-1.414-.707.707a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.122-2.121z"></path><path d="m12 4.929-.707.707 1.414 1.414.707-.707a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.122 2.121c-1.133 1.133-3.109 1.133-4.242 0L10.586 12l-1.414 1.414.707.707c.943.944 2.199 1.465 3.535 1.465s2.592-.521 3.535-1.465L19.071 12a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0z"></path></svg>
            </el-link>
            <el-link v-if="userExtend.github" class="user-link" title="github" :underline="false"
                     :href="'https://github.com/' + userExtend.github" target="_blank">
              <svg width="24" height="24">
                <g :fill="'#' + github.hex">
                  <path :d="github.path"></path>
                </g>
              </svg>
            </el-link>
            <el-link v-if="userExtend.weibo" class="user-link" title="微博" :underline="false"
                     :href="'https://weibo.com/n/' + userExtend.weibo" target="_blank">
              <svg width="24" height="24">
                <g :fill="'#' + sinaweibo.hex">
                  <path :d="sinaweibo.path"></path>
                </g>
              </svg>
            </el-link>
            <el-popover
              v-if="userExtend.weixin"
              placement="top-start"
              title="微信号"
              width="200"
              trigger="hover"
              :content="userExtend.weixin">
              <el-link slot="reference" class="user-link" :underline="false">
                <svg width="24" height="24">
                  <g :fill="'#' + wechat.hex">
                    <path :d="wechat.path"></path>
                  </g>
                </svg>
              </el-link>
            </el-popover>
            <el-popover
              v-if="userExtend.qq"
              placement="top-start"
              title="QQ 号"
              width="200"
              trigger="hover"
              :content="userExtend.qq">
              <el-link slot="reference" class="user-link" :underline="false">
                <svg width="24" height="24">
                  <path :d="tencentqq.path"></path>
                </svg>
              </el-link>
            </el-popover>
          </div>
          <div v-if="loggedIn">
            <div v-if="auth.idUser !== user.idUser">
              <el-button type="primary" v-if="isFollow" @click="cancelFollowUser(user.idUser)" plain>取消关注</el-button>
              <el-button type="primary" v-else @click="followUser(user.idUser)" plain>关注</el-button>
              <el-button v-show="false" @click="gotoChats" plain>聊天</el-button>
            </div>
          </div>
          <div v-else>
            <el-button type="primary" @click="login" plain>关注</el-button>
            <el-button v-show="false" @click="login" plain>聊天</el-button>
          </div>
        </div>
      </div>
    </el-col>
    <el-col class="text-center" style="margin-bottom: 1rem;">
      <el-row type="flex" justify="center">
        <el-col>
          <el-menu :default-active="activeTab" mode="horizontal" @select="handleToggleTab"
                   style="padding-left: calc(50vw - 11rem);">
            <el-menu-item index="0">文章</el-menu-item>
            <el-menu-item index="1">作品集</el-menu-item>
            <el-menu-item index="2">关注用户</el-menu-item>
            <el-menu-item index="3">粉丝</el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-col>
    <el-col v-if="activeTab === '0'" class="tab-content">
      <article-list :articles="articles" @currentChange="currentChangeArticle"></article-list>
    </el-col>
    <el-col v-else-if="activeTab === '1'" class="tab-content">
      <portfolio-list :portfolios="portfolios" @currentChange="currentChangePortfolio"></portfolio-list>
    </el-col>
    <el-col v-else-if="activeTab === '2'" class="tab-content">
      <user-list :users="followings" @currentChange="currentChangeFollowing" @followUser="followUser" @cancelFollowUser="cancelFollowUser"></user-list>
    </el-col>
    <el-col v-else-if="activeTab === '3'" class="tab-content">
      <user-list :users="followers" @currentChange="currentChangeFollower" @followUser="followUser" @cancelFollowUser="cancelFollowUser"></user-list>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';
import ArticleList from "~/components/archive/list";
import PortfolioList from "~/components/common/portfolio/list";
import UserList from "~/components/common/user/list";
import designTools from "~/static/banner/design-tools.jpg"
import asteroids from "~/static/banner/asteroids.jpg"
import isoMetropolis from "~/static/banner/isometropolis.jpg"
import naranjas from "~/static/banner/naranjas.png"
import retroFurnish from "~/static/banner/retro-furnish.png"
import science from "~/static/banner/science.png"
import {github, sinaweibo, wechat, tencentqq} from "simple-icons";

export default {
  name: "User",
  components: {ArticleList, PortfolioList, UserList},
  validate({params, store}) {
    return params.account
  },
  fetch() {
    let {store, params, query, error} = this.$nuxt.context;
    params.page = query.page || 1
    return Promise.all([
      store
        .dispatch('user/fetchDetail', params)
        .catch(err => error({statusCode: 404})),
      store.dispatch('user/fetchUserExtend', params),
      store.dispatch('user/fetchArticleList', params),
      store.dispatch('user/fetchPortfolioList', params),
      store.dispatch('user/fetchFollowerList', params),
      store.dispatch('user/fetchFollowingList', params)
    ])
  },
  watch: {
    '$route.query': function () {
      let _ts = this;
      if (_ts.$route.params.account) {
        let activeTab = _ts.$route.query.tab || '0'
        _ts.$set(_ts, 'activeTab', activeTab)
        switch (_ts.activeTab) {
          case "0":
            _ts.$store.dispatch('user/fetchArticleList', {
              account: _ts.$route.params.account,
              page: _ts.$route.query.page || 1
            })
            break;
          case "1":
            _ts.$store.dispatch('user/fetchPortfolioList', {
              account: _ts.$route.params.account,
              page: _ts.$route.query.page || 1
            })
            break;
          case "2":
            _ts.$store.dispatch('user/fetchFollowingList', {
              account: _ts.$route.params.account,
              page: _ts.$route.query.page || 1
            })
            break;
          default:
            _ts.$store.dispatch('user/fetchFollowerList', {
              account: _ts.$route.params.account,
              page: _ts.$route.query.page || 1
            })
            break
        }
      }
    }
  },
  computed: {
    ...mapState({
      user: state => state.user.data,
      userExtend: state => state.user.userExtend,
      articles: state => state.user.articles,
      portfolios: state => state.user.portfolios,
      followers: state => state.user.followers,
      followings: state => state.user.followings,
      loggedIn: state => state.auth.loggedIn,
      auth: state => state.auth.user
    })
  },
  data() {
    return {
      github,
      sinaweibo,
      wechat,
      tencentqq,
      activeTab: this.$route.query.tab || '0',
      isFollow: false,
      backgroundImage: designTools,
      backgroundImages: [
        designTools,
        asteroids,
        isoMetropolis,
        naranjas,
        retroFurnish,
        science
      ]
    }
  },
  methods: {
    currentChangeArticle(page) {
      this.onRouter(0, page)
    },
    currentChangePortfolio(page) {
      this.onRouter(1, page)
    },
    currentChangeFollowing(page) {
      this.onRouter(2, page)
    },
    currentChangeFollower(page) {
      this.onRouter(3, page)
    },
    handleToggleTab(key) {
      this.onRouter(key, 1)
    },
    onRouter(key, page) {
      let _ts = this
      _ts.$router.push({
        path: `/user/${_ts.$route.params.account}?tab=${key}&page=${page}`
      })
    },
    gotoChats() {
      let _ts = this;
      _ts.$router.push({
        path: `/chats/${_ts.user.account}`
      })
    },
    followUser(idUser) {
      let _ts = this;
      if (_ts.loggedIn) {
        _ts.$axios.$post('/api/follow', {
          followingId: idUser,
          followingType: 0
        }).then(function (res) {
          _ts.$set(_ts, 'isFollow', res);
          _ts.$store.dispatch('follow/fetchUserFollowingList');
        })
      } else {
        _ts.login()
      }
    },
    cancelFollowUser(idUser) {
      let _ts = this;
      if (_ts.loggedIn) {
        _ts.$axios.$post('/api/follow/cancel-follow', {
          followingId: idUser,
          followingType: 0
        }).then(function (res) {
          _ts.$set(_ts, 'isFollow', res);
          _ts.$store.dispatch('follow/fetchUserFollowingList');
        })
      } else {
        _ts.login()
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
    this.$store.commit('setActiveMenu', 'user');
    if (_ts.loggedIn) {
      _ts.$axios.$get('/api/follow/is-follow', {
        params: {
          followingId: _ts.user.idUser,
          followingType: 0
        }
      }).then(function (res) {
        _ts.$set(_ts, 'isFollow', res);
      })
    }
  }
}
</script>

<style scoped>
body {
  overflow-x: hidden;
}

.card {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  position: relative;
  margin-bottom: 1.5rem;
  width: 100%;
}

.card {
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 40, 100, 0.12);
  border-radius: 3px;
}

.card-profile .card-header {
  height: 20rem;
  background-size: cover;
}

.card-header:first-child {
  border-radius: calc(3px - 1px) calc(3px - 1px) 0 0;
}

.card-header {
  background: none;
  padding: 0.5rem 1.5rem;
  display: -ms-flexbox;
  display: flex;
  min-height: 3.5rem;
  -ms-flex-align: center;
  align-items: center;
}

.card-header {
  padding: 1.5rem 1.5rem;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 40, 100, 0.12);
}

.card-body {
  -ms-flex: 1;
  flex: 1;
  margin: 0;
  padding: 1.5rem 1.5rem;
  position: relative;
}

.card-profile-img {
  max-width: 16rem;
  margin-top: -7rem;
  margin-bottom: 1rem;
  border: 3px solid #fff;
  border-radius: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.card-profile-img-avatar {
  max-width: 16rem;
  height: auto;
  margin-top: -10rem;
  margin-bottom: 1rem;
  border: 3px solid #fff;
  border-radius: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.card-img-top {
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.card-img-top {
  width: 100%;
  border-top-left-radius: calc(3px - 1px);
  border-top-right-radius: calc(3px - 1px);
}

.mb-3, .my-3 {
  margin-bottom: 0.75rem !important;
}

h3, .h3 {
  font-size: 1.5rem;
}

.mb-4, .my-4 {
  margin-bottom: 1rem !important;
}

.article-header-md {
  position: relative;
  line-height: 1.4em;
  height: 1.4em;
  overflow: hidden;
}

.article-header-md a {
  font-weight: bold;
  font-size: 1em;
}

.article-summary-md {
  position: relative;
  line-height: 1.4em;
  height: 4.2em;
  overflow: hidden;
}

.el-col-6 {
  padding-right: 0.75rem;
  padding-left: 0.75rem;
}

.tab-content {
  min-height: 50vh;
}

.user-link {
  font-size: 24px;
  margin: 0 0.5rem;
  width: 24px;
  height: 24px;
}
</style>
