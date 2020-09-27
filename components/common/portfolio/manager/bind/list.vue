<template>
  <el-row>
    <el-col v-for="article in articles.articles" :key="article.idArticle" style="padding-top: 1rem;">
      <el-card>
        <div class="card-body d-flex flex-column">
          <el-link rel="nofollow" :underline="false" style="margin-bottom: .5rem;">
            <h4 v-html="article.articleTitle"></h4>
          </el-link>
          <div class="text-muted article-summary-md">{{ article.articlePreviewContent }}</div>
          <el-col class="text-right" style="padding: 1rem;">
            <el-button @click="bindArticle(article.idArticle)" :loading="loading" plain>添加至作品集</el-button>
          </el-col>
        </div>
      </el-card>
    </el-col>
    <el-col>
      <div class="vertical-container text-center">
        <el-pagination v-show="articles.pagination.total > 10" v-model="articles.pagination"
                       layout="prev, pager, next"
                       :current-page="articles.pagination.currentPage"
                       :total="articles.pagination.total"
                       @current-change="currentChange">
        </el-pagination>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "PortfolioManagerBind",
    props: {
      articles: {
        type: Object
      },
      idPortfolio: {
        type: Number
      }
    },
    data() {
      return {
        loading: false
      }
    },
    methods: {
      bindArticle(idArticle) {
        let _ts = this;
        _ts.$set(_ts, 'loading', true);
        _ts.$axios.$post('/api/portfolio/bind-article', {
          idArticle: idArticle,
          idPortfolio: _ts.idPortfolio
        }).then(function (res) {
          _ts.$set(_ts, 'loading', false);
          if (res) {
            _ts.$message(res.message);
            _ts.currentChange(1);
          }
        })
      },
      currentChange(page) {
        this.$emit('currentChange', page);
      }
    }
  }
</script>

<style scoped>

</style>
