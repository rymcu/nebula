<template>
  <el-row>
    <el-col :xs="24" :xl="24">
      <div class="card card-profile">
        <div v-if="user.userHomeBImgURL" class="card-header"
             :style="{backgroundImage:'url('+user.userHomeBImgURL+')', backgroundSize:'percentage', backgroundPosition:'50%'}"></div>
        <div v-else class="card-header"
             :style="{backgroundImage:'url(https://static.rymcu.com/article/1574441651963.jpg)', backgroundSize:'cover', backgroundPosition:'50%'}"></div>
        <div class="card-body text-center">
          <img v-if="user.avatarUrl" class="card-profile-img-avatar" :src="user.avatarUrl">
          <img v-else class="card-profile-img" src="https://static.rymcu.com/article/1578475481946.png">
          <h3 class="mb-3">{{ user.nickname }}</h3>
          <p class="mb-4" v-html="user.signature"></p>
          <div v-if="userExtend" style="margin-bottom: 1rem;">
            <el-link v-if="userExtend.blog" class="user-link" title="博客" :underline="false" :href="userExtend.blog"
                     target="_blank">
              <font-awesome-icon :icon="['fas', 'link']"></font-awesome-icon>
            </el-link>
            <el-link v-if="userExtend.github" class="user-link" title="github" :underline="false"
                     :href="'https://github.com/' + userExtend.github" target="_blank">
              <font-awesome-icon :icon="['fab', 'github']"></font-awesome-icon>
            </el-link>
            <el-link v-if="userExtend.weibo" class="user-link" title="微博" :underline="false"
                     :href="'https://weibo.com/n/' + userExtend.weibo" target="_blank">
              <font-awesome-icon :icon="['fab', 'weibo']"></font-awesome-icon>
            </el-link>
            <el-link v-if="userExtend.weixin" class="user-link" title="微信" :underline="false" :href="userExtend.weixin">
              <font-awesome-icon :icon="['fab', 'weixin']" target="_blank"></font-awesome-icon>
            </el-link>
            <el-link v-if="userExtend.qq" class="user-link" title="QQ" :underline="false" :href="userExtend.qq">
              <font-awesome-icon :icon="['fab', 'qq']" target="_blank"></font-awesome-icon>
            </el-link>
          </div>
          <div v-if="oauth">
            <div v-if="oauth.idUser !== user.idUser">
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
      <user-list :users="followings" @currentChange="currentChangeFollowing"></user-list>
    </el-col>
    <el-col v-else-if="activeTab === '3'" class="tab-content">
      <user-list :users="followers" @currentChange="currentChangeFollower"></user-list>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';
import ArticleList from "~/components/archive/list";
import PortfolioList from "~/components/common/portfolio/list";
import UserList from "~/components/common/user/list";

export default {
  name: "User",
  components: {ArticleList, PortfolioList, UserList},
  validate({params, store}) {
    return params.nickname
  },
  fetch({store, params, query, error}) {
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
      _ts.$set(_ts, 'activeTab', _ts.$route.query.tab)
      switch (_ts.activeTab) {
        case "0":
          _ts.$store.dispatch('user/fetchArticleList', {
            nickname: this.$route.params.nickname,
            page: this.$route.query.page || 1
          })
          break;
        case "1":
          _ts.$store.dispatch('user/fetchPortfolioList', {
            nickname: this.$route.params.nickname,
            page: this.$route.query.page || 1
          })
          break;
        case "2":
          _ts.$store.dispatch('user/fetchFollowerList', {
            nickname: this.$route.params.nickname,
            page: this.$route.query.page || 1
          })
          break;
        default:
          _ts.$store.dispatch('user/fetchFollowingList', {
            nickname: this.$route.params.nickname,
            page: this.$route.query.page || 1
          })
          break
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
      oauth: state => state.oauth
    })
  },
  data() {
    return {
      activeTab: '0',
      isFollow: false
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
      this.$router.push({
        path: `/user/${this.$route.params.nickname}?tab=${key}&page=${page}`
      })

    },
    gotoChats() {
      let _ts = this;
      _ts.$router.push({
        path: `/chats/${_ts.user.nickname}`
      })
    },
    followUser(idUser) {
      let _ts = this;
      if (_ts.oauth) {
        _ts.$axios.$post('/api/follow', {
          followingId: idUser,
          followingType: 0
        }).then(function (res) {
          _ts.$set(_ts, 'isFollow', res);
        })
      } else {
        _ts.login()
      }
    },
    cancelFollowUser(idUser) {
      let _ts = this;
      if (_ts.oauth) {
        _ts.$axios.$post('/api/follow/cancel-follow', {
          followingId: idUser,
          followingType: 0
        }).then(function (res) {
          _ts.$set(_ts, 'isFollow', res);
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
    _ts.$set(_ts, 'activeTab', _ts.$route.query.tab || '0');
    if (_ts.oauth) {
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
}
</style>
