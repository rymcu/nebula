<template>
  <el-row class="wrapper">
    <el-col style="padding: 20px;">
      <el-card :body-style="{ padding: '20px', borderRadius: '16px' }">
        <el-col style="padding-bottom: 20px;">
          <el-col :span="8" v-if="portfolio.headImgUrl">
            <el-image
              style="width: 200px;height: 200px;border-radius: 16px;background: #f5f7fa;border: #f5f7fa solid 1px;"
              :src="portfolio.headImgUrl" :preview-src-list="[portfolio.headImgUrl]"></el-image>
          </el-col>
          <el-col :span="8" v-else>
            <el-image
              style="width: 200px;height: 200px;border-radius: 16px;background: #f5f7fa;border: #f5f7fa solid 1px;">
              <div slot="error"
                   style="display: flex;justify-content: center;align-items: center;width: 100%;height: 100%;background: #f5f7fa;color: #909399;">
                无图片
              </div>
            </el-image>
          </el-col>
          <el-col :span="12">
            <el-col style="font-size: 24px;line-height: 34px;font-weight: 500;margin-bottom: 12px;">
              <span>{{ portfolio.portfolioTitle }}</span>
            </el-col>
            <el-col style="font-size: 14px;">
              <span style="padding-right: 1rem;">作者</span>
              <el-link target="_blank" :href="'/user/' + portfolio.portfolioAuthor?.userAccount">
                <el-avatar :src="portfolio.portfolioAuthorAvatarUrl" :size="16"></el-avatar>
                {{ portfolio.portfolioAuthorName }}
              </el-link>
            </el-col>
            <el-col style="font-size: 14px;">
              <span style="padding-right: 1rem;">文章</span> {{ portfolio.articleNumber || 0 }} 篇
            </el-col>
            <el-col style="margin-bottom: .5rem;font-size: 14px;" v-html="portfolio.portfolioDescription"></el-col>
          </el-col>
          <el-col :span="22">
            <el-col v-if="isAuthor" style="margin-top: .5rem;text-align: right;">
              <el-button @click="managerPortfolio(portfolio.idPortfolio)" plain>管理</el-button>
            </el-col>
          </el-col>
        </el-col>
      </el-card>
    </el-col>
    <el-col>
      <el-divider></el-divider>
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
  async fetch() {
    let {store, params, query, error} = this.$nuxt.context
    params.page = query.page || 1
    return Promise.all([
      store
        .dispatch('portfolio/fetchDetail', params)
        .catch(err => error({statusCode: 404})),
      store.dispatch('portfolio/fetchArticleList', params)
    ])
  },
  watch: {
    '$route'(to, from) {
      if (from.query.page && to.query.page) {
        this.$router.go()
      }
    }
  },
  computed: {
    ...mapState({
      portfolio: state => state.portfolio.detail.data,
      articles: state => state.portfolio.articles,
      isFetching: state => state.portfolio.detail.fetching,
      user: state => state.auth.user,
      avatar: state => state.auth.user?.avatarURL
    }),
    isAuthor() {
      let account = this.$store.state.auth.user?.nickname;
      if (account) {
        if (account === this.portfolio.portfolioAuthor?.userNickname) {
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
