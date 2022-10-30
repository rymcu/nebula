<template>
  <el-row class="wrapper">
    <el-col style="margin-bottom: 1rem;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/portfolio/manager/' + idPortfolio }">返回上一级</el-breadcrumb-item>
        <el-breadcrumb-item>关联文章</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col>
      <el-divider></el-divider>
    </el-col>
    <el-col>
      <el-input v-model="searchText" @input="searchUnbindArticle" placeholder="输入帖子标题,回车检索"></el-input>
    </el-col>
    <el-col style="padding-top: 10px;">
      <portfolio-manager-bind-list :idPortfolio="idPortfolio" :articles="articles"
                                   @currentChange="currentChangeArticle"></portfolio-manager-bind-list>
    </el-col>
  </el-row>
</template>

<script>
  import {mapState} from 'vuex';
  import PortfolioManagerBindList from "~/components/common/portfolio/manager/bind/list";

  export default {
    name: "PortfolioManagerBind",
    components: {
      PortfolioManagerBindList
    },
    validate({params, store}) {
      return params.portfolio_id && !isNaN(Number(params.portfolio_id))
    },
    fetch() {
      let {store, params, error} = this.$nuxt.context
      return Promise.all([
        store
          .dispatch('portfolio/fetchUnBindArticleList', params)
          .catch(err => error({statusCode: 404}))
      ])
    },
    computed: {
      ...mapState({
        articles: state => state.portfolio.unbindArticles,
      }),
      idPortfolio() {
        return Number(this.$route.params.portfolio_id)
      }
    },
    data() {
      return {
        searchText: ''
      }
    },
    methods: {
      currentChangeArticle(page) {
        this.$store.dispatch('portfolio/fetchUnBindArticleList', {
          page: page,
          portfolio_id: this.$route.params.portfolio_id
        })
      },
      searchUnbindArticle() {
        this.$store.dispatch('portfolio/fetchUnBindArticleList', {
          page: 1,
          portfolio_id: this.$route.params.portfolio_id,
          searchText: this.searchText
        })
      },
      onRouter(name, data) {
        if (name === 'article') {
          this.$router.push({
            path: data
          })
        } else {
          this.$router.push(
            {
              path: '/portfolio/post/' + data
            }
          )
        }
      }
    },
    mounted() {
      this.$store.commit('setActiveMenu', 'portfolioBind');
    }
  }
</script>

<style scoped>

</style>
