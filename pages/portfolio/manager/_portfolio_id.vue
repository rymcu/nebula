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
            <el-link rel="nofollow" @click="onRouter('post-portfolio',portfolio.idPortfolio)" :underline="false"
                     class="text-default"
                     style="margin-right: 1rem;">编辑
            </el-link>
            <el-link rel="nofollow" @click="showBindArticleDialog(portfolio.idPortfolio)" :underline="false"
                     class="text-default"
                     style="margin-right: 1rem;">添加文章
            </el-link>
            <el-link rel="nofollow" @click="handleDel" :underline="false"
                     type="danger" style="margin-right: 1rem;">删除作品集
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
    },
    idPortfolio() {
      return this.$route.params.portfolio_id ? this.$route.params.portfolio_id : 0
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
    },
    handleDel() {
      let _ts = this;
      _ts.$confirm(`确定删除【${_ts.portfolio.portfolioTitle}】该作品集合集吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(_ts.portfolio.articleNumber)
        if (Number(_ts.portfolio.articleNumber) === 0) {
          _ts.$axios.$delete('/api/portfolio/delete', {
            params: {
              idPortfolio: _ts.idPortfolio
            }
          }).then(function (res) {
            if (res) {
              _ts.$set(_ts, 'notificationFlag', false);
              _ts.$router.push({
                path: '/user/' + _ts.$store.state.auth.user?.account
              })
            }
          })
        } else {
          _ts.$message({
            type: 'error',
            message: '请先删除文章'
          });
        }

      }).catch(() => {
        _ts.$message({
          type: 'info',
          message: '已取消'
        });
      });
    }
  }
}
</script>

<style scoped>

</style>
