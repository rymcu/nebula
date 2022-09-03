<template>
  <el-row>
    <el-col v-for="article in articles.list" :key="article.idArticle" style="padding-top: 1rem;">
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
      <div class="vertical-container text-center" style="padding-top: 10px;">
        <el-pagination :hide-on-single-page="true"
                       layout="prev, pager, next"
                       :current-page="articles.pageNum"
                       :total="articles.total"
                       prev-text="上一页"
                       next-text="下一页"
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
            _ts.$message('绑定成功!');
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
