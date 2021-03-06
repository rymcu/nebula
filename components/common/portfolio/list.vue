<template>
  <div class="wrapper">
    <el-row class="row-cards row-deck" :gutter="20">
      <el-col :span="8" v-for="portfolio in portfolios.portfolios" :key="portfolio.idPortfolio">
        <el-col v-if="portfolio.headImgUrl" style="margin-bottom: 20px;">
          <el-card :body-style="{ padding: '0px' }">
            <el-col style="padding: 0;">
              <el-image :src="portfolio.headImgUrl" style="width:281px;height: 281px;" fit="cover"></el-image>
            </el-col>
            <el-col style="padding: 0 10px;">
              <h4 class="article-header-md">
                <el-link rel="nofollow" @click="onRouter('portfolio',portfolio.idPortfolio)" :underline="false"
                         v-html="portfolio.portfolioTitle"></el-link>
              </h4>
            </el-col>
            <el-col class="text-muted article-summary-md">{{ portfolio.portfolioDescription }}</el-col>
          </el-card>
        </el-col>
        <el-col v-else style="margin-bottom: 20px;">
          <el-card :body-style="{ padding: '0px' }">
            <el-col style="padding: 0;">
              <el-image style="width:281px;height: 281px;" fit="cover">
              </el-image>
            </el-col>
            <el-col style="padding: 0 10px;">
              <h4 class="article-header-md">
                <el-link rel="nofollow" @click="onRouter('portfolio',portfolio.idPortfolio)" :underline="false"
                         v-html="portfolio.portfolioTitle"></el-link>
              </h4>
            </el-col>
            <el-col class="text-muted article-summary-md">{{ portfolio.portfolioDescription }}</el-col>
          </el-card>
        </el-col>
      </el-col>
      <el-col v-show="!portfolios" class="text-center">
        这里什么都没有!
      </el-col>
      <el-col>
        <div class="vertical-container text-center">
          <el-pagination :hide-on-single-page="true" v-model="portfolios.pagination"
                         layout="prev, pager, next"
                         :current-page="portfolios.pagination.currentPage"
                         :total="portfolios.pagination.total"
                         @current-change="currentChange">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "PortfolioList",
    props: {
      portfolios: {
        type: Object
      }
    },
    methods: {
      onRouter(name, data) {
        this.$router.push(
          {
            path: `/${name}/${data}`
          }
        )
      },
      currentChange(page) {
        this.$emit('currentChange', page);
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
    max-width: 6rem;
    margin-top: -5rem;
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
