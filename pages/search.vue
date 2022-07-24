<template>
  <el-row class="wrapper">
    <el-col>
      <el-input v-model="q" @keyup.enter.native="search" placeholder="搜索文章,作品集,用户" :clearable="true">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </el-col>
    <el-col>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="'文章 (' + getLength(articles) + ')'" name="articles">
          <article-list :articles="articles" @currentChange="currentChangeArticle"/>
        </el-tab-pane>
        <el-tab-pane :label="'用户 (' + getLength(users) + ')'" name="users">
          <user-list :users="users" @currentChange="currentChangeUser"/>
        </el-tab-pane>
        <el-tab-pane :label="'作品集 (' + getLength(portfolios) + ')'" name="portfolios">
          <portfolio-list :portfolios="portfolios" @currentChange="currentChangePortfolio"/>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from "vuex";
import ArticleList from "../components/archive/list";
import UserList from "../components/common/user/list";
import PortfolioList from "../components/common/portfolio/list";

export default {
  name: "search",
  fetch({store, query, error}) {
    return Promise.all([
      store
        .dispatch('search/fetchArticleList', {queryString: query.q})
        .catch(err => error({statusCode: 404})),
      store
        .dispatch('search/fetchUserList', {queryString: query.q})
        .catch(err => error({statusCode: 404})),
      store
        .dispatch('search/fetchPortfolioList', {queryString: query.q})
        .catch(err => error({statusCode: 404}))
    ])
  },
  watch: {
    '$route.query': function () {
      let _ts = this;
      let queryString = _ts.$route.query.q;
      _ts.$set(_ts, "q", queryString);
      this.$store.dispatch('search/fetchArticleList', {queryString: queryString})
      this.$store.dispatch('search/fetchUserList', {queryString: queryString})
      this.$store.dispatch('search/fetchPortfolioList', {queryString: queryString})
    }
  },
  components: {PortfolioList, UserList, ArticleList},
  computed: {
    ...mapState({
      articles: state => state.search.articles.data,
      users: state => state.search.users.data,
      portfolios: state => state.search.portfolios.data
    })
  },
  data() {
    return {
      q: '',
      activeName: 'articles'
    }
  },
  methods: {
    search() {
      let _ts = this
      if (_ts.q) {
        _ts.$router.push({
          path: `/search?q=${_ts.q}`
        })
      }
    },
    currentChangeArticle(page) {
      this.$store.dispatch("search/fetchArticleList", {queryString: this.q, page: page});
    },
    currentChangeUser(page) {
      this.$store.dispatch("search/fetchUserList", {queryString: this.q, page: page});
    },
    currentChangePortfolio(page) {
      this.$store.dispatch("search/fetchPortfolioList", {queryString: this.q, page: page});
    },
    getLength(pagination) {
      if (pagination.total) {
        return pagination.total;
      }
      return 0;
    }
  },
  mounted() {
    let _ts = this;
    let queryString = _ts.$route.query.q;
    _ts.$set(_ts, "q", queryString);
    _ts.$store.commit('setActiveMenu', 'search')
  }
}
</script>

<style scoped>

</style>
