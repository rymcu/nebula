<template>
  <el-row class="wrapper">
    <el-col v-if="isAuthor">
      <el-col>
        <el-col :xs="3" :sm="3" :xl="3" class="mr-3">
          <el-image :src="portfolio.headImgUrl"></el-image>
        </el-col>
        <el-col :xs="20" :sm="20" :xl="20">
          <el-col>
            <h1>{{ portfolio.portfolioTitle }}</h1>
          </el-col>
          <el-col style="margin-bottom: .5rem;">
            <span class="text-default" style="padding-right: 1rem;">作者</span>
            <el-link rel="nofollow" @click="onRouter('user', portfolio.portfolioAuthorName)" :underline="false" class="text-default">
              <el-avatar :src="portfolio.portfolioAuthorAvatarUrl" :size="16"></el-avatar>
              {{ portfolio.portfolioAuthorName }}
            </el-link>
          </el-col>
          <el-col style="margin-bottom: .5rem;">
            <span class="text-default" style="padding-right: 1rem;">文章</span> {{portfolio.articleNumber}}篇
          </el-col>
          <el-col style="margin-bottom: .5rem;" v-html="portfolio.portfolioDescription">
          </el-col>
        </el-col>
      </el-col>
      <el-col>
        <el-col style="text-align: right;">
          <el-col>
            <el-link rel="nofollow" @click="onRouter('post-portfolio',portfolio.idPortfolio)" :underline="false" class="text-default"
                     style="margin-right: 1rem;">编辑
            </el-link>
            <el-link rel="nofollow" @click="showBindArticleDialog(portfolio.idPortfolio)" :underline="false" class="text-default"
                     style="margin-right: 1rem;">添加文章
            </el-link>
          </el-col>
        </el-col>
        <el-col>
          <el-divider></el-divider>
        </el-col>
        <el-col>
          <portfolio-manager-list :idPortfolio="portfolio.idPortfolio"></portfolio-manager-list>
        </el-col>
      </el-col>
    </el-col>
    <el-col v-else class="text-center">
      <el-alert
        title="用户无权限"
        type="warning"
        center
        show-icon
        :closable="false">
      </el-alert>
    </el-col>
  </el-row>
</template>

<script>
  import {mapState} from 'vuex';
  import PortfolioManagerList from "~/components/common/portfolio/manager/list";

  export default {
    name: "PortfolioManager",
    components: {
      PortfolioManagerList
    },
    validate({params, store}) {
      return params.portfolio_id && !isNaN(Number(params.portfolio_id))
    },
    fetch() {
      let {store, params, error} = this.$nuxt.context
      return Promise.all([
        store
          .dispatch('portfolio/fetchDetail', params)
          .catch(err => error({statusCode: 404}))
      ])
    },
    computed: {
      ...mapState({
        portfolio: state => state.portfolio.detail.data
      }),
      isAuthor() {
        let account = this.$store.state.auth.user?.nickname;
        if (account) {
          if (account === this.portfolio.portfolioAuthorName) {
            return true;
          }
        }
        return false;
      }
    },
    methods: {
      onRouter(name, data) {
        if (name === 'article') {
          this.$router.push({
            path: data
          })
        } else if (name === 'user') {
          this.$router.push(
            {
              path: '/user/' + data
            }
          )
        } else {
          this.$router.push(
            {
              path: '/portfolio/post/' + data
            }
          )
        }
      },
      showBindArticleDialog(idPortfolio) {
        this.$router.push({
          path: `/portfolio/manager/bind/${idPortfolio}`
        });
      }
    }
  }
</script>

<style scoped>

</style>
