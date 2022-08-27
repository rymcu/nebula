<template>
  <el-row>
    <el-col>
      <el-table :data="articles.list" style="width: 100%">
        <el-table-column
          label="#"
          width="40"
          prop="idArticle">
        </el-table-column>
        <el-table-column
          label="文章标题">
          <template slot-scope="scope">
            <el-link rel="nofollow" type="primary" @click.native="onRouter('article', scope.row.idArticle)" :underline="false">{{
              scope.row.articleTitle }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          label="排序(回车更新)"
          width="200">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.sortNo" @keyup.enter.native="updateArticleSortNo(scope.row)"
                             :min="1"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button @click="deletePortFolioArticle(scope.row.idArticle)">取消绑定</el-button>
          </template>
        </el-table-column>
      </el-table>
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
  import {mapState} from 'vuex';

  export default {
    name: "PortfolioManagerList",
    props: {
      idPortfolio: {
        type: Number
      }
    },
    validate({params, store}) {
      return !isNaN(Number(this.idPortfolio))
    },
    fetch({store, params, error}) {
      return Promise.all([
        store
          .dispatch('portfolio/fetchArticleList', {
            portfolio_id: this.idPortfolio
          })
          .catch(err => error({statusCode: 404}))
      ])
    },
    data() {
      return {
        articles: {
        }
      }
    },
    methods: {
      currentChange(page) {
        this.getArticleData(page);
      },
      async getArticleData(page){
        let _ts = this;
        const responseTopData = await this.$axios.$get('/api/console/portfolio/' + _ts.idPortfolio + '/articles?page='+page);
        if (responseTopData) {
          responseTopData.pageNum = page;
          _ts.$set(_ts, 'articles', responseTopData);
          window.scrollTo(0, 0);
        }
      },
      updateArticleSortNo(article) {
        let _ts = this;
        if (article.sortNo) {
          _ts.$axios.$put('/api/portfolio/update-article-sort-no',{
            idArticle: article.idArticle,
            idPortfolio: _ts.idPortfolio,
            sortNo: article.sortNo
          }).then(function (res) {
            if (res) {
              _ts.$message("更新成功!");
            }
          })
        } else {
          _ts.$message("排序号不能为空");
        }
      },
      deletePortFolioArticle(idArticle) {
        let _ts = this;
        _ts.$confirm('确定取消绑定吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _ts.$axios.$delete('/api/portfolio/unbind-article', {
            params: {
              idArticle: idArticle,
              idPortfolio: _ts.idPortfolio
            }
          }).then(function (res) {
            if (res) {
              _ts.$message('操作成功!');
              _ts.currentChange(_ts.articles.pageNum);
            }
          })
        }).catch(() => {
          _ts.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      onRouter (name, data) {
        if (name === 'article') {
          this.$router.push({
            path: `/article/${data}`
          })
        }
      }
    },
    mounted() {
      this.getArticleData(1);
    }
  }
</script>

<style scoped>

</style>
