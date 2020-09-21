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
          <div v-if="oauth">
            <div v-if="oauth.idUser !== user.idUser">
              <el-button type="primary" v-if="isFollow" @click="cancelFollowUser(user.idUser)">取消关注</el-button>
              <el-button type="primary" v-else @click="followUser(user.idUser)">关注</el-button>
              <el-button @click="gotoChats">聊天</el-button>
            </div>
          </div>
          <div v-else>
            <el-button type="primary" @click="login">关注</el-button>
            <el-button @click="login">聊天</el-button>
          </div>
        </div>
      </div>
    </el-col>
    <el-col class="text-center" style="margin-bottom: 1rem;">
      <el-row type="flex" justify="center">
        <el-col>
          <el-menu :default-active="activeTab" mode="horizontal" @select="handleToggleTab"
                   style="padding-left: calc(50vw - 4.8rem);">
            <el-menu-item index="0">文章</el-menu-item>
            <el-menu-item index="1">作品集</el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-col>
    <el-col v-if="activeTab === '0'">
      <article-list :articles="articles" @currentChange="currentChangeArticle"></article-list>
    </el-col>
    <el-col v-else>
      <portfolio-list :portfolios="portfolios" @currentChange="currentChangePortfolio"></portfolio-list>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';
import ArticleList from "~/components/archive/list";
import PortfolioList from "~/components/common/portfolio/list";

export default {
  name: "User",
  components: {ArticleList, PortfolioList},
  validate({params, store}) {
    return params.nickname
  },
  fetch({store, params, error}) {
    return Promise.all([
      store
        .dispatch('user/fetchDetail', params)
        .catch(err => error({statusCode: 404})),
      store.dispatch('user/fetchArticleList', params),
      store.dispatch('user/fetchPortfolioList', params)
    ])
  },
  computed: {
    ...mapState({
      user: state => state.user.data,
      articles: state => state.user.articles,
      portfolios: state => state.user.portfolios,
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
      this.$store.dispatch('user/fetchArticleList', {page: page, nickname: this.$route.params.nickname})
    },
    currentChangePortfolio(page) {
      this.$store.dispatch('user/fetchPortfolioList', {page: page, nickname: this.$route.params.nickname})
    },
    handleToggleTab(key) {
      this.$set(this, 'activeTab', key);
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
        path: '/login'
      })
    }
  },
  mounted() {
    let _ts = this;
    this.$store.commit('setActiveMenu', 'user')
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
</style>
