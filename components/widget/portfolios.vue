<template>
  <el-row>
    <el-col>
      <el-col>
        <h4>所属作品集</h4>
      </el-col>
      <el-col style="padding: 1rem">
        <el-col v-for="portfolio in portfolios" :key="portfolio.idPortfolio" :xs="16" :xl="8">
          <el-col :xs="4" :sm="4" :xl="4">
            <el-avatar :size="24" :src="portfolio.headImgUrl"></el-avatar>
          </el-col>
          <el-col :xs="20" :sm="20" :xl="20">
            <el-link rel="nofollow" @click="showPortfolioPanel(portfolio)" :underline="false"
                     class="text-default">{{ portfolio.portfolioTitle }}
            </el-link>
          </el-col>
        </el-col>
      </el-col>
    </el-col>
    <el-col>
      <el-drawer
        :title="portfolio.portfolioTitle"
        :visible.sync="drawer"
        :direction="direction"
        :show-close="false"
        size="20%">
        <el-col>
          <el-button size="small" @click="onRouter(portfolio.idPortfolio)" style="margin: 0 5% 1rem 5%;">详情</el-button>
        </el-col>
        <el-col v-for="(article, index) in portfolio.articles" :key="article.idArticle" style="margin: 0.2rem 5%;">
          <el-link v-if="article.idArticle === portfolio.idArticle" type="primary" :href="article.articlePermalink"
                   :underline="false">{{ index + 1 }}. {{ article.articleTitle }}
          </el-link>
          <el-link v-else :id="article.idArticle" :href="article.articlePermalink" :underline="false">{{ index + 1 }}.
            {{ article.articleTitle }}
          </el-link>
        </el-col>
      </el-drawer>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "portfolios",
  props: {
    portfolios: Array
  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      portfolio: {}
    }
  },
  methods: {
    onRouter(data) {
      this.$router.push(
        {
          path: `/portfolio/${data}`
        }
      )
    },
    showPortfolioPanel(portfolio) {
      this.$set(this, 'drawer', true)
      this.$set(this, 'portfolio', portfolio)
    }
  }
}
</script>

<style scoped>

</style>
