<template>
  <el-row :gutter="8" class="text-center">
    <el-col :span="4">
      <el-card>
        <el-col class="mt-2rem dashboard-number">{{ dashboard.countUserNum }}</el-col>
        <el-col class="mt-2rem">总用户数</el-col>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card>
        <el-col class="mt-2rem dashboard-number">{{ dashboard.newUserNum }}</el-col>
        <el-col class="mt-2rem">新增用户</el-col>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card>
        <el-col class="mt-2rem dashboard-number">{{ dashboard.countArticleNum }}</el-col>
        <el-col class="mt-2rem">总文章数</el-col>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card>
        <el-col class="mt-2rem dashboard-number">{{ dashboard.newArticleNum }}</el-col>
        <el-col class="mt-2rem">今日文章数</el-col>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card>
        <el-col class="mt-2rem dashboard-number">{{ dashboard.countViewNum }}</el-col>
        <el-col class="mt-2rem">总浏览量</el-col>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card>
        <el-col class="mt-2rem dashboard-number">{{ dashboard.todayViewNum }}</el-col>
        <el-col class="mt-2rem">今日浏览量</el-col>
      </el-card>
    </el-col>
    <el-col :span="24">
      <div style="width: 100%;">
        <el-col :span="24">
          <el-col :span="24" style="text-align: left;">
            <h3>新增文章列表</h3>
          </el-col>
          <el-table :data="articles.list" style="width: 100%">
            <el-table-column label="#" width="60" prop="idArticle">
            </el-table-column>
            <el-table-column label="标题" prop="articleTitle">
              <template slot-scope="scope">
                <el-button type="text" @click="openLink(scope.row.articlePermalink)">{{ scope.row.articleTitle }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="标签" prop="articleTitle">
              <template slot-scope="scope">
                <el-tag style="margin-left: 0.5rem;" v-for="tag in scope.row.tags" :key="tag.idTag" size="mini"
                        effect="plain">
                  # {{ tag.tagTitle }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="最后更新时间" width="180" prop="updatedTime">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.row.articlePerfect === '1'" size="mini"
                           @click="cancelPreference(scope.$index, scope.row.idArticle)" plain>取消优选
                </el-button>
                <el-button v-else size="mini" @click="setPreference(scope.$index, scope.row.idArticle)" plain>设为优选
                </el-button>
                <el-button size="mini" type="primary" @click="updateTags(scope.$index, scope.row)" plain>编辑标签
                </el-button>
                <el-button v-if="scope.row.articleStatus === '0'" size="mini" type="danger"
                           @click="toggleStatus(scope.row.idArticle, 1)" plain>下架
                </el-button>
                <el-button v-else size="mini" type="success" @click="toggleStatus(scope.row.idArticle, 0)" plain>上架
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col>
          <el-pagination :hide-on-single-page="true" @size-change="handleArticleSizeChange"
                         @current-change="handleArticleCurrentChange" :current-page="articles.pageNum"
                         :page-sizes="[10, 20, 50, 100]" :page-size="articles.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="articles.total">
          </el-pagination>
        </el-col>
        <el-col :span="24">
          <el-col :span="24" style="text-align: left;">
            <h3>新增用户列表</h3>
          </el-col>
          <el-table :data="users.list" style="width: 100%">
            <el-table-column label="#" width="40" prop="idUser">
            </el-table-column>
            <el-table-column label="头像" width="60" prop="avatarUrl">
              <template slot-scope="scope">
                <el-avatar v-if="scope.row.avatarUrl" size="medium" :src="scope.row.avatarUrl"></el-avatar>
                <el-avatar v-else size="medium" src="https://rymcu.com/article/1578475481946.png"></el-avatar>
              </template>
            </el-table-column>
            <el-table-column label="昵称" width="140" prop="nickname">
              <template slot-scope="scope">
                <el-link type="primary" :href="getUserPath(scope.row.account)" :underline="false">
                  {{ scope.row.nickname }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="注册时间" width="180" prop="createdTime">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col>
          <el-pagination :hide-on-single-page="true" @size-change="handleUserSizeChange"
                         @current-change="handleUserCurrentChange" :current-page="users.pageNum"
                         :page-sizes="[10, 20, 50, 100]"
                         :page-size="users.pageSize" layout="total, sizes, prev, pager, next, jumper"
                         :total="users.total">
          </el-pagination>
        </el-col>
        <el-col :span="24">
          <el-col :span="24" style="text-align: left;">
            <h3>新增账户列表</h3>
          </el-col>
          <el-table :data="bankAccounts.list" style="width: 100%">
            <el-table-column label="#" width="40" prop="idBank">
            </el-table-column>
            <el-table-column label="银行账户" width="180" prop="bankAccount">
            </el-table-column>
            <el-table-column label="账户所有者" width="180" prop="accountOwnerName">
            </el-table-column>
            <el-table-column label="账户余额 (巴旦木)" width="180" prop="accountBalance">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="showTransfer(scope.$index, scope.row)" plain>发放新手奖励</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col>
          <el-pagination :hide-on-single-page="true" @size-change="handleBankAccountSizeChange"
                         @current-change="handleBankAccountCurrentChange" :current-page="bankAccounts.pageNum"
                         :page-sizes="[10, 20, 50, 100]" :page-size="bankAccounts.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="bankAccounts.total">
          </el-pagination>
        </el-col>
      </div>
    </el-col>
    <el-col class="mt-2rem">
      <div id="lastThirtyDays" style="width: 100%;height: 500px;"></div>
    </el-col>
    <el-col class="mt-2rem">
      <div id="lastThirtyDays2" style="width: 100%;height: 500px;"></div>
    </el-col>
    <el-col class="mt-2rem">
      <div id="history" style="width: 100%;height: 500px;"></div>
    </el-col>
    <el-col class="mt-2rem">
      <div id="history2" style="width: 100%;height: 500px;"></div>
    </el-col>
    <el-col>
      <el-dialog :visible.sync="dialogVisible" title="发放新手奖励">
        <el-form label-width="180px">
          <el-form-item label="收款账户">
            <el-input v-model="toBankAccount" style="width: 300px;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button v-if="toBankAccount" type="primary" @click="transfer">确 定</el-button>
          <el-button v-else type="primary" :disabled="true">确 定</el-button>
        </div>
      </el-dialog>
    </el-col>
    <el-col>
      <el-dialog :visible.sync="tagsDialogVisible">
        <edit-tags :idArticle="idArticle" :tags="articleTags" @closeDialog="closeTagsDialog">
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
import Vue from 'vue';
import {mapState} from 'vuex';
import echarts from 'echarts';
import EditTags from '~/components/widget/tags';

Vue.prototype.$echarts = echarts;
export default {
  name: "Dashboard",
  middleware: 'auth',
  components: {
    EditTags
  },
  asyncData({store, params, error}) {
    return Promise.all([
      store
        .dispatch('dashboard/fetchDashboard', params)
        .catch(err => error({statusCode: 404})),
      store.dispatch("dashboard/fetchLastThirtyDays", params),
      store.dispatch("dashboard/fetchHistory", params),
      store.dispatch("dashboard/fetchNewUsers", params),
      store.dispatch("dashboard/fetchNewBankAccounts", params),
      store.dispatch("dashboard/fetchNewArticles", params)
    ])
  },
  computed: {
    ...mapState({
      dashboard: state => state.dashboard.data,
      lastThirtyDays: state => state.dashboard.lastThirtyDays,
      history: state => state.dashboard.history,
      users: state => state.dashboard.users,
      bankAccounts: state => state.dashboard.bankAccounts,
      articles: state => state.dashboard.articles,
    })
  },
  data() {
    return {
      toBankAccount: '',
      dialogVisible: false,
      tagsDialogVisible: false,
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
    initLastThirtyDaysCharts(data) {
      let myChart = this.$echarts.init(document.getElementById('lastThirtyDays'));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: '最近 30 天'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ["文章", "用户"]
        },
        xAxis: {
          type: 'category',
          data: data.dates
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '文章',
          data: data.articles,
          type: 'line',
          smooth: true,
          areaStyle: {}
        },
        {
          name: '用户',
          data: data.users,
          type: 'line',
          smooth: true,
          areaStyle: {}
        }]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);

      let myChart2 = this.$echarts.init(document.getElementById('lastThirtyDays2'));
      // 指定图表的配置项和数据
      let option2 = {
        title: {
          text: '最近 30 天'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ["访客数", "浏览量"]
        },
        xAxis: {
          type: 'category',
          data: data.dates
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '访客数',
            data: data.visitIps,
            type: 'line',
            smooth: true,
            areaStyle: {}
          },
          {
            name: '浏览量',
            data: data.visits,
            type: 'line',
            smooth: true,
            areaStyle: {}
          }]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart2.setOption(option2);
    },
    initHistoryCharts(data) {
      let myChart = this.$echarts.init(document.getElementById('history'));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: '历史'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ["文章", "用户"]
        },
        xAxis: {
          type: 'category',
          data: data.dates
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '文章',
          data: data.articles,
          type: 'line',
          smooth: true,
          areaStyle: {}
        },
        {
          name: '用户',
          data: data.users,
          type: 'line',
          smooth: true,
          areaStyle: {}
        }]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);

      let myChart2 = this.$echarts.init(document.getElementById('history2'));
      // 指定图表的配置项和数据
      let option2 = {
        title: {
          text: '历史'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ["访客数", "浏览量"]
        },
        xAxis: {
          type: 'category',
          data: data.dates
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '访客数',
          data: data.visitIps,
          type: 'line',
          smooth: true,
          areaStyle: {}
        },
        {
          name: '浏览量',
          data: data.visits,
          type: 'line',
          smooth: true,
          areaStyle: {}
        }]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart2.setOption(option2);
    },
    getUserPath(nickname) {
      return `/user/${nickname}`
    },
    showTransfer(index, bank) {
      let _ts = this;
      _ts.$set(_ts, 'toBankAccount', bank.bankAccount);
      _ts.$set(_ts, 'dialogVisible', true);
    },
    transfer() {
      let _ts = this;
      _ts.$axios.$post("/api/transaction/newbie-rewards", {
        toBankAccount: _ts.toBankAccount
      }).then(function (res) {
        if (res) {
          if (res.idTransactionRecord) {
            _ts.$message({
              type: 'success',
              message: '划转成功!'
            });
            _ts.$set(_ts, 'dialogVisible', false);
          } else {
            _ts.$message({
              type: 'error',
              message: '请勿重复发放奖励!'
            });
          }
        }
      })
    },
    openLink(link) {
      window.open(link);
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
      _ts.$set(_ts, 'tagsDialogVisible', true);
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
    closeTagsDialog() {
      this.$set(this, 'tagsDialogVisible', false);
    },
    handleArticleSizeChange(pageSize) {
      let _ts = this;
      _ts.$store.dispatch('dashboard/fetchNewArticles', {
        page: _ts.pageNum,
        rows: pageSize
      })
    },
    handleArticleCurrentChange(page) {
      let _ts = this;
      _ts.$store.dispatch('dashboard/fetchNewArticles', {
        page: page,
        rows: _ts.pageSize
      })
    },
    handleUserSizeChange(pageSize) {
      let _ts = this;
      _ts.$store.dispatch('dashboard/fetchNewUsers', {
        page: _ts.pageNum,
        rows: pageSize
      })
    },
    handleUserCurrentChange(page) {
      let _ts = this;
      _ts.$store.dispatch('dashboard/fetchNewUsers', {
        page: page,
        rows: _ts.pageSize
      })
    },
    handleBankAccountSizeChange(pageSize) {
      let _ts = this;
      _ts.$store.dispatch('dashboard/fetchNewBankAccounts', {
        page: _ts.pageNum,
        rows: pageSize
      })
    },
    handleBankAccountCurrentChange(page) {
      let _ts = this;
      _ts.$store.dispatch('dashboard/fetchNewBankAccounts', {
        page: page,
        rows: _ts.pageSize
      })
    },
  },
  mounted() {
    this.$store.commit("setActiveMenu", "admin-dashboard");
    this.initLastThirtyDaysCharts(this.lastThirtyDays)
    this.initHistoryCharts(this.history)
  }
}
</script>

<style scoped>
.mt-2rem {
  margin: 2rem auto;
}

.dashboard-number {
  font-weight: bold;
  font-size: 2em;
}
</style>
