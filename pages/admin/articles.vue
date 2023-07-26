<template>
  <el-row style="margin-top: 20px;">
    <el-col style="margin-bottom: 1rem;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col style="margin-bottom: 1rem;">
      <el-pagination
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="articles.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="articles.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="articles.total">
      </el-pagination>
    </el-col>
    <el-col>
      <el-table
        :data="articles.list"
        style="width: 100%">
        <el-table-column
          label="#"
          width="60"
          prop="idArticle">
        </el-table-column>
        <el-table-column
          label="标题"
          prop="articleTitle">
          <template slot-scope="scope">
            <el-button type="text" @click="openLink(scope.row.articlePermalink)">{{
                scope.row.articleTitle
              }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="标签"
          prop="articleTitle">
          <template slot-scope="scope">
            <el-tag
              style="margin-left: 0.5rem;"
              v-for="tag in scope.row.tags"
              :key="tag.idTag"
              size="mini"
              effect="plain">
              # {{ tag.tagTitle }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="作者"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="openLink('/user/' + scope.row.articleAuthor.userAccount)">
              {{ scope.row.articleAuthorName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="最后更新时间"
          width="110"
          prop="updatedTime">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.articlePerfect === '1'" size="mini"
                       @click="cancelPreference(scope.$index, scope.row.idArticle)" plain>取消优选
            </el-button>
            <el-button v-else size="mini" @click="setPreference(scope.$index, scope.row.idArticle)" plain>设为优选
            </el-button>
            <el-button size="mini" type="primary"
                       @click="updateTags(scope.$index, scope.row)" plain>编辑标签
            </el-button>
            <el-button v-if="scope.row.articleStatus === '0'" size="mini" type="danger"
                       @click="toggleStatus(scope.row.idArticle, 1)" plain>下架
            </el-button>
            <el-button v-else size="mini" type="success"
                       @click="toggleStatus(scope.row.idArticle, 0)" plain>上架
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col>
      <el-pagination
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="articles.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="articles.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="articles.total">
      </el-pagination>
    </el-col>
    <el-col>
      <el-dialog :visible.sync="dialogVisible">
        <edit-tags
          :idArticle="idArticle"
          :tags="articleTags"
          @closeDialog="closeTagsDialog">
        </edit-tags>
      </el-dialog>
      <el-dialog title="下架文章" :visible.sync="dialogFormVisible">
        <el-form :model="article" label-width="80px">
          <el-form-item label="下架原因">
            <el-input type="textarea" v-model="article.remarks" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateStatus">确 定</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';
import EditTags from '~/components/widget/tags';

export default {
  name: "articles",
  middleware: 'auth',
  components: {
    EditTags
  },
  fetch() {
    let {store, params, error} = this.$nuxt.context
    return Promise.all([
      store
        .dispatch('admin/fetchArticles', params)
        .catch(err => error({statusCode: 404}))
    ])
  },
  computed: {
    ...mapState({
      articles: state => state.admin.articles
    })
  },
  data() {
    return {
      order: 'desc',
      idRole: 0,
      idUser: 0,
      dialogVisible: false,
      index: Number,
      idArticle: Number,
      articleTags: '',
      dialogFormVisible: false,
      article: {
        idArticle: 0,
        articleStatus: 0,
        remarks: '低质量或无意义文章!'
      }
    }
  },
  methods: {
    handleSizeChange(pageSize) {
      let _ts = this;
      _ts.$store.dispatch('admin/fetchArticles', {
        page: _ts.articles.pageNum,
        rows: pageSize
      })
    },
    handleCurrentChange(page) {
      let _ts = this;
      _ts.$store.dispatch('admin/fetchArticles', {
        page: page,
        rows: _ts.articles.pageSize
      })
    },
    toggleStatus(idArticle, status) {
      let _ts = this;
      _ts.article = {
        idArticle: idArticle,
        articleStatus: status,
        remarks: '低质量或无意义文章!'
      }
      // 下架文章填写下架原因
      if (status === 1) {
        _ts.dialogFormVisible = true;
      } else {
        _ts.$confirm('此操作将发布该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _ts.updateStatus();
        }).catch(() => {
          _ts.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    },
    updateStatus() {
      let _ts = this;
      _ts.$axios.$patch("/api/admin/article/update-status", _ts.article).then(function (res) {
        if (res) {
          _ts.article = {
            idArticle: 0,
            articleStatus: 0,
            remarks: '低质量或无意义文章!'
          }
          _ts.dialogFormVisible = false;
          _ts.$message.success("操作成功!");
        } else {
          _ts.$message.error("操作失败!");
        }
      })
    },
    setPreference(index, idArticle) {
      let _ts = this;
      _ts.$axios.$patch("/api/admin/article/update-perfect", {
        idArticle: idArticle,
        articlePerfect: '1'
      }).then(function (res) {
        if (res) {
          _ts.$store.commit('admin/updateArticlePreference', {
            index: index,
            idArticle: idArticle,
            articlePerfect: '1'
          })
          _ts.$message.success("设置成功!");
        } else {
          _ts.$message.error("设置失败!");
        }
      })
    },
    cancelPreference(index, idArticle) {
      let _ts = this;
      _ts.$axios.$patch("/api/article/update-perfect", {
        idArticle: idArticle,
        articlePerfect: '0'
      }).then(function (res) {
        if (res) {
          _ts.$store.commit('admin/updateArticlePreference', {
            index: index,
            idArticle: idArticle,
            articlePerfect: '0'
          })
          _ts.$message.success("取消成功!");
        } else {
          _ts.$message.error("取消失败!");
        }
      })
    },
    updateTags(index, article) {
      let _ts = this
      _ts.$set(_ts, 'index', index);
      _ts.$set(_ts, 'idArticle', article.idArticle);
      _ts.$set(_ts, 'articleTags', article.articleTags);
      _ts.$set(_ts, 'dialogVisible', true);
    },
    closeTagsDialog() {
      this.$set(this, 'dialogVisible', false);
    },
    openLink(link) {
      window.open(link);
    }
  }
}
</script>

<style scoped>

</style>
