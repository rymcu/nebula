<template>
  <el-row class="wrapper">
    <el-col>
      <el-col>
        <el-col>
          <h1>{{ portfolio.portfolioTitle }}</h1>
        </el-col>
        <el-col style="margin-bottom: .5rem;">
          <span class="text-default" style="padding-right: 1rem;">作者</span>
          <el-link rel="nofollow" @click="onRouter('user', portfolio.portfolioAuthor.userAccount)" :underline="false" class="text-default">
            <el-avatar :src="portfolio.portfolioAuthorAvatarUrl" :size="16"></el-avatar>
            {{ portfolio.portfolioAuthorName }}
          </el-link>
        </el-col>
        <el-col style="margin-bottom: .5rem;">
          <span class="text-default" style="padding-right: 1rem;">文章</span> {{portfolio.articleNumber}}篇
        </el-col>
        <el-col v-if="isAuthor" style="margin-top: .5rem;text-align: left;">
          <el-button @click="managerPortfolio(portfolio.idPortfolio)" plain>管理</el-button>
        </el-col>
        <el-col style="margin-top: 10px;">
          <el-image :src="portfolio.headImgUrl"></el-image>
        </el-col>
        <el-col style="margin-bottom: .5rem;" v-html="portfolio.portfolioDescription"></el-col>
      </el-col>
    </el-col>
    <el-col>
      <el-divider><i class="el-icon-loading"></i></el-divider>
      <el-col>
          <article-list :articles="articles" @currentChange="currentChangeArticle"></article-list>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
  import {mapState} from 'vuex';
  import ArticleList from "../../components/archive/list";

  export default {
    name: "PortfolioDetail",
    components: {ArticleList},
    validate({params, store}) {
      return params.portfolio_id && !isNaN(Number(params.portfolio_id))
    },
    fetch({store, params, query, error}) {
      params.page = query.page || 1
      return Promise.all([
        store
          .dispatch('portfolio/fetchDetail', params)
          .catch(err => error({statusCode: 404})),
        store.dispatch('portfolio/fetchArticleList', params)
      ])
    },
    watch: {
      '$route.query': function () {
        this.$store.dispatch('portfolio/fetchArticleList', {
          page: this.$route.query.page || 1,
          portfolio_id: this.routePortfolioId
        })
      }
    },
    computed: {
      ...mapState({
        portfolio: state => state.portfolio.detail.data,
        articles: state => state.portfolio.articles,
        isFetching: state => state.portfolio.detail.fetching,
        isMobile: state => state.global.isMobile,
        user: state => state.oauth,
        avatar: state => state.userInfo?.avatarURL
      }),
      isAuthor() {
        let account = this.$store.state.userInfo?.nickname;
        if (account) {
          if (account === this.portfolio.portfolioAuthor.userNickname) {
            return true;
          }
        }
        return false;
      },
      routePortfolioId() {
        return Number(this.$route.params.portfolio_id)
      }
    },
    head() {
      return {
        title: this.portfolio.portfolioTitle || 'RYMCU - 嵌入式知识学习交流平台',
        meta: [
          {
            name: 'keywords',
            content: this.portfolio.portfolioTags || 'RYMCU'
          },
          {
            name: 'description',
            content: this.portfolio.portfolioPreviewContent
          },
          {
            name: 'site_name',
            content: 'RYMCU'
          },
          {
            name: 'url',
            content: this.portfolio.portfolioPermalink
          },
          {
            name: 'og:title',
            content: this.portfolio.portfolioTitle + ' - RYMCU'
          },
          {
            name: 'og:description',
            content: this.portfolio.portfolioPreviewContent
          },
          {
            name: 'og:site_name',
            content: 'RYMCU'
          },
          {
            name: 'og:url',
            content: this.portfolio.portfolioPermalink
          }
        ]
      }
    },
    methods: {
      onRouter(name, data) {
        if (name === 'article') {
          this.$router.push({
            path: data
          })
        } else {
          this.$router.push(
            {
              path: '/user/' + data
            }
          )
        }
      },
      managerPortfolio(id) {
        this.$router.push(
          {
            path: `/portfolio/manager/${id}`
          }
        )
      },
      currentChangeArticle(page) {
        this.$router.push(
          {
            path: `/portfolio/${this.routePortfolioId}?page=${page}`
          }
        )
      }
    },
    mounted() {
      this.$store.commit('setActiveMenu', 'portfolioDetail');
    }
  }
</script>

<style scoped>

</style>
